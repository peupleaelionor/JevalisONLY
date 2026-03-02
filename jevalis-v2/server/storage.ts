/**
 * Storage helpers — Supabase Storage + S3 fallback
 */
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ── Supabase Storage (preferred) ──────────────────────────────────────────
async function supabasePut(key: string, data: Buffer, contentType: string): Promise<{ key: string; url: string } | null> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || "jevalis-reports";

  if (!url || !serviceKey) return null;

  try {
    const uploadUrl = `${url}/storage/v1/object/${bucket}/${key}`;
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: data,
    });

    if (!res.ok) {
      console.error("[Supabase Storage] Upload failed:", await res.text());
      return null;
    }

    // Generate signed URL (valid 7 days)
    const signedRes = await fetch(`${url}/storage/v1/object/sign/${bucket}/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
      body: JSON.stringify({ expiresIn: 7 * 24 * 3600 }),
    });

    if (!signedRes.ok) {
      // Fallback to public URL
      const publicUrl = `${url}/storage/v1/object/public/${bucket}/${key}`;
      return { key, url: publicUrl };
    }

    const { signedURL } = await signedRes.json() as { signedURL: string };
    return { key, url: `${url}/storage/v1${signedURL}` };
  } catch (err) {
    console.error("[Supabase Storage] Error:", err);
    return null;
  }
}

// ── S3 fallback ───────────────────────────────────────────────────────────
let _s3: S3Client | null = null;
function getS3(): S3Client | null {
  if (_s3) return _s3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;
  _s3 = new S3Client({
    region: process.env.AWS_REGION || "eu-west-3",
    ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true } : {}),
    credentials: { accessKeyId, secretAccessKey },
  });
  return _s3;
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream"): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);

  // 1. Try Supabase Storage
  const supabaseResult = await supabasePut(key, buffer, contentType);
  if (supabaseResult) return supabaseResult;

  // 2. Try S3
  const s3 = getS3();
  if (s3) {
    const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || "jevalis-reports";
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
    const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 7 * 24 * 3600 });
    return { key, url };
  }

  // 3. Base64 fallback (dev only)
  console.warn("[Storage] No storage configured. Using base64 fallback.");
  return { key, url: `data:${contentType};base64,${buffer.toString("base64")}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const s3 = getS3();
  if (s3) {
    const bucket = process.env.S3_BUCKET || "jevalis-reports";
    const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 7 * 24 * 3600 });
    return { key, url };
  }
  return { key, url: "" };
}
