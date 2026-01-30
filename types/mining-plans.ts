import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  insertMiningPlanSchema,
  selectMiningPlanSchema,
  insertMiningPlanOptionSchema,
  selectMiningPlanOptionSchema,
  insertMiningPlanGpuSchema,
  selectMiningPlanGpuSchema,
  insertMiningInvestmentSchema,
  selectMiningInvestmentSchema,
  insertMiningPlanOptionGpuSchema,
  selectMiningPlanOptionGpuSchema,
  insertMiningInvestmentGpuSchema,
  selectMiningInvestmentGpuSchema,
} from "@/validation/mining-plans";

import {
  miningInvestmentsTable,
  miningPlanGpusTable,
  miningPlanOptionsTable,
  miningPlansTable,
  miningPlanOptionGpusTable,
  miningInvestmentGpusTable,
  PLAN_OPTION_TYPES,
  PLAN_STATUSES,
} from "@/db/schema";

// ============================
// ✅ TypeScript Types
// ============================

// TypeScript type
export type PlanOptionType = (typeof PLAN_OPTION_TYPES)[number];

// --- Mining Plans ---
export type InsertMiningPlan = z.infer<typeof insertMiningPlanSchema>;
export type SelectMiningPlan = z.infer<typeof selectMiningPlanSchema>;
export type MiningPlan = InferSelectModel<typeof miningPlansTable>;
export type NewMiningPlan = InferInsertModel<typeof miningPlansTable>;

// --- Mining Plan Options ---
export type InsertMiningPlanOption = z.infer<typeof insertMiningPlanOptionSchema>;
export type SelectMiningPlanOption = z.infer<typeof selectMiningPlanOptionSchema>;
export type MiningPlanOption = InferSelectModel<typeof miningPlanOptionsTable>;
export type NewMiningPlanOption = InferInsertModel<typeof miningPlanOptionsTable> & {
  totalPrice: string; // ✅ Explicitly included since it's required in schema
};

// --- Mining Plan GPUs ---
export type InsertMiningPlanGpu = z.infer<typeof insertMiningPlanGpuSchema>;
export type SelectMiningPlanGpu = z.infer<typeof selectMiningPlanGpuSchema>;
export type MiningPlanGpu = InferSelectModel<typeof miningPlanGpusTable>;
export type NewMiningPlanGpu = InferInsertModel<typeof miningPlanGpusTable>;

// --- Mining Investments ---
// ✅ Type-safe Plan Status from enum
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export type InsertMiningInvestment = z.infer<typeof insertMiningInvestmentSchema>;
export type SelectMiningInvestment = z.infer<typeof selectMiningInvestmentSchema>;

export type MiningInvestment = InferSelectModel<typeof miningInvestmentsTable>;
export type NewMiningInvestment = InferInsertModel<typeof miningInvestmentsTable>;

// --- Mining Plan Option ↔ GPU (Join Table) ---
export type InsertMiningPlanOptionGpu = z.infer<typeof insertMiningPlanOptionGpuSchema>;
export type SelectMiningPlanOptionGpu = z.infer<typeof selectMiningPlanOptionGpuSchema>;
export type MiningPlanOptionGpu = InferSelectModel<typeof miningPlanOptionGpusTable>;
export type NewMiningPlanOptionGpu = InferInsertModel<typeof miningPlanOptionGpusTable>;

// --- Mining Investment GPUs ---
export type InsertMiningInvestmentGpu = z.infer<typeof insertMiningInvestmentGpuSchema>;
export type SelectMiningInvestmentGpu = z.infer<typeof selectMiningInvestmentGpuSchema>;
export type MiningInvestmentGpu = InferSelectModel<typeof miningInvestmentGpusTable>;
export type NewMiningInvestmentGpu = InferInsertModel<typeof miningInvestmentGpusTable>;

// ============================
// Nested Types for Full Relations
// ============================


export type MiningPlanOptionWithGpus = MiningPlanOption & {
  gpus?: MiningPlanGpu[];
};

export type MiningPlanFull = MiningPlan & {
  options?: MiningPlanOptionWithGpus[];
};

export type MiningPlanSelected = MiningPlan & {
  selectedOption: MiningPlanOption & {
    selectedgpus: MiningPlanGpu[];
    totalPrice: string; // ✅ keep total price in selected option
  };
};

// Mining Investment with GPUs and Option
export type InsertMiningInvestmentWithGpus = InsertMiningInvestment & {
  gpus: Pick<MiningPlanGpu, "id">[];
};

// ==============================
// Investment Type (with relations)
// ==============================
export type Investment = MiningInvestment & {
  plan?: MiningPlan;
  option?: MiningPlanOption;
  gpus?: (MiningInvestmentGpu & {
    gpu?: MiningPlanGpu; // single object, not array
  })[];
};

export type GPUEntry ={
  gpu?: {
    hashRate?: string; // assuming hashRate is string
  };
}

export type SelectedGpu = {
  gpuId: string;
  fraction: string;
  pricePerGpu: string;
  quantity: number;
};
