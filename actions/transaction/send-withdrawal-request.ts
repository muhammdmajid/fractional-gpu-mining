"use server";

import { SEO_CONFIG } from "@/config/index";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import { transactionTable } from "@/db/schema";
import { SelectTransaction } from "@/types/transaction";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { revalidateTag } from "next/cache";
import { calculateWithdrawal } from "@/lib/finance";
import { getTransactionDescription } from "@/lib/utils";
import { getUserByEmail } from "../user/get-user-by-email";
import { generateUniqueId } from "@/db/utils";

export async function sendWithdrawalRequest(
  accountId: string,
  amount: number,
  thirdpartyWithdrawalAddress: string
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
    // Step 2: Verify that the provided wallet belongs to the current user
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




    const { isEligible, error } = calculateWithdrawal(amount, account.balance);
    // Step 3: Validate withdrawal amount
    if (!isEligible || error) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: error ? error : "Withdrawal amount must be greater than zero and less than or equal to current balance",
      };
    }


    // Generate unique transaction ID
    const transactionId = generateUniqueId("tx", 35);

    // Prepare transaction description
    const { subject, message } = getTransactionDescription({
      type: "withdrawal",
      newStatus: "pending",
      amount,
      walletCurrency: account?.currency ?? "USDT",
      userName:
        currentUser.name ??
        `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
      transactionId,
      thirdpartyWithdrawalAddress,
    });
    const [newTransaction] = await db
      .insert(transactionTable)
      .values({
        title: subject,
        description: message,
        type: "withdrawal",
        status: "pending",
        amount: amount.toString(),
        walletId: account.id,
         currency: account.currency,
        thirdpartyWithdrawalAddress,
      })
      .returning();



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
          EmailTemplate.WithdrawalNotificationEmail, {
          url: SEO_CONFIG.seo.baseUrl ?? "",
          amount: Number(newTransaction.amount),
          subject:
            subject ??
            `Withdrawal Request for ${account.name ?? "Finance Account"} [Account ID: ${account.id ?? "N/A"
            }]`,
          accountName: account.name ?? undefined,
          accountId: account.id ?? undefined,
          currency: account.currency ?? "USDT",
          senderName: currentUser.name ?? currentUser.email ?? "Your Valued Client",
          thirdpartyWithdrawalAddress
        }
        )
      )
    );

    revalidateTag("transactions-cache-withdrawal");
    // Step 6: Return success response
    return {
      success: true,
      status: "success",
      statusCode: 201,
      message: "Withdrawal request created successfully",
      data: newTransaction,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to send withdrawal request:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while creating withdrawal request",
      error:
        err instanceof Error
          ? err.message
          : "Failed to send withdrawal request",
    };
  }
}
