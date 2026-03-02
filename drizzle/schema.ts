import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Client users table -- email/password authentication
 */
export const clientUsers = mysqlTable("client_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type ClientUser = typeof clientUsers.$inferSelect;
export type InsertClientUser = typeof clientUsers.$inferInsert;

/**
 * Simulations table -- stores all simulation requests and computed results.
 */
export const simulations = mysqlTable("simulations", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  clientUserId: int("clientUserId"),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  country: varchar("country", { length: 32 }).notNull(),
  canton: varchar("canton", { length: 64 }),
  city: varchar("city", { length: 255 }).notNull(),
  operationType: varchar("operationType", { length: 32 }).notNull(),
  purchasePrice: decimal("purchasePrice", { precision: 15, scale: 2 }),
  salePrice: decimal("salePrice", { precision: 15, scale: 2 }),
  acquisitionDate: varchar("acquisitionDate", { length: 10 }),
  renovationCost: decimal("renovationCost", { precision: 15, scale: 2 }),
  loanAmount: decimal("loanAmount", { precision: 15, scale: 2 }),
  loanRate: decimal("loanRate", { precision: 5, scale: 3 }),
  loanDuration: int("loanDuration"),
  results: json("results"),
  reportUrl: text("reportUrl"),
  status: mysqlEnum("status", ["pending", "paid", "completed", "failed"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = typeof simulations.$inferInsert;

/**
 * Payments table -- tracks Stripe payment intents linked to simulations.
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  simulationId: int("simulationId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
