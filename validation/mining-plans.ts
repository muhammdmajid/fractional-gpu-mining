import { z } from "zod";
import {
  miningPlansTable,
  miningPlanOptionsTable,
  miningPlanGpusTable,
  miningPlanOptionGpusTable,
  miningInvestmentsTable,
  miningInvestmentGpusTable,
  PLAN_STATUSES,
} from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ==============================
// 1️⃣ Mining Plans Schema
// ==============================
const baseMiningPlanSchema = createInsertSchema(miningPlansTable).extend({
  title: z.string().min(1, "Plan title is required."),
  description: z.string().min(1, "Plan description is required."),
  features: z.array(z.any()).nonempty("Features cannot be empty."),
  actionLabel: z.string().min(1, "Action label is required."),
  popular: z.boolean().optional(),
  custom: z.boolean().optional(),
  priority: z.number().int().min(1, "Priority must be at least 1."),
});

export const insertMiningPlanSchema = baseMiningPlanSchema.omit({ id: true });
export const selectMiningPlanSchema = createSelectSchema(miningPlansTable);
export const updateMiningPlanSchema = baseMiningPlanSchema
  .omit({ id: true })
  .partial()
  .loose();

// ==============================
// 2️⃣ Mining Plan Options Schema
// ==============================
const baseMiningPlanOptionSchema = createInsertSchema(miningPlanOptionsTable).extend({
  planId: z.string().min(1, "Plan ID is required."),
  type: z.enum(["monthly", "yearly"]),
  miningCycle: z.number().int().positive("Lock period must be positive."),
  basePrice: z.number().positive("Base price must be positive."),
  totalPrice: z.number().positive("Total price must be positive."), // ✅ added
  baseDiscount: z.number().min(0).max(100).optional(),
});

export const insertMiningPlanOptionSchema = baseMiningPlanOptionSchema.omit({ id: true });
export const selectMiningPlanOptionSchema = createSelectSchema(miningPlanOptionsTable);
export const updateMiningPlanOptionSchema = baseMiningPlanOptionSchema
  .omit({ id: true })
  .partial()
  .loose();

// ==============================
// 3️⃣ Mining Plan GPUs Schema
// ==============================
const baseMiningPlanGpuSchema = createInsertSchema(miningPlanGpusTable).extend({
  model: z.string().min(1, "GPU model is required."),
  memory: z.string().min(1, "Memory info is required."),
  hashRate: z.string().min(1, "Hash rate is required."),
  powerConsumption: z.string().min(1, "Power consumption is required."),
  fraction: z.number().min(0, "Fraction must be at least 0."),
  pricePerGpu: z.number().positive("Price per GPU must be positive."),
});

export const insertMiningPlanGpuSchema = baseMiningPlanGpuSchema.omit({ id: true });
export const selectMiningPlanGpuSchema = createSelectSchema(miningPlanGpusTable);
export const updateMiningPlanGpuSchema = baseMiningPlanGpuSchema
  .omit({ id: true })
  .partial()
  .loose();

// ==============================
// 4️⃣ Mining Plan Option GPUs Schema (Join Table)
// ==============================
const baseMiningPlanOptionGpuSchema = createInsertSchema(miningPlanOptionGpusTable).extend({
  optionId: z.string().min(1, "Option ID is required."),
  gpuId: z.string().min(1, "GPU ID is required."),
});

export const insertMiningPlanOptionGpuSchema = baseMiningPlanOptionGpuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectMiningPlanOptionGpuSchema = createSelectSchema(miningPlanOptionGpusTable);
export const updateMiningPlanOptionGpuSchema = baseMiningPlanOptionGpuSchema
  .omit({ id: true })
  .partial()
  .loose();

// ==============================
// 5️⃣ Mining Investments Schema
// ==============================
export const baseMiningInvestmentSchema = createInsertSchema(miningInvestmentsTable).extend({
  planId: z.string().min(1, "Plan ID is required."),
  optionId: z.string().min(1, "Option ID is required."),
  depositAmount: z.number().positive("Paid price must be positive."),
});

export const insertMiningInvestmentSchema = baseMiningInvestmentSchema.omit({
  id: true,
  startDate: true,
  email: true,          // handled via auth context?
  createdAt: true,
  updatedAt: true,
  miningCycle: true, // computed from optionId?
  transactionDepositId:true,
  status:true
});
export const selectMiningInvestmentSchema = createSelectSchema(miningInvestmentsTable);
export const updateMiningInvestmentSchema = baseMiningInvestmentSchema
  .omit({ id: true })
  .partial()
  .loose();

// ==============================
// 6️⃣ Mining Investment GPUs Schema
// ==============================
const baseMiningInvestmentGpuSchema = createInsertSchema(miningInvestmentGpusTable).extend({
  investmentId: z.string().min(1, "Investment ID is required."),
  gpuId: z.string().min(1, "GPU ID is required."),
});

export const insertMiningInvestmentGpuSchema = baseMiningInvestmentGpuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectMiningInvestmentGpuSchema = createSelectSchema(miningInvestmentGpusTable);
export const updateMiningInvestmentGpuSchema = baseMiningInvestmentGpuSchema
  .omit({ id: true })
  .partial()
  .loose();
