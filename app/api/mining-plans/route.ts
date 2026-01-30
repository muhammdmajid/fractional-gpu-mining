// /app/api/mining-plans/route.ts
import { getAllMiningPlans } from "@/actions/mining-plans/get-all-mining-plans";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await getAllMiningPlans(); // call your server function

    return NextResponse.json(result, {
      status: result.statusCode || 200,
    });
  } catch (err: unknown) {
    console.error("❌ Failed to fetch mining plans:", err);

    return NextResponse.json(
      {
        success: false,
        status: "error",
        statusCode: 500,
        message: "Something went wrong while fetching mining plans",
        error: err instanceof Error ? err.message : "Failed to fetch mining plans",
        data: [],
      },
      { status: 500 }
    );
  }
}
