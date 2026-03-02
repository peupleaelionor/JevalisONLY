import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: { role: "admin"; email: string } | null;
};

/**
 * Creates context for each tRPC request.
 * Checks admin session from cookies.
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const isAdmin = opts.req.cookies?.admin_session === "true";

  return {
    req: opts.req,
    res: opts.res,
    user: isAdmin
      ? { role: "admin", email: process.env.ADMIN_EMAIL || "admin@jevalis.com" }
      : null,
  };
}
