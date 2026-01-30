"use server";

import { SEO_CONFIG} from "@/config/index";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import { transactionTable } from "@/db/schema";
import { SelectTransaction } from "@/types/transaction";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { revalidateTag } from "next/cache";
import {  getTransactionDescription } from "@/lib/utils";
import { getUserByEmail } from "../user/get-user-by-email";
import { generateUniqueId } from "@/db/utils";

/**
 * Sends a deposit request for a specific wallet account.
 *
 * @param accountId - Wallet account ID to deposit into
 * @param amount - Amount to deposit (must be greater than 0)
 * @param thirdpartyTransactionId - External blockchain/third-party transaction ID
 * @returns ServerResponse containing the newly created transaction or error
 */
export async function sendDepositRequest(
  accountId: string,
  amount: number,
  thirdpartyTransactionId: string,
): Promise<ServerResponse<SelectTransaction>> {
  try {
    // -------------------------------
    // Step 1: Get the currently authenticated user
    // -------------------------------
    let currentUser = await getCurrentUser();

      if (!currentUser || !currentUser.id) {
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

    // -------------------------------
    // Step 2: Verify wallet ownership
    // -------------------------------
    const account = await db.query.userWalletAccountTable.findFirst({
      where: (acc, { eq, and }) =>
        and(eq(acc.id, accountId), eq(acc.userId, currentUser.id)),
    });

    if (!account) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Wallet account not found for this user",
      };
    }

    // -------------------------------
    // Step 3: Validate deposit amount
    // -------------------------------
    if (amount <= 0) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: "Deposit amount must be greater than zero",
      };
    }

    // Generate unique transaction ID
    const transactionId = generateUniqueId("tx", 35);

    // Prepare transaction description
    const { subject, message } = getTransactionDescription({
      type: "deposit",
      newStatus: "pending",
      amount,
      walletCurrency: account?.currency ?? "USDT",
      userName:
        currentUser.name ??
        `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
      transactionId,
      thirdpartyTransactionId,
    });

    // -------------------------------
    // Step 4: Insert transaction into database
    // -------------------------------
    const [newTransaction] = await db
      .insert(transactionTable)
      .values({
        id: transactionId,
        title: subject,
        description: message,
        type: "deposit",
        status: "pending",
        amount: amount.toString(),
         currency: account.currency,
        walletId: account.id,
        thirdpartyTransactionId,
      })
      .returning();

    // Revalidate transaction cache
    revalidateTag("transactions-cache-desposit");

// -------------------------------
// Step 5: Send email all admin notification
// -------------------------------
const adminUsers = await db.query.userTable.findMany({
  where: (usr, { eq }) => eq(usr.role, "admin"),
});

// Send email to all admins in parallel
await Promise.all(
  adminUsers.map((admin) =>
    sendMail(
      admin.email,
      EmailTemplate.DepositNotification,
      {
        url: SEO_CONFIG.seo.baseUrl ?? "",
        amount: Number(newTransaction.amount),
        subject:
          subject ??
          `Deposit Request for ${account.name ?? "Finance Account"} [Account ID: ${
            account.id ?? "N/A"
          }]`,
        accountName: account.name ?? undefined,
        accountId: account.id ?? undefined,
        currency: account.currency ?? "USDT",
        senderName: currentUser.name ?? currentUser.email ?? "Your Valued Client",
        thirdpartyTransactionId,
      }
    )
  )
);


// 2️⃣ Loop through each admin and send mail
await Promise.all(
  adminUsers.map((admin) =>
    sendMail(
      admin.email, // send to each admin’s email
      EmailTemplate.DepositNotification,
      {
        url: SEO_CONFIG.seo.baseUrl ?? "",
        amount: Number(newTransaction.amount),
        subject:
          subject ??
          `Deposit Request for ${account.name ?? "Finance Account"} [Account ID: ${
            account.id ?? "N/A"
          }]`,
        accountName: account.name ?? undefined,
        accountId: account.id ?? undefined,
        currency: account.currency ?? "USDT",
        senderName: currentUser.name ?? currentUser.email ?? "Your Valued Client",
        thirdpartyTransactionId,
      }
    )
  )
);


    // -------------------------------
    // Step 6: Return success response
    // -------------------------------
    return {
      success: true,
      status: "success",
      statusCode: 201,
      message: "Deposit request created successfully",
      data: newTransaction,
    };
  } catch (err: unknown) {
    // -------------------------------
    // Error Handling
    // -------------------------------
    console.error("❌ Failed to send deposit request:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while creating deposit request",
      error: err instanceof Error ? err.message : "Failed to send deposit request",
    };
  }
}
