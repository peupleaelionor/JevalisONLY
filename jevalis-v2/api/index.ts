/**
 * Vercel Serverless Function — Express adapter
 * Handles all /api/* routes in production.
 */
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { handleStripeWebhook } from "../server/stripe-webhook";
import cookieParser from "cookie-parser";

const app = express();

// Stripe webhook needs raw body — must come BEFORE json/urlencoded middleware
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext })
);

export default app;
