import { z } from "zod";
import {
  insertReferralSchema,
  selectReferralSchema,
  updateReferralSchema,
} from "@/validation/referrals";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { referralTable } from "@/db/schema";
import { User } from "./user";

// ----------------------------
// ✅ TypeScript Types
// ----------------------------

// Infer types from Zod validation schemas
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type SelectReferral = z.infer<typeof selectReferralSchema>;
export type UpdateReferral = z.infer<typeof updateReferralSchema>;

// Infer types directly from Drizzle ORM table
export type Referral = InferSelectModel<typeof referralTable>;
export type NewReferral = InferInsertModel<typeof referralTable>;

// ----------------------------
// ✅ Monthly Stats Interface
// ----------------------------
export interface ReferralMonthlyStat {
  month: string;
  referrals: number;
  rewardAmount: number;
}





export interface ReferrerInfo {
  name: string;
  referralCode: string;
  email?: string | null;
}



export type ReferralWithUsers = Referral & {
  referee: Pick<User, "id" | "name" | "email" | "firstName" | "lastName"> | null;
};


// ----------------------------
// ✅ Aggregated Referral Data Interface
// ----------------------------
export interface ReferralData {
  monthlyData: ReferralMonthlyStat[];
  totalReferrals: number;
  totalRewards: number;
  referralCode: string;
  referralLink: string;
  referrals: ReferralWithUsers[]

}