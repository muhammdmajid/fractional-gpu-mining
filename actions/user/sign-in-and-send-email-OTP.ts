"use server";

import { auth } from "@/lib/auth";
import { getUserByEmail } from "./get-user-by-email";
import { ServerResponse } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";


export async function signInAndSendEmailOTP(
  email:string
): Promise<ServerResponse> {
  try {
    // 1️⃣ Fetch user from DB
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
        statusCode: 404,
        message:
          "The requested user does not exist in our records. Please check the email address and try again.",
      };
    }

    // 2️⃣ If email is unverified → send OTP and stop here
    if (!user.emailVerified) {
      try {
        const otpResult = await auth.api.sendVerificationOTP?.({
          body: {
            email: user.email,
            type: "email-verification",
          },
        });

        if (!otpResult?.success) {
          return {
            success: false,
            error: "Failed to send verification OTP",
            statusCode: 500,
            message: "Could not send OTP. Please try again later.",
          };
        }

        return {
          success: true,
          data: { requiresVerification: true },
          statusCode: 200,
          message: "Verification OTP sent to email",
        };
      } catch (otpError: unknown) {
        const message = getErrorMessage(otpError) ?? "Failed to send OTP";

        return {
          success: false,
          error: message,
          statusCode: 500,
          message,
        };
      }
    }

    // 3️⃣ User is verified → just return success (no cookie)
    return {
      success: true,
      data: { requiresVerification: false },
      statusCode: 200,
      message: "Sign-in successful",
    };
  } catch (err: unknown) {
    // 4️⃣ Internal error
    console.error("Sign-in error:", err);

    const message = getErrorMessage(err) ?? "Internal server error";

    return {
      success: false,
      error: message,
      statusCode: 500,
      message,
    };
  }
}
