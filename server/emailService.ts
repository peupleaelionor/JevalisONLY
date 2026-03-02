/**
 * Email service via Resend
 * Envoie les rapports et confirmations par email
 */

interface SendReportEmailParams {
  to: string;
  name: string;
  reportUrl: string;
  operationType: string;
  country: string;
}

interface SendEbookEmailParams {
  to: string;
  name?: string;
  ebookUrl: string;
}

async function sendEmail(payload: object): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email");
    return false;
  }

  const from = `${process.env.RESEND_FROM_NAME || "Jevalis"} <${process.env.RESEND_FROM_EMAIL || "rapports@jevalis.com"}>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from, ...payload }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Email] Resend error:", err);
      return false;
    }
    console.log("[Email] Sent successfully");
    return true;
  } catch (err) {
    console.error("[Email] Network error:", err);
    return false;
  }
}

export async function sendReportEmail(params: SendReportEmailParams): Promise<boolean> {
  const opLabels: Record<string, string> = { achat: "Achat immobilier", vente: "Vente immobilière", achat_vente: "Achat + Vente" };
  const countryLabels: Record<string, string> = { france: "France", suisse: "Suisse", belgique: "Belgique", luxembourg: "Luxembourg", "pays-bas": "Pays-Bas", allemagne: "Allemagne" };

  return sendEmail({
    to: params.to,
    subject: `Votre rapport Jevalis — ${opLabels[params.operationType] || params.operationType} · ${countryLabels[params.country] || params.country}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Votre rapport Jevalis</title></head>
<body style="margin:0;padding:0;background-color:#0B1628;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:24px;font-weight:900;letter-spacing:0.15em;color:#ffffff;margin:0;">JE<span style="color:#C9A84C">V</span>ALIS</h1>
    </div>
    <!-- Card -->
    <div style="background:#0F1E35;border:1px solid rgba(201,168,76,0.3);padding:40px;border-radius:4px;">
      <div style="width:56px;height:56px;background:#C9A84C;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;text-align:center;line-height:56px;font-size:24px;">✓</div>
      <h2 style="color:#ffffff;font-size:22px;font-weight:800;text-align:center;margin:0 0 12px;">Votre rapport est prêt, ${params.name.split(" ")[0]} !</h2>
      <p style="color:#5A6E8A;text-align:center;font-size:15px;line-height:1.6;margin:0 0 32px;">Votre rapport de simulation fiscale immobilière pour votre opération <strong style="color:#C9A84C">${opLabels[params.operationType] || params.operationType}</strong> en <strong style="color:#ffffff">${countryLabels[params.country] || params.country}</strong> est disponible.</p>
      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${params.reportUrl}" style="display:inline-block;background:#C9A84C;color:#0B1628;font-weight:900;font-size:15px;text-decoration:none;padding:16px 40px;letter-spacing:0.05em;">
          📄 Télécharger mon rapport PDF
        </a>
      </div>
      <p style="color:#3A4E6A;font-size:12px;text-align:center;margin:0;">Ce lien est valable 30 jours. En cas de problème : <a href="mailto:support@jevalis.com" style="color:#C9A84C;">support@jevalis.com</a></p>
    </div>
    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="color:#2A3E5A;font-size:11px;line-height:1.6;">© 2026 Jevalis · Les résultats sont indicatifs et ne constituent pas un conseil fiscal.<br>
      <a href="https://jevalis.com/confidentialite" style="color:#3A4E6A;">Confidentialité</a> · <a href="https://jevalis.com/cgv" style="color:#3A4E6A;">CGV</a></p>
    </div>
  </div>
</body>
</html>
    `,
  });
}

export async function sendEbookEmail(params: SendEbookEmailParams): Promise<boolean> {
  const name = params.name || "cher client";
  return sendEmail({
    to: params.to,
    subject: "Votre Guide Fiscal Immobilier Européen — Jevalis",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Votre Guide Jevalis</title></head>
<body style="margin:0;padding:0;background-color:#0B1628;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:24px;font-weight:900;letter-spacing:0.15em;color:#ffffff;margin:0;">JE<span style="color:#C9A84C">V</span>ALIS</h1>
    </div>
    <div style="background:#0F1E35;border:1px solid rgba(201,168,76,0.3);padding:40px;border-radius:4px;">
      <h2 style="color:#ffffff;font-size:22px;font-weight:800;text-align:center;margin:0 0 12px;">📚 Votre guide est arrivé !</h2>
      <p style="color:#5A6E8A;text-align:center;font-size:15px;line-height:1.6;margin:0 0 32px;">Bonjour ${name.split(" ")[0]}, votre <strong style="color:#C9A84C">Guide Fiscal Immobilier Européen</strong> (20 pages) est disponible au téléchargement.</p>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${params.ebookUrl}" style="display:inline-block;background:#C9A84C;color:#0B1628;font-weight:900;font-size:15px;text-decoration:none;padding:16px 40px;">
          📥 Télécharger le guide PDF
        </a>
      </div>
      <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);padding:20px;border-radius:4px;margin-bottom:24px;">
        <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 8px;">Ce guide inclut :</p>
        <ul style="color:#8A9AB5;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Frais de notaire détaillés par pays</li>
          <li>Tableaux comparatifs fiscaux FR/CH/BE/LU/NL/DE</li>
          <li>Exemples chiffrés et cas pratiques</li>
          <li>Checklist avant signature notaire</li>
          <li>Stratégies d'optimisation fiscale légale</li>
        </ul>
      </div>
      <p style="color:#3A4E6A;font-size:12px;text-align:center;margin:0;">Lien valable 30 jours · <a href="mailto:support@jevalis.com" style="color:#C9A84C;">support@jevalis.com</a></p>
    </div>
    <div style="text-align:center;margin-top:32px;">
      <p style="color:#2A3E5A;font-size:11px;">© 2026 Jevalis · <a href="https://jevalis.com" style="color:#3A4E6A;">jevalis.com</a></p>
    </div>
  </div>
</body>
</html>
    `,
  });
}
