/**
 * Express app factory — shared between local server and Vercel serverless function.
 * Does NOT call listen() or serve static files (those are in index.ts / Vercel CDN).
 */
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handleStripeWebhook } from "../stripe-webhook";

const app = express();

// Stripe webhook — raw body must come BEFORE json parser
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Standard middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// tRPC API — rate limited (100 requests / 15 min per IP)
const trpcLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(
  "/api/trpc",
  trpcLimiter,
  createExpressMiddleware({ router: appRouter, createContext })
);

export default app;
