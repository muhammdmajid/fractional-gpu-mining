// 📦 Drizzle ORM core imports
import { generateUniqueId } from "@/db/utils";
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  index,
  numeric,
} from "drizzle-orm/pg-core";
import { userTable } from "../user";

// 🗂️ Referral Table Schema
export const referralTable = pgTable(
  "referral",
  {
    // 🔑 Primary Key (unique ID for each referral entry)
    id: text("id")
      .primaryKey()
      .$defaultFn((): string => generateUniqueId("referral", 41)),

    // 👤 The user who sent the referral
    referrerId: text("referrer_id")
      .notNull()
      .references(() => userTable.id),

    // 👥 The user who received the referral
    refereeId: text("referee_id")
      .notNull()
      .references(() => userTable.id),

    // 💰 Reward-related fields
    rewardAmount: numeric("profit", { precision: 18, scale: 12 }).notNull(),
    rewardCurrency: text("reward_currency").notNull().default("USDT"), // reward currency type
    isWithdrawable: boolean("is_withdrawable").notNull().default(false), // flag: eligible for withdrawal
    isTransferredToWallet: boolean("is_transferred_to_wallet")
      .notNull()
      .default(false), // flag: already transferred to wallet

    // 🕒 Timestamp when referral was created
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    // ⚡ Index on referrerId for fast lookups
    index("referrer_idx").on(table.referrerId),

    // 🔒 Ensure (referrerId + refereeId) combination is always unique
    uniqueIndex("unique_referral_pair").on(table.referrerId, table.refereeId),
  ]
);
