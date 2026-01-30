"use server";

import { ServerResponse } from "@/types";
import { getCurrentUser } from "@/lib/auth";
import { getUserByEmail } from "../user/get-user-by-email";
import { generateRandom10DigitNumber } from "@/db/utils";


export async function getReferralCodeAndLink(): Promise<
  ServerResponse<{ referralCode: string; referralLink: string }>
> {
  try {
    // 1️⃣ Get the current authenticated user
    let currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // 2️⃣ Get full user from DB
    currentUser = await getUserByEmail(currentUser.email);
    if (!currentUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "User not found in the database.",
      };
    }

    // 3️⃣ Generate referral code & link
    const referralCode =
      currentUser?.referral_code || generateRandom10DigitNumber();

    const referralLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://199.192.23.73:3000"
    }/auth/sign-up?ref=${referralCode}`;

    // 4️⃣ Return response
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Referral link fetched successfully",
      data: {
        referralCode,
        referralLink,
      },
    };
  } catch (err: unknown) {
    console.error("❌ Failed to fetch referral link:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to fetch referral link",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
