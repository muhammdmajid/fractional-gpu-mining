import { z } from "zod";
import {
  gpu_mining_hourly,
  gpu_mining_daily,
  gpu_mining_monthly,
} from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ==============================
// 1️⃣ GPU Mining Hourly Schema
// ==============================
const baseGpuMiningHourlySchema = createInsertSchema(gpu_mining_hourly).extend({
  plan_id: z.string().min(1, "Plan ID is required."),
  month_index: z.number().int().min(1, "Month index must be at least 1."),
  day_index: z.number().int().min(1, "Day index must be at least 1."),
  hour_index: z.number().int().min(0, "Hour index must be at least 0."),
  hour_ts: z.date(),
  profit: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Profit must be non-negative.")
  ),
});

export const insertGpuMiningHourlySchema =
  baseGpuMiningHourlySchema.omit({ id: true, created_at: true });
export const selectGpuMiningHourlySchema =
  createSelectSchema(gpu_mining_hourly);
export const updateGpuMiningHourlySchema =
  baseGpuMiningHourlySchema.omit({ id: true }).partial().loose();

// ==============================
// 2️⃣ GPU Mining Daily Schema
// ==============================
const baseGpuMiningDailySchema = createInsertSchema(gpu_mining_daily).extend({
  plan_id: z.string().min(1, "Plan ID is required."),
  month_index: z.number().int().min(1, "Month index must be at least 1."),
  day_index: z.number().int().min(1, "Day index must be at least 1."),
  day_start: z.date(),
  day_end: z.date(),
  profit: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Profit must be non-negative.")
  ),
});

export const insertGpuMiningDailySchema =
  baseGpuMiningDailySchema.omit({ id: true, created_at: true });
export const selectGpuMiningDailySchema = createSelectSchema(gpu_mining_daily);
export const updateGpuMiningDailySchema =
  baseGpuMiningDailySchema.omit({ id: true }).partial().loose();

// ==============================
// 3️⃣ GPU Mining Monthly Schema
// ==============================
const baseGpuMiningMonthlySchema =
  createInsertSchema(gpu_mining_monthly).extend({
    plan_id: z.string().min(1, "Plan ID is required."),
    month_index: z.number().int().min(1, "Month index must be at least 1."),
    month_start: z.date(),
    month_end: z.date(),
    hours_in_month: z.number().int().min(1, "Hours in month must be positive."),
    profit: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative("Profit must be non-negative.")
    ),
    withdrawable: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative("Withdrawable cannot be negative.")
    ),
    locked: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative("Locked cannot be negative.")
    ),
  });

export const insertGpuMiningMonthlySchema =
  baseGpuMiningMonthlySchema.omit({ id: true, created_at: true });
export const selectGpuMiningMonthlySchema =
  createSelectSchema(gpu_mining_monthly);
export const updateGpuMiningMonthlySchema =
  baseGpuMiningMonthlySchema.omit({ id: true }).partial().loose();


