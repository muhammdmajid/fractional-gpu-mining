"use server";

import { SEO_CONFIG } from "@/config/index";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import {
  miningPlanGpusTable,
  miningPlanOptionGpusTable,
  transactionTable,
  userWalletAccountTable,
} from "@/db/schema";
import { eq, } from "drizzle-orm";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { getUserByEmail } from "../user/get-user-by-email";
import { SelectTransaction, TransactionStatus } from "@/types/transaction";
import { revalidateTag } from "next/cache";
import { getTransactionDescription } from "@/lib/utils";
import { createMiningInvestment } from "../mining-plans/create-mining-investment";
import { getErrorMessage } from './../../lib/handle-error';

/**
 * Approves a deposit request with proper validation and mining plan handling
 */
export async function approveDepositRequest({
  transactionId,
  amount,
  thirdpartyTransactionId,
  status,
}: {
  transactionId: string;
  amount: number;
  thirdpartyTransactionId: string;
  status: TransactionStatus;
}): Promise<ServerResponse<SelectTransaction>> {
  try {
    // Step 1: Verify Admin Access
    let adminUser = await getCurrentUser();
    if (!adminUser?.id) {
      return { success: false, status: "unauthorized", statusCode: 401, message: "User not signed in" };
    }

    adminUser = await getUserByEmail(adminUser.email);
    if (!adminUser) {
      return { success: false, status: "error", statusCode: 404, message: "Admin user not found" };
    }

    if (adminUser.role !== "admin") {
      return { success: false, status: "error", statusCode: 403, message: "Access denied: admin required" };
    }

    // ------------------------
    // Part 1: Transaction + Wallet Update + Email
    // ------------------------
    const result = await db.transaction(async (trx) => {
      // Fetch the deposit transaction
      const tx = await trx.query.transactionTable.findFirst({
        where: (t, { eq, and }) => and(eq(t.id, transactionId), eq(t.type, "deposit")),
      });
      if (!tx) throw new Error("Transaction not found");
      if (tx.status === "completed") throw new Error("Transaction already completed");

      // Fetch user's wallet account
      const userAccount = await trx.query.userWalletAccountTable.findFirst({
        where: (acc, { eq }) => eq(acc.id, tx.walletId),
      });
      if (!userAccount) throw new Error("User wallet account not found");

      // Fetch the user who requested the deposit
      const sendRequestUser = await trx.query.userTable.findFirst({
        where: (u, { eq }) => eq(u.id, userAccount.userId),
      });
      if (!sendRequestUser) throw new Error("Requesting user not found");

      // Validate deposit amount
      if (amount < 0) throw new Error("Deposit amount cannot be negative");

      const userBalance = Number(userAccount.balance);
      const { subject, message } = getTransactionDescription({
        type: "deposit",
        newStatus: status,
        amount,
        walletCurrency: userAccount?.currency ?? "USDT",
        userName: sendRequestUser.name ?? `${sendRequestUser.firstName ?? ""} ${sendRequestUser.lastName ?? ""}`.trim(),
        transactionId,
        thirdpartyTransactionId,
      });

      // Update transaction and wallet balance
      await trx.update(transactionTable).set({
        title: subject,
        description: message,
        amount: amount.toString(),
        currency: userAccount?.currency ?? "USDT",
        thirdpartyTransactionId,
        status,
        updatedAt: new Date(),
      }).where(eq(transactionTable.id, transactionId));

      await trx.update(userWalletAccountTable).set({
        balance: (userBalance + amount).toString(),
      }).where(eq(userWalletAccountTable.id, userAccount.id));

      // Send approval email to the user
      await sendMail(sendRequestUser.email, EmailTemplate.DepositApprovedNotification, {
        subject,
        message,
        amount,
        url: SEO_CONFIG.seo.baseUrl ?? "",
        name: sendRequestUser.name,
        transactionId,
        thirdpartyTransactionId,
        status,
      });

      return { tx, userAccount, sendRequestUser };
    });

    // ------------------------
    // Part 2: Mining Plan Handling
    // ------------------------
    if (result.tx.miningPlanId&&status==="completed") {
      // Fetch the linked mining plan
      const miningPlan = await db.query.miningPlansTable.findFirst({
        where: (plan, { eq }) => eq(plan.id, result.tx.miningPlanId as string),
      });
      if (!miningPlan) throw new Error("Mining plan linked to transaction no longer exists");

      // Validate billing option if it exists
      if (result.tx.billingOptionId) {
        const optionExists = await db.query.miningPlanOptionsTable.findFirst({
          where: (option, { eq }) => eq(option.id, result.tx.billingOptionId as string),
        });
        if (!optionExists) throw new Error("Billing option linked to transaction invalid");

        // Fetch GPUs for the billing option
        const gpus = await db
          .select({
            id: miningPlanGpusTable.id,
            model: miningPlanGpusTable.model,
            memory: miningPlanGpusTable.memory,
            hashRate: miningPlanGpusTable.hashRate,
            powerConsumption: miningPlanGpusTable.powerConsumption,
            fraction: miningPlanGpusTable.fraction,
            pricePerGpu: miningPlanGpusTable.pricePerGpu,
            currency: miningPlanGpusTable.currency,
          })
          .from(miningPlanOptionGpusTable)
          .innerJoin(miningPlanGpusTable, eq(miningPlanOptionGpusTable.gpuId, miningPlanGpusTable.id))
          .where(eq(miningPlanOptionGpusTable.optionId, result.tx.billingOptionId as string));

        // Calculate total amount for the plan
        const gpuTotal = gpus.reduce((sum, gpu) => sum + Number(gpu.pricePerGpu || 0), 0);
        const basePrice = Number(optionExists.basePrice || 0);
        const discount = Number(optionExists.baseDiscount || 0);
        const monthlyTotal = basePrice + gpuTotal;
        const yearlyTotal = monthlyTotal * 12 * ((100 - discount) / 100);
        const netAmount = optionExists.type === "monthly" ? monthlyTotal : optionExists.type === "yearly" ? yearlyTotal : 0;

        if (amount < netAmount) throw new Error("Deposit amount is less than total mining plan cost");

        // Create mining investment
        const payload = { planId: miningPlan.id, optionId: optionExists.id, depositAmount: amount };
        const rslt = await createMiningInvestment(gpus, payload, result.userAccount.id);

        // Check if the investment creation failed
        if (!rslt.success) {
          throw new Error(getErrorMessage(rslt.error)); // Convert the error to a readable string
        }

      }
    }

    // Revalidate deposit cache
    revalidateTag("transactions-cache-deposit");

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Deposit request approved successfully",
      data: result.tx,
    };
  } catch (err: unknown) {
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "An error occurred. All changes have been reverted.",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
