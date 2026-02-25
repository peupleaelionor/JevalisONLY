import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { handleStripeWebhook } from "../server/stripe-webhook";

const app = express();

// Stripe webhook needs raw body — must come BEFORE json/cookie parser
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// Standard middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
