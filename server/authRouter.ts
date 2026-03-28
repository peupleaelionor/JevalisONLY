/**
 * Authentication Router
 * Gère l'authentification admin (email/password fixe) et clients (inscription/connexion)
 */

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { getDb, getSimulationsByClientUserId } from "./db";
import { clientUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

// Admin credentials (à configurer dans les variables d'environnement)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jevalis.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // À changer en production !

export const authRouter = router({
  /**
   * Login Admin (email/password fixe)
   */
  loginAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.email !== ADMIN_EMAIL || input.password !== ADMIN_PASSWORD) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou mot de passe incorrect",
        });
      }

      // Créer une session admin (cookie)
      ctx.res.cookie("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      return {
        success: true,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
        },
      };
    }),

  /**
   * Logout Admin
   */
  logoutAdmin: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("admin_session");
    return { success: true };
  }),

  /**
   * Vérifier la session admin
   */
  checkAdminSession: publicProcedure.query(({ ctx }) => {
    const isAdmin = ctx.req.cookies?.admin_session === "true";
    return {
      isAuthenticated: isAdmin,
      user: isAdmin ? { email: ADMIN_EMAIL, role: "admin" } : null,
    };
  }),

  /**
   * Inscription Client
   */
  registerClient: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        fullName: z.string().min(2, "Le nom complet est requis"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier si l'email existe déjà
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [existing] = await db.select().from(clientUsers).where(eq(clientUsers.email, input.email)).limit(1);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un compte existe déjà avec cet email",
        });
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      // Créer l'utilisateur
      const [newUser] = await db!.insert(clientUsers).values({
        email: input.email,
        passwordHash,
        fullName: input.fullName,
      });

      // Créer une session client (cookie)
      ctx.res.cookie("client_session", newUser.insertId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
      });

      return {
        success: true,
        user: {
          id: newUser.insertId,
          email: input.email,
          fullName: input.fullName,
        },
      };
    }),

  /**
   * Connexion Client
   */
  loginClient: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Trouver l'utilisateur
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [user] = await db.select().from(clientUsers).where(eq(clientUsers.email, input.email)).limit(1);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou mot de passe incorrect",
        });
      }

      // Vérifier le mot de passe
      const isValid = await bcrypt.compare(input.password, user.passwordHash);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou mot de passe incorrect",
        });
      }

      // Mettre à jour lastSignedIn
      await db!
        .update(clientUsers)
        .set({ lastSignedIn: new Date() })
        .where(eq(clientUsers.id, user.id));

      // Créer une session client (cookie)
      ctx.res.cookie("client_session", user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      };
    }),

  /**
   * Logout Client
   */
  logoutClient: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("client_session");
    return { success: true };
  }),

  /**
   * Récupérer l'utilisateur client connecté
   */
  getCurrentClient: publicProcedure.query(async ({ ctx }) => {
    const clientId = ctx.req.cookies?.client_session;

    if (!clientId) {
      return { user: null };
    }

    const db = await getDb();
    if (!db) return { user: null };

    const [user] = await db.select().from(clientUsers).where(eq(clientUsers.id, parseInt(clientId))).limit(1);

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    };
  }),

  /**
   * Récupérer l'historique des simulations de l'utilisateur connecté
   */
  getMySimulations: publicProcedure.query(async ({ ctx }) => {
    const clientId = ctx.req.cookies?.client_session;

    if (!clientId) {
      return { simulations: [] };
    }

    const simulations = await getSimulationsByClientUserId(parseInt(clientId));

    return {
      simulations: simulations.map(sim => ({
        id: sim.id,
        publicId: sim.publicId,
        country: sim.country,
        city: sim.city,
        operationType: sim.operationType,
        purchasePrice: sim.purchasePrice,
        reportUrl: sim.reportUrl,
        status: sim.status,
        createdAt: sim.createdAt,
      })),
    };
  }),
});
