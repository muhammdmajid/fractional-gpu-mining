import { relations } from "drizzle-orm";
import { accountTable, sessionTable,  } from "./tables";
import { userTable } from "../user";
import { miningInvestmentsTable } from "../mining-plans";

export const userRelations = relations(userTable, ({ many }) => ({
  accounts: many(accountTable),
  sessions: many(sessionTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));


// ==============================
// User → Mining Investments
// ==============================
export const userInvestmentTableRelations = relations(userTable, ({ many }) => ({
  miningInvestments: many(miningInvestmentsTable), // Get all investments for a user
}));