import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { runSimulation, type SimulationInput } from "./financialEngine";
import { generateReportPDF } from "./pdfGenerator";
import { generateEbookPreview } from "./ebookPreviewGenerator";
import { storagePut } from "./storage";
import { stripeRouter } from "./stripeRouter";
import { authRouter } from "./authRouter";
import {
  createSimulation,
  getSimulationByPublicId,
  listSimulations,
  countSimulations,
  createPayment,
} from "./db";

// ─── Validation schemas ─────────────────────────────────────────────────────

const simulationInputSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  country: z.enum(["france", "suisse", "belgique", "luxembourg", "pays-bas", "allemagne"]),
  canton: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  operationType: z.enum(["achat", "vente", "achat_vente"]),
  purchasePrice: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  acquisitionDate: z.string().optional(),
  renovationCost: z.number().min(0).optional(),
  loanAmount: z.number().positive().optional(),
  loanRate: z.number().min(0).max(20).optional(),
  loanDuration: z.number().int().min(1).max(50).optional(),
});

export const appRouter = router({
  stripe: stripeRouter,
  clientAuth: authRouter,

  // ─── Simulation ─────────────────────────────────────────────────────

  simulation: router({
    /** Create a simulation and generate the PDF report */
    create: publicProcedure
      .input(simulationInputSchema)
      .mutation(async ({ input, ctx }) => {
        const publicId = nanoid(12);

        const simulationInput: SimulationInput = {
          country: input.country,
          canton: input.canton,
          city: input.city,
          operationType: input.operationType,
          purchasePrice: input.purchasePrice,
          salePrice: input.salePrice,
          acquisitionDate: input.acquisitionDate,
          renovationCost: input.renovationCost,
          loanAmount: input.loanAmount,
          loanRate: input.loanRate,
          loanDuration: input.loanDuration,
        };

        const results = runSimulation(simulationInput);
        const pdfBuffer = await generateReportPDF(results, input.fullName, input.email);
        const fileKey = `reports/${publicId}-${Date.now()}.pdf`;
        const { url: reportUrl } = await storagePut(fileKey, pdfBuffer, "application/pdf");

        const clientId = ctx.req.cookies?.client_session;
        const clientUserId = clientId ? parseInt(clientId) : null;

        await createSimulation({
          publicId,
          clientUserId,
          fullName: input.fullName,
          email: input.email,
          country: input.country,
          canton: input.canton ?? null,
          city: input.city,
          operationType: input.operationType,
          purchasePrice: input.purchasePrice?.toString() ?? null,
          salePrice: input.salePrice?.toString() ?? null,
          acquisitionDate: input.acquisitionDate ?? null,
          renovationCost: input.renovationCost?.toString() ?? null,
          loanAmount: input.loanAmount?.toString() ?? null,
          loanRate: input.loanRate?.toString() ?? null,
          loanDuration: input.loanDuration ?? null,
          results: results,
          reportUrl,
          status: "pending",
        });

        const sim = await getSimulationByPublicId(publicId);
        if (sim) {
          await createPayment({
            simulationId: sim.id,
            amount: "39.99",
            currency: "EUR",
            status: "pending",
          });
        }

        return { publicId, results, reportUrl, summary: results.summary };
      }),

    /** Get a simulation by public ID */
    get: publicProcedure
      .input(z.object({ publicId: z.string() }))
      .query(async ({ input }) => {
        const sim = await getSimulationByPublicId(input.publicId);
        if (!sim) throw new Error("Simulation introuvable");
        return sim;
      }),

    /** Preview results without saving (free) */
    preview: publicProcedure
      .input(simulationInputSchema.omit({ fullName: true, email: true }))
      .mutation(async ({ input }) => {
        const simulationInput: SimulationInput = {
          country: input.country,
          canton: input.canton,
          city: input.city,
          operationType: input.operationType,
          purchasePrice: input.purchasePrice,
          salePrice: input.salePrice,
          acquisitionDate: input.acquisitionDate,
          renovationCost: input.renovationCost,
          loanAmount: input.loanAmount,
          loanRate: input.loanRate,
          loanDuration: input.loanDuration,
        };

        const results = runSimulation(simulationInput);
        return {
          summary: results.summary,
          notaryFeesTotal: results.notaryFees?.total,
          capitalGainTax: results.capitalGain?.totalTax,
          loanMonthly: results.loan?.monthlyPayment,
          totalInvestment: results.totalInvestment,
        };
      }),
  }),

  // ─── Admin Dashboard ────────────────────────────────────────────────

  admin: router({
    listSimulations: adminProcedure
      .input(
        z
          .object({
            limit: z.number().int().min(1).max(500).default(100),
            offset: z.number().int().min(0).default(0),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const limit = input?.limit ?? 100;
        const offset = input?.offset ?? 0;
        const [sims, total] = await Promise.all([
          listSimulations(limit, offset),
          countSimulations(),
        ]);
        return { simulations: sims, total, limit, offset };
      }),

    stats: adminProcedure.query(async () => {
      const total = await countSimulations();
      const sims = await listSimulations(1000, 0);

      const byCountry: Record<string, number> = {};
      let totalRevenue = 0;
      let completedCount = 0;

      for (const sim of sims) {
        byCountry[sim.country] = (byCountry[sim.country] || 0) + 1;
        if (sim.status === "completed") {
          completedCount++;
          totalRevenue += 39.99;
        }
      }

      return { totalSimulations: total, completedSimulations: completedCount, totalRevenue, byCountry };
    }),

    exportCSV: adminProcedure.query(async () => {
      const sims = await listSimulations(10000, 0);
      const headers = [
        "ID", "Date", "Nom", "Email", "Pays", "Ville", "Canton",
        "Type", "Prix achat", "Prix vente", "Statut", "URL Rapport",
      ];
      const rows = sims.map((s) => [
        s.publicId, s.createdAt?.toISOString() ?? "", s.fullName, s.email,
        s.country, s.city, s.canton ?? "", s.operationType,
        s.purchasePrice ?? "", s.salePrice ?? "", s.status, s.reportUrl ?? "",
      ]);
      const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
      return { csv, count: sims.length };
    }),
  }),

  // ─── Ebook ──────────────────────────────────────────────────────────

  ebook: router({
    getPreview: publicProcedure.query(async () => {
      const pdfBuffer = await generateEbookPreview();
      const fileKey = `ebook-previews/preview-${Date.now()}.pdf`;
      const { url } = await storagePut(fileKey, pdfBuffer, "application/pdf");
      return { previewUrl: url };
    }),

    downloadFull: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async () => {
        const ebookUrl = process.env.EBOOK_PDF_URL || "";
        return { ebookUrl };
      }),
  }),
});

export type AppRouter = typeof appRouter;
