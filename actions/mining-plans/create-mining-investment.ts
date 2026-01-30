"use server";

import { SYSTEM_CONFIG, SEO_CONFIG } from "@/config/index";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { ServerResponse, FieldErrors } from "@/types";
import { insertMiningInvestmentSchema } from "@/validation/mining-plans";
import { Investment, InsertMiningInvestment, MiningPlanGpu } from "@/types/mining-plans";
import zodErrorToFieldErrors from "@/lib/zod-error-t-field-errors";
import {
  miningInvestmentGpusTable,
  miningInvestmentsTable,
  transactionTable,
  userWalletAccountTable,
} from "@/db/schema";
import { getFirstAdmin } from "../user/get-first-admin";
import { formatInvestmentTransactionDescription, } from "@/lib/utils";
import { generateUniqueId } from "@/db/utils";
import { revalidateTag } from "next/cache";
import { startMining } from "./start-mining";

/**
 * Create a new mining investment for the authenticated user.
 * Steps:
 *  1. Validate authentication
 *  2. Validate request input
 *  3. Check GPUs, plan, and option exist
 *  4. Fetch admin and user wallets
 *  5. Validate user balance
 *  6. Perform transactions (withdraw from user, deposit to admin)
 *  7. Insert investment and link GPUs
 *  8. Send email notifications (user + admin)
 *  9. Return structured response
 */
export async function createMiningInvestment(
  selectedGpus: Pick<MiningPlanGpu, "id">[],
  investmentInput: InsertMiningInvestment,
  accountId: string,
): Promise<ServerResponse<Investment>> {

  try {
    /**
     * Step 1️⃣: Authenticate user
     */
    const user = await getCurrentUser();
           if (!user || !user.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }


    /**
     * Step 2️⃣: Validate request input with Zod schema
     */
    const validation = insertMiningInvestmentSchema.safeParse(investmentInput);
    if (!validation.success) {
      const fieldErrors: FieldErrors = zodErrorToFieldErrors(validation.error);
      return {
        success: false,
        status: "error",
        statusCode: 400,
        error: fieldErrors,
      };
    }
    const { planId, optionId, depositAmount } = validation.data;

    /**
     * Step 3️⃣: Validate selected GPUs, plan, and option
     */
    const gpuIds = selectedGpus.map((gpu) => gpu.id);
    const existingGpus = await db.query.miningPlanGpusTable.findMany({
      where: (gpu, { inArray }) => inArray(gpu.id, gpuIds),
    });
    if (existingGpus.length !== gpuIds.length) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "One or more selected GPUs do not exist",
      };
    }

    const plan = await db.query.miningPlansTable.findFirst({
      where: (p, { eq }) => eq(p.id, planId),
    });
    if (!plan) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Selected planId does not exist",
      };
    }

    const option = await db.query.miningPlanOptionsTable.findFirst({
      where: (opt, { eq }) => eq(opt.id, optionId),
    });
    if (!option) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Selected optionId does not exist",
      };
    }

    /**
     * Step 4️⃣: Fetch admin + user wallets
     */
    const adminUser = await getFirstAdmin();
    if (!adminUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Admin account could not be found. Please contact support.",
      };
    }

    const [adminWallet, userWallet] = await Promise.all([
      db.query.userWalletAccountTable.findFirst({
        where: (acc, { eq }) => eq(acc.userId, adminUser.id),
      }),
      db.query.userWalletAccountTable.findFirst({
        where: (acc, { eq }) => eq(acc.id, accountId),
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

    const sendRequestUser = await db.query.userTable.findFirst({
      where: (u, { eq }) => eq(u.id, userWallet.userId),
    });
    if (!sendRequestUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "❌ User who requested the investment not found.",
      };
    }

    /**
     * Step 5️⃣: Validate user balance
     */
    const userBalance = Number(userWallet.balance);
    const adminBalance = Number(adminWallet.balance);
    if (userBalance - depositAmount < 0) {
      return {
        success: false,
        status: "error",
        statusCode: 400,
        message: "⚠️ Insufficient funds. User balance is too low.",
      };
    }

    /**
     * Step 6️⃣: Process transactions (atomic)
     */
    const now = new Date();
    const transactionId = generateUniqueId("tx", 35);
    const adminTransactionId = generateUniqueId("tx", 35);
    const miningPlanId = generateUniqueId("plan", 37);
    const { subject, message } = formatInvestmentTransactionDescription({
      action: "withdrawal",
      amount: depositAmount,
      currency: userWallet?.currency ?? "USDT",
      planTitle: plan.title,
      optionCycle: option.miningCycle,
      transactionId: transactionId,
      userName:
        sendRequestUser.name ??
        `${sendRequestUser.firstName ?? ""} ${sendRequestUser.lastName ?? ""}`.trim()
    });

    await db.transaction(async (trx) => {
      // Deduct from user wallet + log withdrawal
      await trx.insert(transactionTable).values({
        id: transactionId,
        title: subject,
        description: message,
         currency: userWallet?.currency ?? "USDT",
        type: "withdrawal",
        status: "completed",
        amount: depositAmount.toString(),
        walletId: userWallet.id,
      });

      await trx
        .update(userWalletAccountTable)
        .set({
          balance: (userBalance - depositAmount).toString(),
           currency: userWallet?.currency ?? "USDT",
          updatedAt: now,
        })
        .where(eq(userWalletAccountTable.id, userWallet.id));

      // Credit admin wallet + log deposit
      await trx
        .insert(transactionTable)
        .values({
          id: adminTransactionId,
          title: `plan: ${plan.title} Fee`,
          description: "Fee collected from user",
          type: "deposit",
          status: "completed",
           currency: userWallet?.currency ?? "USDT",
          amount: depositAmount.toString(),
          date: now,

          walletId: adminWallet.id,
        })
        .returning({ id: transactionTable.id });



      await trx
        .update(userWalletAccountTable)
        .set({
          balance: (adminBalance + depositAmount).toString(),
           currency: userWallet?.currency ?? "USDT",
          updatedAt: now,
        })
        .where(eq(userWalletAccountTable.id, adminWallet.id));
    });

    /**
     * Step 7️⃣: Create mining investment + link GPUs
     */
     await db.transaction(async (tx) => {
      const [newInvestment] = await tx
        .insert(miningInvestmentsTable)
        .values({
          id: miningPlanId,
          email: sendRequestUser.email,
          planId: plan.id,
          optionId: option.id,
          miningCycle: option.miningCycle,
          depositAmount: depositAmount.toString(),
          transactionDepositId: adminTransactionId,
           currency: userWallet?.currency ?? "USDT",
          startDate: now,
          status: "active",
        })
        .returning();

      const gpuLinks = existingGpus.map((gpu) => ({
        investmentId: newInvestment.id,
        gpuId: gpu.id,
      }));
      await tx.insert(miningInvestmentGpusTable).values(gpuLinks);

      return newInvestment;
    });

    /**
     * Step 8️⃣: Send email notifications
     */
    revalidateTag("transactions-cache-withdrawal");

    await sendMail(
      sendRequestUser.email,
      EmailTemplate.WithdrawalApprovedNotification,
      {
        subject,
        message,
        amount: Number(depositAmount),
        url: SEO_CONFIG.seo.baseUrl ?? "",
        name:
          sendRequestUser.name ??
          `${sendRequestUser.firstName ?? ""} ${sendRequestUser.lastName ?? ""}`.trim(),
        transactionId,
        status: "completed",
      }
    );

    if (adminTransactionId) {
      const { subject: subjectAdmin, message: messageAdmin } = formatInvestmentTransactionDescription({

        action: "deposit",
        amount: depositAmount,
        currency: userWallet?.currency ?? "USDT",
        planTitle: plan.title,
        optionCycle: option.miningCycle,
        transactionId: adminTransactionId,
        userName:
          adminUser.name ??
          `${adminUser.firstName ?? ""} ${adminUser.lastName ?? ""}`.trim(),
      });


      await sendMail(
        adminUser.email,
        EmailTemplate.DepositApprovedNotification,
        {
          subject: subjectAdmin,
          message: messageAdmin,
          amount: depositAmount,
          url: SEO_CONFIG.seo.baseUrl ?? "",
          name: adminUser.name,
          transactionId: adminTransactionId,
          status: "completed",
        }
      );
    }

    const investments = await db.query.miningInvestmentsTable.findMany({
      where: (fields, { eq }) => eq(fields.id, miningPlanId),
      with: {
        plan: true,
        option: true,
        gpus: { with: { gpu: true } },
      },
    });

    // Get the first one (or undefined if none found)
    const investment: Investment = investments[0] ?? null;
    
    await startMining(miningPlanId);
    return {
      success: true,
      status: "success",
      statusCode: 201,
      message: "✅ Mining investment created successfully",
      data: investment,
    };
  } catch (err: unknown) {
    console.error("❌ Failed to create mining investment:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to create mining investment",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
