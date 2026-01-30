"use server";

import { db } from "@/db";
import { ServerResponse } from "@/types";
import { ReferralData, ReferralMonthlyStat, ReferralWithUsers } from "@/types/referrals";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getCurrentUser } from "@/lib/auth";
import { getUserByEmail } from "../user/get-user-by-email";

dayjs.extend(utc);

export async function getReferralStatsForUser(

): Promise<ServerResponse<ReferralData>> {
  try {
    // -------------------------------
    // Step 1: Get the currently authenticated user
    // -------------------------------
    let currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // Fetch full user details from the database
    currentUser = await getUserByEmail(currentUser.email);
    if (!currentUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "User not found in the database.",
      };
    }

    // ----------------------------
    // 2️⃣ Fetch referrals where user is referrer
    // ----------------------------
const referrals: ReferralWithUsers[] = await db.query.referralTable.findMany({
  where: (r, { eq }) => eq(r.referrerId, currentUser.id),
  orderBy: (r, { desc }) => [desc(r.createdAt)],
  with: {
    referee: {
      columns: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
  },
});



    // ----------------------------
    // 3️⃣ Build monthly stats (last 12 months)
    // ----------------------------
    const now = dayjs.utc().local();
    const monthlyData: ReferralMonthlyStat[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = now.subtract(i, "month");
      const monthKey = date.format("MMM YY");

      const monthReferrals = referrals.filter((ref) =>
        dayjs(ref.createdAt).isSame(date, "month")
      );

      monthlyData.push({
        month: monthKey,
        referrals: monthReferrals.length,
        rewardAmount: monthReferrals.reduce(
          (sum, r) => sum + Number(r.rewardAmount), // ensure numeric addition
          0
        ),
      });
    }

    // ----------------------------
    // 4️⃣ Aggregate totals
    // ----------------------------
    const totalReferrals = referrals.length;
    const totalRewards = referrals.reduce(
      (sum, r) => sum + Number(r.rewardAmount), // ensure numeric addition
      0
    );

    // ----------------------------
    // 5️⃣ Build referral code + link
    // ----------------------------
    const referralCode =
      currentUser.referral_code || currentUser.id.slice(0, 6).toUpperCase();

    const referralLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://199.192.23.73:3000"
    }/auth/sign-up?ref=${referralCode}`;

    // ----------------------------
    // 6️⃣ Return response
    // ----------------------------
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Referral data fetched successfully",
      data: {
        monthlyData,
        totalReferrals,
        totalRewards,
        referralCode,
        referralLink,
        referrals
      },
    };
  } catch (err: unknown) {
    console.error("❌ Failed to fetch referral stats:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to fetch referral stats",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

