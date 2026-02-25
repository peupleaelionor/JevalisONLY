/**
 * Vercel serverless entry point.
 * Exports the Express app so Vercel can invoke it as a serverless function.
 * Static files are served by Vercel's CDN from dist/public (see vercel.json).
 */
import app from "../server/_core/app";

export default app;
