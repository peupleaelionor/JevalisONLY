import { relations } from "drizzle-orm";
import { simulations, payments, clientUsers } from "./schema";

export const clientUsersRelations = relations(clientUsers, ({ many }) => ({
  simulations: many(simulations),
}));

export const simulationsRelations = relations(simulations, ({ one, many }) => ({
  clientUser: one(clientUsers, {
    fields: [simulations.clientUserId],
    references: [clientUsers.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  simulation: one(simulations, {
    fields: [payments.simulationId],
    references: [simulations.id],
  }),
}));
