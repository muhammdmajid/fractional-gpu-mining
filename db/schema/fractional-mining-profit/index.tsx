// db/schema/gpu-mining.ts
import {
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { miningInvestmentsTable } from "../mining-plans";
import { generateUniqueId } from "@/db/utils";

// ============================
// ✅ GPU Mining Daily Table
// ----------------------------
// Must come after monthly
export const gpu_mining_daily = pgTable("gpu_mining_daily", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("gmd", 35)),
  planId: text("plan_id")
    .notNull()
    .references(() => miningInvestmentsTable.id),
  monthlyId: text("month_id")
    .notNull()
    .references(() => gpu_mining_monthly.id), // references monthly
  dayTimestamp: timestamp("day_ts").notNull(),
  profit: numeric("profit", { precision: 18, scale: 12 }).notNull(),
  currency: text("currency").default("USDT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================
// ✅ GPU Mining Hourly Table
// ----------------------------
// Must come after daily
export const gpu_mining_hourly = pgTable("gpu_mining_hourly", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("gmh", 35)),
  planId: text("plan_id")
    .notNull()
    .references(() => miningInvestmentsTable.id),
  dailyId: text("daily_id")
    .notNull()
    .references(() => gpu_mining_daily.id), // references daily
  hourTimestamp: timestamp("hour_ts").notNull(),
  profit: numeric("profit", { precision: 18, scale: 12 }).notNull(),
  currency: text("currency").default("USDT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================
// ✅ GPU Mining Withdrawals Table
// ----------------------------
export const WITHDRAWAL_STATUSES = [
  "pending",
  "completed",
  "failed",
  "cancelled",
] as const;
export const withdrawalStatusEnum = pgEnum(
  "withdrawal_status",
  WITHDRAWAL_STATUSES
);

// ============================
// ✅ GPU Mining Monthly Table
// ----------------------------
// Must be defined first because daily references monthly
export const gpu_mining_monthly = pgTable("gpu_mining_monthly", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("gmm", 35)),
  planId: text("plan_id")
    .notNull()
    .references(() => miningInvestmentsTable.id),
  monthStart: timestamp("starting_date").notNull(),
  monthEnd: timestamp("ending_date").notNull(),
  profit: numeric("profit", { precision: 18, scale: 12 }).notNull(),
  currency: text("currency").default("USDT"),

  withdrawable: boolean("withdrawable").notNull().default(false),
  locked: boolean("locked").notNull().default(false),

  // ✅ New field: marks whether profit was transferred to main wallet
  isTransferred: boolean("is_transferred").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

