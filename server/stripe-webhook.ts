import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { payments, simulations } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendReportEmail, sendEbookEmail } from "./emailService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  if (!sig) { console.error("[Webhook] Missing signature"); return res.status(400).send("Missing signature"); }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`[Webhook] Signature failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const db = await getDb();
        if (db) await db.update(payments).set({ status: "succeeded", updatedAt: new Date() }).where(eq(payments.stripePaymentIntentId, pi.id));
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const db = await getDb();
        if (db) await db.update(payments).set({ status: "failed", updatedAt: new Date() }).where(eq(payments.stripePaymentIntentId, pi.id));
        break;
      }
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error(`[Webhook] Error: ${err.message}`);
    res.status(500).json({ error: "Processing failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const simulationId = session.metadata?.simulation_id;
  const productType = session.metadata?.product_type;
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email || "";
  const customerName = session.metadata?.customer_name || "";

  const db = await getDb();

  // Update payment
  if (session.payment_intent && db) {
    const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
    await db.update(payments).set({ stripeSessionId: session.id, stripePaymentIntentId: piId, status: "succeeded", updatedAt: new Date() }).where(eq(payments.stripeSessionId, session.id));
  }

  // Handle report (PREMIUM product)
  if (simulationId && (productType === "PREMIUM" || productType === "premium") && db) {
    const simResults = await db.select().from(simulations).where(eq(simulations.publicId, simulationId)).limit(1);
    if (simResults.length > 0) {
      const sim = simResults[0];
      await db.update(simulations).set({ status: "completed", updatedAt: new Date() }).where(eq(simulations.id, sim.id));
      // Send report email
      if (sim.reportUrl && customerEmail) {
        await sendReportEmail({
          to: customerEmail,
          name: customerName || sim.fullName || "Client",
          reportUrl: sim.reportUrl,
          operationType: sim.operationType,
          country: sim.country,
        });
        console.log(`[Webhook] Report email sent to ${customerEmail}`);
      }
    }
  }

  // Handle ebook (PACK_COMPLET)
  if ((productType === "PACK_COMPLET" || productType === "pack_complet") && customerEmail) {
    const ebookUrl = process.env.EBOOK_PDF_URL || `${process.env.APP_URL || ""}/ebook/guide-fiscal-europeen.pdf`;
    await sendEbookEmail({ to: customerEmail, name: customerName, ebookUrl });
    console.log(`[Webhook] Ebook email sent to ${customerEmail}`);
  }

  console.log(`[Webhook] Checkout completed for ${customerEmail}`);
}
