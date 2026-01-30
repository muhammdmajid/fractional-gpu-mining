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
import { getTransactionDescription } from "@/lib/utils";
import { getUserByEmail } from "../user/get-user-by-email";
import { generateUniqueId } from "@/db/utils";

/**
 * Creates a new deposit request for a user’s wallet.
 * Optionally links the deposit to a mining plan and billing option.
 *
 * Flow:
 *  1. Authenticate user
 *  2. Verify wallet ownership
 *  3. Validate mining plan + option (if provided)
 *  4. Validate deposit amount
 *  5. Insert transaction into DB
 *  6. Notify admins by email
 *  7. Return transaction response
 *
 * @param accountId - Target wallet account ID
 * @param amount - Deposit amount (> 0)
 * @param thirdpartyTransactionId - External blockchain transaction hash/ID
 * @param miningPlanId - (optional) ID of the selected mining plan
 * @param billingOptionId - (optional) ID of the selected billing cycle/option
 * @returns Newly created transaction or error response
 */
export async function sendDepositRequestWithPlan(
  accountId: string,
  amount: number,
  thirdpartyTransactionId: string,
  miningPlanId?: string,
  billingOptionId?: string
): Promise<ServerResponse<SelectTransaction>> {
  try {
    // -------------------------------
    // Step 1: Ensure user is signed in
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

    // Fetch extended user details from DB
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
    // Step 2: Verify wallet belongs to this user
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
    // Step 3: Validate mining plan + option (if provided)
    // -------------------------------
    if (miningPlanId) {
      const miningPlan = await db.query.miningPlansTable.findFirst({
        where: (plan, { eq }) => eq(plan.id, miningPlanId),
        with: { options: true }, // load related plan options
      });

      if (!miningPlan) {
        return {
          success: false,
          status: "error",
          statusCode: 404,
          message: "Selected mining plan not found",
        };
      }

      if (billingOptionId) {
        const optionExists = miningPlan.options?.some(
          (opt) => opt.id === billingOptionId
        );

        if (!optionExists) {
          return {
            success: false,
            status: "error",
            statusCode: 404,
            message: "Selected billing option not found for this plan",
          };
        }
      }
    }

    // -------------------------------
    // Step 4: Validate deposit amount
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

    // Build transaction metadata
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
    // Step 5: Insert transaction into DB
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
        miningPlanId,
        billingOptionId,
      })
      .returning();

    // Bust cache for transaction list
    revalidateTag("transactions-cache-deposit");

    // -------------------------------
    // Step 6: Notify admins by email
    // -------------------------------
    const adminUsers = await db.query.userTable.findMany({
      where: (usr, { eq }) => eq(usr.role, "admin"),
    });

    await Promise.all(
      adminUsers.map((admin) =>
        sendMail(admin.email, EmailTemplate.DepositNotification, {
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
          senderName:
            currentUser.name ?? currentUser.email ?? "Your Valued Client",
          thirdpartyTransactionId,
          miningPlanId,
          billingOptionId,
        })
      )
    );

    // -------------------------------
    // Step 7: Return successful response
    // -------------------------------
    return {
      success: true,
      status: "success",
      statusCode: 201,
      message: "Deposit request created successfully",
      data: newTransaction,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to send deposit request:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while creating deposit request",
      error:
        err instanceof Error ? err.message : "Failed to send deposit request",
    };
  }
}
