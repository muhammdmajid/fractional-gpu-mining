import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  gpu_mining_hourly,
  gpu_mining_daily,
  gpu_mining_monthly
} from "@/db/schema";
import {
  insertGpuMiningHourlySchema,
  selectGpuMiningHourlySchema,
  insertGpuMiningDailySchema,
  selectGpuMiningDailySchema,
  insertGpuMiningMonthlySchema,
  selectGpuMiningMonthlySchema,

} from "@/validation/fractional-mining-profit";
import { Investment, } from "./mining-plans";

// ============================
// ✅ TypeScript Types
// ============================

// --- GPU Mining Hourly ---
export type InsertGpuMiningHourly = z.infer<typeof insertGpuMiningHourlySchema>;
export type SelectGpuMiningHourly = z.infer<typeof selectGpuMiningHourlySchema>;
export type GpuMiningHourly = InferSelectModel<typeof gpu_mining_hourly>;
export type NewGpuMiningHourly = InferInsertModel<typeof gpu_mining_hourly>;

// --- GPU Mining Daily ---
export type InsertGpuMiningDaily = z.infer<typeof insertGpuMiningDailySchema>;
export type SelectGpuMiningDaily = z.infer<typeof selectGpuMiningDailySchema>;
export type GpuMiningDaily = InferSelectModel<typeof gpu_mining_daily>;
export type NewGpuMiningDaily = InferInsertModel<typeof gpu_mining_daily>;

// --- GPU Mining Monthly ---
export type InsertGpuMiningMonthly = z.infer<typeof insertGpuMiningMonthlySchema>;
export type SelectGpuMiningMonthly = z.infer<typeof selectGpuMiningMonthlySchema>;
export type GpuMiningMonthly = InferSelectModel<typeof gpu_mining_monthly>;
export type NewGpuMiningMonthly = InferInsertModel<typeof gpu_mining_monthly>;


// ============================
// Nested / Extended Types
// ============================

// Monthly with daily & hourly breakdown
export type GpuMiningMonthlyFull = GpuMiningMonthly & {
  daily?: GpuMiningDaily[];
  hourly?: GpuMiningHourly[];
  withdrawableAmount?: string;
};


// ------------------------------
// 🔹 Helper Types
// ------------------------------
type WithString<T, K extends keyof T> = Omit<T, K> & Record<K, string>;

export type HourlyData = WithString<GpuMiningHourly, "hourTimestamp">;
export type DailyData = WithString<GpuMiningDaily, "dayTimestamp">;
export type MonthlyData = WithString<GpuMiningMonthly, "monthStart" | "monthEnd"> & {
  monthStart: string;
  monthEnd: string;
};

// ------------------------------
// 🔹 Main Stream
// ------------------------------
export type MiningStatusStream = Investment & {
  latestUpdate: string;
  totalProfit: number;

  // ✅ Aggregated Totals
  profitLast7Hours: number;
  profitLast7Days: number;
  profitLast7Months: number;

  // ✅ Current values
  profitPreviousHour: number;
  profitPreviousDay: number;
  profitPreviousMonth: number;

  // ✅ Raw arrays (time-series data)
  last7HoursData: HourlyData[];
  last7DaysData: DailyData[];
  last7MonthsData: MonthlyData[];
  allMonths: MonthlyData[];

  // ✅ Single next values (nullable)
  nextHourData: HourlyData | null;
  nextDayData: DailyData | null;
  nextMonthData: MonthlyData | null;
};

// ------------------------------
// 🔹 Summaries
// ------------------------------
export type MiningPlanSummary = {
  planId: string;
  allMonths: MonthlyData[];
  totalProfit: number;
  currency:string;
  transferableProfit:number;
};

// A user’s plan with all its months and total profit
export type UserPlanFinancialReport = {
  profitMonths: MiningPlanSummary[];
  investments: Investment[];
};