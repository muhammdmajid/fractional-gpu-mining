"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { ServerResponse } from "@/types";
import { ReferrerInfo } from "@/types/referrals";


export async function getReferrerByReferralCode(
  referralCode: string
): Promise<ServerResponse<{ referrerInfo: ReferrerInfo | null }>> {
  try {
    if (!referralCode) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: "Referral code is required",
        data: { referrerInfo: null },
      };
    }

    // Query DB for user with this referral code
    const [referrer] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.referral_code, referralCode))
      .limit(1);

    if (!referrer) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No referrer found for this code",
        data: { referrerInfo: null },
      };
    }

    const referrerInfo: ReferrerInfo = {
      name:
        (referrer.name ??
          `${referrer.firstName ?? ""} ${referrer.lastName ?? ""}`.trim()) ||
        "Unknown",
      email: referrer.email ?? null,
      referralCode: referrer.referral_code,
    };

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Referrer info fetched successfully",
      data: { referrerInfo },
    };
  } catch (err: unknown) {
    console.error("❌ Error fetching referrer from DB:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to fetch referrer info",
      error: err instanceof Error ? err.message : "Unknown error",
      data: { referrerInfo: null },
    };
  }
}
