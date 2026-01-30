// File: src/app/api/mining-status/route.ts
import { NextResponse } from "next/server";
import  getMiningStatus  from "@/actions/mining-plans/get-mining-status";
import type { ServerResponse } from "@/types";
import type { MiningStatusStream } from "@/types/fractional-mining-profit";
import dayjs from "dayjs";

export async function GET(req: Request) {
  try {
    // ✅ Fetch mining status
    const result: ServerResponse<MiningStatusStream[]> = await getMiningStatus();

    // ❌ If failed, return error
    if (!result.success) {
      return NextResponse.json(result, { status: result.statusCode ?? 500 });
    }

    // ✅ Return only the data (with timestamp)
    return NextResponse.json(
      {
        data: result,
      },
      { status: result.statusCode || 200 }
    );
  } catch (error) {
    console.error("❌ API /mining-status error:", error);

    const errorResponse: ServerResponse<MiningStatusStream[]> = {
      success: false,
      status: "error",
      statusCode: 500,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to fetch mining status",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
