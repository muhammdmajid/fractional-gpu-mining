import { relations } from "drizzle-orm";
import {
  miningPlansTable,
  miningPlanOptionsTable,
  miningPlanGpusTable,
  miningPlanOptionGpusTable,
  miningInvestmentsTable,
  miningInvestmentGpusTable,
} from ".";
import { userTable } from "../user";
import { transactionTable } from "../transaction";
import { userWalletAccountTable } from "../user-wallet-account";

// ============================
// 🔹 miningPlansTable Relations
// Each plan can have multiple options and investments
// ============================
export const miningPlansTableRelations = relations(miningPlansTable, ({ many }) => ({
  options: many(miningPlanOptionsTable),
  investments: many(miningInvestmentsTable),
}));

// ============================
// 🔹 miningPlanOptionsTable Relations
// Each option belongs to a plan, can have multiple GPUs and investments
// ============================
export const miningPlanOptionsTableRelations = relations(miningPlanOptionsTable, ({ one, many }) => ({
  plan: one(miningPlansTable, {
    fields: [miningPlanOptionsTable.planId],
    references: [miningPlansTable.id],
  }),
  optionGpus: many(miningPlanOptionGpusTable),
  investments: many(miningInvestmentsTable),
}));

// ============================
// 🔹 miningPlanGpusTable Relations
// Each GPU can be linked to multiple options and investment GPUs
// ============================
export const miningPlanGpusTableRelations = relations(miningPlanGpusTable, ({ many }) => ({
  optionGpus: many(miningPlanOptionGpusTable),
  investmentGpus: many(miningInvestmentGpusTable),
}));

// ============================
// 🔹 miningPlanOptionGpusTable Relations
// Join table linking options and GPUs
// ============================
export const miningPlanOptionGpusTableRelations = relations(miningPlanOptionGpusTable, ({ one }) => ({
  option: one(miningPlanOptionsTable, {
    fields: [miningPlanOptionGpusTable.optionId],
    references: [miningPlanOptionsTable.id],
  }),
  gpu: one(miningPlanGpusTable, {
    fields: [miningPlanOptionGpusTable.gpuId],
    references: [miningPlanGpusTable.id],
  }),
}));

// ============================
// 🔹 miningInvestmentsTable Relations
// Each investment belongs to a plan, option, user, and transaction, and has multiple GPUs
// ============================
export const miningInvestmentsTableRelations = relations(miningInvestmentsTable, ({ one, many }) => ({
  plan: one(miningPlansTable, {
    fields: [miningInvestmentsTable.planId],
    references: [miningPlansTable.id],
  }),
  option: one(miningPlanOptionsTable, {
    fields: [miningInvestmentsTable.optionId],
    references: [miningPlanOptionsTable.id],
  }),
  user: one(userTable, {
    fields: [miningInvestmentsTable.email],
    references: [userTable.email],
  }),
  depositTransaction: one(transactionTable, {
    fields: [miningInvestmentsTable.transactionDepositId],
    references: [transactionTable.id],
  }),
  gpus: many(miningInvestmentGpusTable),
}));

// ============================
// 🔹 miningInvestmentGpusTable Relations
// Each investment GPU is linked to an investment and a GPU
// ============================
export const miningInvestmentGpusTableRelations = relations(miningInvestmentGpusTable, ({ one }) => ({
  investment: one(miningInvestmentsTable, {
    fields: [miningInvestmentGpusTable.investmentId],
    references: [miningInvestmentsTable.id],
  }),
  gpu: one(miningPlanGpusTable, {
    fields: [miningInvestmentGpusTable.gpuId],
    references: [miningPlanGpusTable.id],
  }),
}));

// ============================
// 🔹 transactionTable Relations
// Each transaction belongs to a wallet (user account) and optionally links to a mining plan/option
// ============================
export const planstransactionRelations = relations(transactionTable, ({ one }) => ({
  wallet: one(userWalletAccountTable, {
    fields: [transactionTable.walletId],
    references: [userWalletAccountTable.id],
  }),
  miningPlan: one(miningPlansTable, {
    fields: [transactionTable.miningPlanId],
    references: [miningPlansTable.id],
  }),
  billingOption: one(miningPlanOptionsTable, {
    fields: [transactionTable.billingOptionId],
    references: [miningPlanOptionsTable.id],
  }),
}));
