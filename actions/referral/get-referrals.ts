"use server";

import { db } from "@/db";
import { referralTable } from "@/db/schema";
import { SelectReferral } from "@/types/referrals";
import { ServerResponse } from "@/types";
import { eq, and, SQL } from "drizzle-orm";

/**
 * 📌 Fetch referrals
 * - Supports optional filtering by `referrerId` or `refereeId`
 * - Returns referrals ordered by newest first
 */
export async function getReferrals(params?: {
  referrerId?: string;
  refereeId?: string;
}): Promise<ServerResponse<SelectReferral[]>> {
  try {
    const { referrerId, refereeId } = params || {};

    // ----------------------------
    // 1️⃣ Collect filters as SQL conditions
    // ----------------------------
    const conditions: SQL[] = [];

    if (referrerId) {
      conditions.push(eq(referralTable.referrerId, referrerId));
    }
    if (refereeId) {
      conditions.push(eq(referralTable.refereeId, refereeId));
    }

    // ----------------------------
    // 2️⃣ Query with conditional filters
    // ----------------------------
    const referrals = await db.query.referralTable.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });

    // ----------------------------
    // 3️⃣ Structured response
    // ----------------------------
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Referrals fetched successfully",
      data: referrals,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to fetch referrals:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to fetch referrals",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
