import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { transactionTable, TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/db/schema/transaction";

// ============================
// ✅ Base Transaction Schema
// ============================
const baseTransactionSchema = createInsertSchema(transactionTable).extend({
  title: z.string().min(1, "Transaction title is required."),
  description: z.string().nullable().optional(),
  date: z
    .date()
    .refine((val) => !!val, { message: "Transaction date is required." }),
  type: z.enum(TRANSACTION_TYPES),
  status: z.enum(TRANSACTION_STATUSES).optional(),
  amount: z.number().positive("Transaction amount must be greater than 0."),
  walletId: z.string().min(1, "Wallet ID is required."),

  // 🆕 Optional third-party fields
  thirdpartyTransactionId: z.string().nullable().optional(),
  thirdpartyWithdrawalAddress: z.string().nullable().optional(),
})
.refine((data) => {
  // Deposit: only thirdpartyTransactionId allowed
  if (data.type === "deposit") {
    return true;
  }
  // Withdrawal: only thirdpartyWithdrawalAddress allowed
  if (data.type === "withdrawal") {
    return true;
  }
  return true;
}, {
  message: "Invalid third-party fields for the transaction type.",
  path: ["thirdpartyTransactionId", "thirdpartyWithdrawalAddress"],
});

// ============================
// ✅ Insert / Update / Select Schemas
// ============================

export const insertTransactionSchema = baseTransactionSchema.omit({ id: true });

export const selectTransactionSchema = createSelectSchema(transactionTable);

export const updateTransactionSchema = baseTransactionSchema
  .omit({ id: true })
  .partial()
  .loose();
