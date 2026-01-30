import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { referralTable } from "@/db/schema";

// ----------------------------
// ✅ Base Schema
// ----------------------------
const baseReferralSchema = createInsertSchema(referralTable).extend({
  referrerId: z.string().min(10, "Invalid referrerId"),
  refereeId: z.string().min(10, "Invalid refereeId"),
  // ✅ Rewards & financial fields
  rewardAmount: z.number().int().nonnegative().default(0),
  rewardCurrency: z.string().default("USDT"),
  isWithdrawable: z.boolean().default(false),
  isTransferredToWallet: z.boolean().default(false),
});

// ----------------------------
// ✅ Insert Schema
// ----------------------------
export const insertReferralSchema = baseReferralSchema.omit({
  id: true,
  createdAt: true, // auto-generated
   isWithdrawable:true, // auto-generated
    isTransferredToWallet: true, // auto-generated
});

// ----------------------------
// ✅ Select Schema
// ----------------------------
export const selectReferralSchema = createSelectSchema(referralTable);

// ----------------------------
// ✅ Update Schema
// ----------------------------
export const updateReferralSchema = baseReferralSchema
  .omit({ id: true, createdAt: true })
  .partial()
  .loose();
