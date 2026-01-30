 
"use server";

import { db } from "@/db";
import { ServerResponse } from "@/types";
import {
  MiningPlanFull,
  MiningPlanGpu,
  MiningPlanOptionWithGpus,
} from "@/types/mining-plans";
import {
  miningPlansTable,
  miningPlanOptionsTable,
  miningPlanGpusTable,
  miningPlanOptionGpusTable,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllMiningPlans(): Promise<
  ServerResponse<MiningPlanFull[]>
> {
  try {
    // 1️⃣ Fetch all popular mining plans
    const plans = await db
      .select()
      .from(miningPlansTable)
      .where(eq(miningPlansTable.popular, true))
      .orderBy(asc(miningPlansTable.priority));

    if (!plans || !plans.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No mining plans found",
        data: [],
      };
    }

    // 2️⃣ Fetch all related records concurrently
    const [options, gpus, planGpuRelations] = await Promise.all([
      db.select().from(miningPlanOptionsTable),
      db.select().from(miningPlanGpusTable),
      db.select().from(miningPlanOptionGpusTable),
    ]);

    if (!options || !gpus || !planGpuRelations) {

      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "Failed to fetch related mining plan data",
        data: [],
      };
    }

    // 3️⃣ Build nested structure with validation
    const plansWithDetails: MiningPlanFull[] = plans.map((plan) => {
      if (!plan.id)
        throw new Error("Plan ID missing");

      const planOptions: MiningPlanOptionWithGpus[] = options
        .filter((opt) => opt.planId === plan.id)
        .map((opt) => {
          if (!opt.id) throw new Error("Option ID missing for a plan");

          // Get GPUs linked to this option
          const gpuIds = planGpuRelations
            .filter((rel) => rel.optionId === opt.id)
            .map((rel) => rel.gpuId);

          const optionGpus: MiningPlanGpu[] = gpus
            .filter((gpu) => gpuIds.includes(gpu.id))
            .map((gpu) => ({
              ...gpu,
              fraction: gpu.fraction?.toString() ?? "0",
              pricePerGpu: gpu.pricePerGpu?.toString() ?? "0",
            }));

          // Calculate totals safely
          const gpuTotal = optionGpus.reduce(
            (sum, gpu) => sum + Number(gpu.pricePerGpu || 0),
            0
          );

          const basePrice = Number(opt.basePrice || 0);
          const discount = Number(opt.baseDiscount || 0);

          const monthlyTotal = basePrice + gpuTotal;
          const yearlyTotal = monthlyTotal * 12 * ((100 - discount) / 100);

          return {
            ...opt,
            gpus: optionGpus,
            totalPrice:
              opt.type === "monthly"
                ? monthlyTotal.toString()
                : opt.type === "yearly"
                  ? yearlyTotal.toString()
                  : "0",
          };
        });

      return {
        ...plan,
        options: planOptions,
      };
    });

    // 4️⃣ Return the structured response
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Mining plans fetched successfully",
      data: plansWithDetails,
    };
  } catch (err: unknown) {
    // ✅ Catch-all error handling
    console.error("❌ Failed to fetch mining plans:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while fetching mining plans",
      error:
        err instanceof Error ? err.message : "Unknown error fetching mining plans",
    };
  }
}
