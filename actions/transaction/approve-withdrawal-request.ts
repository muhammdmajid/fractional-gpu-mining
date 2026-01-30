"use server";

import {
  PAYMENT_WITHDRAWAL_POLICY,
  SEO_CONFIG,
} from "@/config/index";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import { transactionTable, userWalletAccountTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { getUserByEmail } from "../user/get-user-by-email";
import { SelectTransaction, TransactionStatus } from "@/types/transaction";
import { revalidateTag } from "next/cache";
import { getTransactionDescription } from "@/lib/utils";

interface ApproveWithdrawalRequestArgs {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
  thirdpartyWithdrawalAddress: string;
}

/**
 * Approve a withdrawal request and process the transaction.
 * Deducts funds from the user, credits admin for fees, updates DB, and sends notifications.
 */
export async function approveWithdrawalRequest({
  transactionId,
  amount,
  status,
  thirdpartyWithdrawalAddress,
}: ApproveWithdrawalRequestArgs): Promise<ServerResponse<SelectTransaction>> {
  try {
    // Authenticate current user and verify admin privileges
    let adminUser = await getCurrentUser();
       if (!adminUser || !adminUser.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    adminUser = await getUserByEmail(adminUser.email);
    if (!adminUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "❌ Admin user not found in the database.",
      };
    }

    if (adminUser.role !== "admin") {
      return {
        success: false,
        status: "error",
        statusCode: 403,
        message: "🚫 Permission denied. Only admins can approve withdrawals.",
      };
    }

    // Fetch withdrawal transaction and validate
    const transaction = await db.query.transactionTable.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.id, transactionId), eq(t.type, "withdrawal")),
    });

    if (!transaction) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "❌ Withdrawal transaction not found.",
      };
    }

    if (transaction.status === "completed") {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: "⚠️ This withdrawal request has already been completed.",
      };
    }

    // Fetch admin and user wallet accounts
    const [adminWallet, userWallet] = await Promise.all([
      db.query.userWalletAccountTable.findFirst({
        where: (acc, { eq }) =>
          eq(acc.userId, adminUser.id),
      }),
      db.query.userWalletAccountTable.findFirst({
        where: (acc, { eq }) => eq(acc.id, transaction.walletId),
      }),
    ]);

    if (!adminWallet || !userWallet) {
      return {
        success: false,
        status: "error",
        statusCode: 500,
        message: "❌ Unable to locate admin or user wallet account.",
      };
    }

    // Fetch the user who requested the withdrawal
    const sendRequestUser = await db.query.userTable.findFirst({
      where: (u, { eq }) => eq(u.id, userWallet.userId),
    });

    if (!sendRequestUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "❌ User who requested the withdrawal not found.",
      };
    }

    const userBalance = Number(userWallet.balance);
    const adminBalance = Number(adminWallet.balance);
    const withdrawalFee = PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE * amount;

    // Validate user balance
    if (userBalance - amount < 0) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message:
          "⚠️ Insufficient funds. User balance is too low to process this withdrawal.",
      };
    }

    const now = new Date();
    let adminTransactionId: string | undefined;

    // Generate email for user
    const { subject, message } = getTransactionDescription({
      type: "withdrawal",
      newStatus: status,
      amount,
      walletCurrency: userWallet?.currency ?? "USDT",
      userName:
        sendRequestUser.name ??
        `${sendRequestUser.firstName ?? ""} ${sendRequestUser.lastName ?? ""}`.trim(),
      transactionId,
    });

    // Perform atomic transaction: update withdrawal, deduct from user, credit admin fee
    await db.transaction(async (transactionSession) => {
      await transactionSession
        .update(transactionTable)
        .set({
          title: subject,
          description: message,
          amount: amount.toString(),
            currency:userWallet?.currency ?? "USDT",
          status,
          thirdpartyWithdrawalAddress,
          updatedAt: now,
        })
        .where(eq(transactionTable.id, transactionId));

      if (status === "completed") {
        await transactionSession
          .update(userWalletAccountTable)
          .set({
            balance: (userBalance - amount).toString(),
            updatedAt: now,
          })
          .where(eq(userWalletAccountTable.id, userWallet.id));

        const [adminTransaction] = await transactionSession
          .insert(transactionTable)
          .values({
            title: "Withdrawal Fee",
            description: "Fee collected from user withdrawal",
            type: "deposit",
            status: "completed",
            amount: withdrawalFee.toString(),
             currency:userWallet?.currency ?? "USDT",
            date: now,
            walletId: adminWallet.id ?? "",
            thirdpartyTransactionId: transactionId ?? "",
            thirdpartyWithdrawalAddress,
          })
          .returning({ id: transactionTable.id });

        adminTransactionId = adminTransaction.id;

        await transactionSession
          .update(userWalletAccountTable)
          .set({
            balance: (adminBalance + withdrawalFee).toString(),
            updatedAt: now,
          })
          .where(eq(userWalletAccountTable.id, adminWallet.id));
      }
    });

    // Fetch updated withdrawal transaction
    const [updatedTransaction] = await db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.id, transactionId));

    if (!updatedTransaction) {
      throw new Error("❌ Transaction disappeared after update.");
    }

    // Revalidate withdrawal cache
    revalidateTag("transactions-cache-withdrawal");

    await sendMail(sendRequestUser.email, EmailTemplate.WithdrawalApprovedNotification, {
      subject: subject ?? updatedTransaction.title ?? "Withdrawal Update",
      message: message ?? updatedTransaction.description ?? "Your withdrawal has been processed.",
      amount: Number(updatedTransaction.amount),
      url: SEO_CONFIG.seo.baseUrl ?? "",
      name:
        sendRequestUser.name ??
        `${sendRequestUser.firstName ?? ""} ${sendRequestUser.lastName ?? ""}`.trim(),
      transactionId,
      status,
      thirdpartyWithdrawalAddress,
    });

    // Send admin fee email if applicable
    if (adminTransactionId) {
      const { subject: subjectAdmin, message: messageAdmin } = getTransactionDescription({
        type: "deposit",
        newStatus: "completed",
        amount: withdrawalFee,
        walletCurrency: adminWallet?.currency ?? "USDT",
        userName:
          adminUser.name ?? `${adminUser.firstName ?? ""} ${adminUser.lastName ?? ""}`.trim(),
        transactionId: adminTransactionId,
      });

      await sendMail(adminUser.email, EmailTemplate.DepositApprovedNotification, {
        subject: subjectAdmin,
        message: messageAdmin,
        amount: withdrawalFee,
        url: SEO_CONFIG.seo.baseUrl ?? "",
        name: adminUser.name,
        transactionId: adminTransactionId,
        status: "completed",
      });
    }

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "✅ Withdrawal request processed successfully.",
      data: updatedTransaction as SelectTransaction,
    };
  } catch (err: unknown) {
    console.error("❌ Withdrawal approval failed:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "🚨 Internal server error while processing withdrawal request.",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
