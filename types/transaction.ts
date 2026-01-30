import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { TRANSACTION_STATUSES, TRANSACTION_TYPES, transactionTable } from "@/db/schema/transaction";
import {  insertTransactionSchema, selectTransactionSchema ,updateTransactionSchema} from "@/validation/transaction";


// Literal types for statuses and types
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
// ============================
// ✅ TypeScript Types
// ============================
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SelectTransaction = z.infer<typeof selectTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;

export type Transaction = InferSelectModel<typeof transactionTable>;
export type NewTransaction = InferInsertModel<typeof transactionTable>;
export type SelectTransactionPublic = Omit<SelectTransaction,  "walletId"| "createdAt" | "updatedAt" >;

