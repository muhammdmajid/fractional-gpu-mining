"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { ServerResponse } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { SEO_CONFIG } from "@/config/index";

/**
 * Sends a sign-in success email to a user.
 *
 * Steps:
 * 1. Extract the protocol and host from request headers to construct the origin URL.
 * 2. Query the database to find a user by email.
 * 3. If user exists, send the sign-in success email using the configured template.
 * 4. Return a ServerResponse indicating success or failure.
 *
 * @param email - The recipient's email address
 * @returns ServerResponse<null> indicating success or containing error details
 */
export default async function sendSignInSuccessEmail(
  email: string
): Promise<ServerResponse<null>> {
  try {

    const origin = SEO_CONFIG.seo.baseUrl;

    // 1. Fetch user from the database by email
    const [user] = await db
      .select({
        email: userTable.email,
        name: userTable.name,
        image: userTable.image,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    // Return 404 if user does not exist
    if (!user) {
      return {
        success: false,
        error: "No account found with the provided email address.",
        message: undefined,
        statusCode: 404,
      };
    }

    // 2. Send the sign-in success email
    const info = await sendMail(email, EmailTemplate.SignInSuccess, {
      email: user.email,
      name: user.name ?? "there",
      image: user.image ?? "",
      url: origin,
    });

    // Return success response
    return {
      success: info.success,
      error: info.error ?? undefined,
      message: info.success
        ? `${info.message} - Sign-in confirmation email sent successfully.`
        : undefined,
      statusCode: info.statusCode,
    };
  } catch (error: unknown) {
    console.error("Error sending sign-in success email:", error);

    // Return structured error response with helpful message
    return {
      success: false,
      error: getErrorMessage(error) || "An unknown error occurred while sending email.",
      message: undefined,
      statusCode: 500,
    };
  }
}
