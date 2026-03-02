/**
 * Stripe Payment Router
 * Gère la création de sessions de paiement Stripe pour les produits Jevalis
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { STRIPE_PRODUCTS, type ProductType } from "./stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const stripeRouter = router({
  /**
   * Créer une session de paiement Stripe Checkout
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        productType: z.enum(["PACK_COMPLET", "PREMIUM"]),
        simulationId: z.string(),
        customerEmail: z.string().email(),
        customerName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = STRIPE_PRODUCTS[input.productType];
      const origin = ctx.req.headers.origin || `https://${ctx.req.headers.host}`;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                  metadata: product.metadata,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/`,
          customer_email: input.customerEmail,
          client_reference_id: input.simulationId,
          metadata: {
            simulation_id: input.simulationId,
            product_type: input.productType,
            customer_name: input.customerName,
            customer_email: input.customerEmail,
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          checkoutUrl: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Error creating checkout session:", error);
        throw new Error("Impossible de créer la session de paiement");
      }
    }),

  /**
   * Créer une session de paiement direct pour l'ebook (sans simulation)
   */
  createEbookCheckout: publicProcedure
    .input(
      z.object({
        customerEmail: z.string().email().optional(),
        customerName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = STRIPE_PRODUCTS.PACK_COMPLET;
      const origin = ctx.req.headers.origin || `https://${ctx.req.headers.host}`;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                  metadata: product.metadata,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&product=ebook`,
          cancel_url: `${origin}/`,
          customer_email: input.customerEmail,
          metadata: {
            product_type: "PACK_COMPLET",
            customer_name: input.customerName || "",
            customer_email: input.customerEmail || "",
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          checkoutUrl: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Error creating ebook checkout session:", error);
        throw new Error("Impossible de créer la session de paiement");
      }
    }),

  /**
   * Vérifier le statut d'une session de paiement
   */
  getSessionStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          status: session.payment_status,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
        };
      } catch (error) {
        console.error("[Stripe] Error retrieving session:", error);
        throw new Error("Impossible de récupérer le statut de la session");
      }
    }),
});
