"use server";

import { db } from "@/db";
import { ServerResponse } from "@/types";
import { MiningPlanGpu } from "@/types/mining-plans";

export async function getAllGpus(): Promise<ServerResponse<MiningPlanGpu[]>> {
  try {
    const gpus = await db.query.miningPlanGpusTable.findMany({
      columns: {
        id: true,
        model: true,
        memory: true,
        hashRate: true,
        powerConsumption: true,
        fraction: true,
        currency:true,
        pricePerGpu: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!gpus.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No GPUs found",
        data: [],
      };
    }

    // ✅ Normalize numeric fields to string for consistency
    const formattedGpus: MiningPlanGpu[] = gpus.map((gpu) => ({
      ...gpu,
      fraction: gpu.fraction?.toString() ?? "0.00",
      pricePerGpu: gpu.pricePerGpu?.toString() ?? "0.00",
    }));

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "GPUs fetched successfully",
      data: formattedGpus,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to fetch GPUs:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while fetching GPUs",
      error: err instanceof Error ? err.message : "Failed to fetch GPUs",
    };
  }
}
