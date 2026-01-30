import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { userWalletAccountTable } from "@/db/schema/user-wallet-account";
import {
  insertUserWalletAccountSchema,
  selectUserWalletAccountSchema,
} from "@/validation/user-wallet-account";
import { SelectTransactionPublic } from "./transaction";
import { User } from "./user";
import { MiningPlan, MiningPlanOption } from "./mining-plans";

// ============================
// ✅ TypeScript Types
// ============================

// Zod-based inferred types
export type InsertUserWalletAccount = z.infer<typeof insertUserWalletAccountSchema>;
export type SelectUserWalletAccount = z.infer<typeof selectUserWalletAccountSchema>;

// Drizzle model-based inferred types
export type UserWalletAccount = InferSelectModel<typeof userWalletAccountTable>;
export type NewUserWalletAccount = InferInsertModel<typeof userWalletAccountTable>;


export type SelectUserWalletAccountPublic = Omit<SelectUserWalletAccount, "createdAt" | "updatedAt" |"userId" >;


/**
 * Represents a combined type of wallet account info and transaction info
 */
// ✅ Transaction type with optional miningPlan & billingOption
export type TransactionWithDetails = SelectTransactionPublic & {
  miningPlan?: Pick<MiningPlan, "id" | "title" | "description"> | null;
  billingOption?: Pick<MiningPlanOption, "id" | "type" | "miningCycle"> | null;
};

// ✅ Account type with enriched transactions
export type AccountInfo = SelectUserWalletAccountPublic & {
  transactions: TransactionWithDetails[];
};
export type FinancialAccountsBundle = { 
  accounts: AccountInfo[]; 
  user: User; 
};

/**
 * Shape of transaction response data
 * - financialAccounts → accounts + transactions for the user(s)
 * - user → the current authenticated user
 */
export type FinancialAccountsResponse = {
  financialAccounts: FinancialAccountsBundle[];
  user: User;
}; 


export type UserWalletAccountWithUser = NewUserWalletAccount & {
  user?: User; // optional, because the relation may not always be loaded
};