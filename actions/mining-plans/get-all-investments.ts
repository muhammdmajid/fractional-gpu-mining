"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import { Investment } from "@/types/mining-plans";

// ==============================
// Fetch Investments with Relations
// ==============================
export async function getAllInvestments(): Promise<ServerResponse<Investment[]>> {
  try {
    const user = await getCurrentUser();
           if (!user || !user.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }


    const investments = await db.query.miningInvestmentsTable.findMany({
      where: (fields, { eq }) => eq(fields.email, user.email),
      with: {
        plan: true,
        option: true,
        gpus: { with: { gpu: true } },
      },
    });

    if (!investments.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No investments found",
        data: [],
      };
    }



    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Investments fetched successfully",
      data: investments,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to fetch investments:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while fetching investments",
      error: err instanceof Error ? err.message : "Failed to fetch investments",
    };
  }
}
