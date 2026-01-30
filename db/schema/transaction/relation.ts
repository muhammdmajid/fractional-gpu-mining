import { relations } from "drizzle-orm";
import { transactionTable } from ".";
import { userWalletAccountTable } from "../user-wallet-account";
import { miningPlanOptionsTable, miningPlansTable } from "../mining-plans";


// ============================
// ✅ Transaction Relations
// ============================
export const transactionRelations = relations(transactionTable, ({ one }) => ({
  // Each transaction belongs to one wallet
  wallet: one(userWalletAccountTable, {
    fields: [transactionTable.walletId],
    references: [userWalletAccountTable.id],
    relationName: "transactions",
  }),

  // Optional mining plan associated with the transaction
  miningPlan: one(miningPlansTable, {
    fields: [transactionTable.miningPlanId],
    references: [miningPlansTable.id],
    relationName: "transactions",
  }),

  // Optional billing option associated with the transaction
  billingOption: one(miningPlanOptionsTable, {
    fields: [transactionTable.billingOptionId],
    references: [miningPlanOptionsTable.id],
    relationName: "transactions",
  }),
}));
