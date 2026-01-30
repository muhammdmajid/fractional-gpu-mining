"use server"
import { SignUpPayload } from "@/lib/auth-types";
import { FieldErrors, ServerResponse } from "@/types";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import zodErrorToFieldErrors from "@/lib/zod-error-t-field-errors";
import { db } from "@/db";
import { accountTable, referralTable, userTable } from "@/db/schema";
import { signUpCredentialsSchema2 } from "@/validation/user";
import { User } from "@/types/user";
import { generateRandom10DigitNumber, generateUniqueId } from "@/db/utils";
import { PAYMENT_WITHDRAWAL_POLICY } from "@/config";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";

/**
 * Sign up a new user with optional referral.
 *
 * Flow:
 * 1. Validate input with Zod schema.
 * 2. Clean up referral code (remove spaces, keep digits only).
 * 3. Check if user with email exists.
 * 4. Insert new user into DB.
 * 5. Insert account credentials.
 * 6. If referrerId exists, insert into referral table.
 * 7. Send email verification OTP.
 * 8. Return success or error.
 */
export async function signUpUser(
  props: SignUpPayload
): Promise<ServerResponse<User>> {
  try {


    // 1️⃣ Validate input
    const parsedProps = signUpCredentialsSchema2.safeParse(props);
    if (!parsedProps.success) {
      const fieldErrors: FieldErrors = zodErrorToFieldErrors(parsedProps.error);
      return {
        success: false,
        status: "error",
        statusCode: 400,
        error: fieldErrors,
      };
    }

    const { email, name, password, referral_code } = parsedProps.data;

    // 2️⃣ Clean up referral code
    const referrerId_code = referral_code
      ? referral_code.replace(/\D+/g, "") || undefined
      : undefined;

    // 3️⃣ Check if user already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "User with this email already exists",
        data: existingUser[0],
        statusCode: 400,
      };
    }

    // 4️⃣ Insert new user
    const now = new Date();
    const refereeId = generateRandom10DigitNumber(); // unique referral code for new user

    const [newUser] = await db.insert(userTable).values({
      email: email.trim(),
      name: name ?? "",
      role: "register",
      account_status: "active",
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
      referral_code: refereeId,
    }).returning();

    if (!newUser) {
      return {
        success: false,
        message: "User not created",
        statusCode: 500,
      };
    }

    // 5️⃣ Insert account credentials
    await db.insert(accountTable).values({
      id: generateUniqueId("account", 40),
      userId: newUser.id,
      accountId: newUser.id,
      providerId: "credential",
      password: await hashPassword(password),
      createdAt: now,
      updatedAt: now,
      accessToken: null,
      accessTokenExpiresAt: null,
      idToken: null,
      refreshToken: null,
      refreshTokenExpiresAt: null,
      scope: null,
    });

    // 6️⃣ Insert referral if referrerId exists
    if (referrerId_code) {
      // Check if referrer exists
      const [referrer] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.referral_code, referrerId_code))
        .limit(1);

      if (referrer) {
        await db.insert(referralTable).values({
          id: generateUniqueId("referral", 41),
          referrerId: referrer.id,
          refereeId: newUser.id,
          rewardAmount: PAYMENT_WITHDRAWAL_POLICY.DEFAULT_REWARD_AMOUNT,
          rewardCurrency: PAYMENT_WITHDRAWAL_POLICY.DEFAULT_REWARD_CURRENCY,
          isWithdrawable: false,
          isTransferredToWallet: false,
          createdAt: now,
        });
      }
    }

    // 7️⃣ Send email verification OTP
    const otpResult = await auth.api.sendVerificationOTP?.({
      body: {
        email: newUser.email,
        type: "email-verification",
      },
    });

    if (!otpResult?.success) {
      return {
        success: false,
        error: "Verification OTP dispatch failed",
        statusCode: 500,
        message:
          "We were unable to send the verification code to your email at this time. Please try again later or contact support if the issue persists.",
      };
    }

    // 8️⃣ Sign-up successful
    return {
      success: true,
      data: newUser,
      statusCode: 201,
      message: "Account created successfully. Please verify your email to continue.",
    };
  } catch (err) {
    console.error("Internal server error:", err);
    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
      message: "Internal server error",
    };
  }
}
