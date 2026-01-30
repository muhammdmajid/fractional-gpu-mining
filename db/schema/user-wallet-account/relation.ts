// 📦 Drizzle ORM imports
import { relations } from "drizzle-orm";
import { transactionTable } from "../transaction";
import { userWalletAccountTable } from "../user-wallet-account";
import { userTable } from "../user";


// ============================
// 🔗 Wallet Account Relations
// ============================
export const userWalletAccountRelations = relations(userWalletAccountTable, ({ many, one }) => ({
  // Link wallet to its owner
  user: one(userTable, {
    fields: [userWalletAccountTable.userId],
    references: [userTable.id],
    relationName: "wallets",
  }),

  // Link wallet to its transactions
  transactions: many(transactionTable, {
    relationName: "walletTransactions",
  }),
}));


