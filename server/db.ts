import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  simulations,
  payments,
  clientUsers,
  type InsertSimulation,
  type InsertPayment,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

/** Lazily create the drizzle instance so the app can run without a DB in dev. */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, {
        schema: { simulations, payments, clientUsers },
        mode: "default",
      });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Simulation helpers ─────────────────────────────────────────────────────

export async function createSimulation(data: InsertSimulation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(simulations).values(data);
  return data;
}

export async function getSimulationByPublicId(publicId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(simulations)
    .where(eq(simulations.publicId, publicId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSimulation(
  publicId: string,
  data: Partial<InsertSimulation>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(simulations)
    .set(data)
    .where(eq(simulations.publicId, publicId));
}

export async function listSimulations(
  limit: number = 100,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(simulations)
    .orderBy(desc(simulations.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countSimulations() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(simulations);
  return result.length;
}

export async function getSimulationsByClientUserId(clientUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(simulations)
    .where(eq(simulations.clientUserId, clientUserId))
    .orderBy(desc(simulations.createdAt));
}

// ─── Payment helpers ────────────────────────────────────────────────────────

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payments).values(data);
  return data;
}

export async function updatePaymentBySimulationId(
  simulationId: number,
  data: Partial<InsertPayment>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(payments)
    .set(data)
    .where(eq(payments.simulationId, simulationId));
}
