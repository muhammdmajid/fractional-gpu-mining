import { userWalletAccountTable } from "@/db/schema/user-wallet-account";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================
// ✅ Base Schema
// ============================
const baseUserWalletAccountSchema = createInsertSchema(userWalletAccountTable).extend({
  userId: z.string().min(1, "User ID is required."),

  balance: z
    .nonnegative("Balance cannot be negative."),

  currency: z.string(),

  availableAt: z.date().optional(), // can default from DB

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ============================
// ✅ Insert Schema
// ============================
export const insertUserWalletAccountSchema = baseUserWalletAccountSchema.omit({
  id: true,
  userId: true,
  balance: true,
  createdAt: true,
  updatedAt: true,
  availableAt: true
});

// ============================
// ✅ Select Schema
// ============================
export const selectUserWalletAccountSchema = createSelectSchema(userWalletAccountTable);

// ============================
// ✅ Update Schema
// ============================
export const updateUserWalletAccountSchema = baseUserWalletAccountSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial()
  .loose();

// ============================
// ✅ Inferred Types
// ============================
export type InsertUserWalletAccount = z.infer<typeof insertUserWalletAccountSchema>;
export type SelectUserWalletAccount = z.infer<typeof selectUserWalletAccountSchema>;
export type UpdateUserWalletAccount = z.infer<typeof updateUserWalletAccountSchema>;
