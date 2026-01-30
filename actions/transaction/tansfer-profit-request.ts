"use server";

import { SEO_CONFIG } from "@/config/index";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import {
  gpu_mining_monthly,
  transactionTable,
  userWalletAccountTable,
} from "@/db/schema";
import { SelectTransaction } from "@/types/transaction";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { revalidateTag } from "next/cache";
import { getTransactionDescription } from "@/lib/utils";
import { getUserByEmail } from "../user/get-user-by-email";
import { generateUniqueId } from "@/db/utils";
import { Investment } from "@/types/mining-plans";
import { eq, inArray } from "drizzle-orm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { distributeGpuMiningProfit } from "./distribute-gpu-mining-profit";

dayjs.extend(utc);

export async function sendTransferProfitRequest(
  accountId: string,
  investmentId: string
): Promise<ServerResponse<SelectTransaction>> {
  try {
    // Authenticate and verify current user
    let currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // Load complete user details from database
    currentUser = await getUserByEmail(currentUser.email);
    if (!currentUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "User not found in the database.",
      };
    }

    // Ensure the provided wallet belongs to this user
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

    // Look up investment and related monthly profit records
    const refMonth = dayjs.utc().subtract(1, "month").endOf("month");
    
    const investment: Investment | null =
      (await db.query.miningInvestmentsTable.findFirst({
        where: (fields, { eq, and }) =>
          and(eq(fields.email, currentUser.email), eq(fields.id, investmentId)),
        with: {
          plan: true,
          option: true,
          gpus: {
            with: { gpu: true },
          },
        },
      })) ?? null;

    if (!investment) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No investments found",
      };
    }

    // Collect all monthly profits available up to the reference month
    const allMonths = await db.query.gpu_mining_monthly.findMany({
      where: (fields, { eq, lte, and }) =>
        and(
          eq(fields.planId, investment.id),
          lte(fields.monthStart, refMonth.toDate())
        ),
      orderBy: (fields, { asc }) => asc(fields.monthStart),
    });

    // Calculate total profit eligible for transfer
    const transferableProfit = allMonths.reduce(
      (sum, m) =>
        m.withdrawable && !m.locked && !m.isTransferred
          ? sum + Number(m.profit ?? 0)
          : sum,
      0
    );

    if (transferableProfit <= 0) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: "No transferable profit available",
      };
    }

    // Distribute profits according to business logic
    const result = await distributeGpuMiningProfit(transferableProfit);
    if (!result.success) {
      return {
        success: false,
        status: result.status,
        statusCode: result.statusCode,
        message: result.message,
        error: result.error,
      };
    }

    // Mark the relevant monthly profit records as transferred and locked
    const transferableMonths = allMonths.filter(
      (m) => m.withdrawable && !m.locked && !m.isTransferred
    );
    if (transferableMonths.length > 0) {
      const monthIds = transferableMonths.map((m) => m.id);
      await db
        .update(gpu_mining_monthly)
        .set({ isTransferred: true, locked: true })
        .where(inArray(gpu_mining_monthly.id, monthIds));
    }

    // Generate new transaction record
    const transactionId = generateUniqueId("tx", 35);
    const { subject, message } = getTransactionDescription({
      type: "deposit",
      newStatus: "completed",
      amount: transferableProfit,
      walletCurrency: account.currency ?? "USDT",
      userName:
        currentUser.name ??
        `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
      transactionId,
    });

    const [newTransaction] = await db
      .insert(transactionTable)
      .values({
        id: transactionId,
        title: subject,
        description: message,
        type: "deposit",
        status: "completed",
        amount: transferableProfit.toString(),
        currency: account.currency,
        walletId: account.id,
      })
      .returning();

    // Update wallet balance to include transferred profit
    await db
      .update(userWalletAccountTable)
      .set({
        balance: (
          Number(account.balance ?? 0) + transferableProfit
        ).toString(),
      })
      .where(eq(userWalletAccountTable.id, accountId));

    // Notify user via email
    await sendMail(
      currentUser.email,
      EmailTemplate.DepositApprovedNotification,
      {
        subject,
        message,
        amount: transferableProfit,
        url: SEO_CONFIG.seo.baseUrl ?? "",
        name: currentUser.name,
        transactionId,
        status: "completed",
      }
    );

    // Refresh transaction cache for UI updates
    revalidateTag("transactions-cache-deposit");

    // Return successful response with transaction data
    return {
      success: true,
      status: "success",
      statusCode: 201,
      message: "Profit transfer completed successfully",
      data: newTransaction,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to send profit transfer request:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while creating transfer request",
      error:
        err instanceof Error
          ? err.message
          : "Failed to send profit transfer request",
    };
  }
}
