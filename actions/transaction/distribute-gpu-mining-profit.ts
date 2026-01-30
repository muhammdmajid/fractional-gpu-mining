import { SEO_CONFIG } from "@/config";
import { db } from "@/db";
import { transactionTable, userWalletAccountTable } from "@/db/schema";
import { generateUniqueId } from "@/db/utils";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { getTransactionDescription } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { eq } from "drizzle-orm";


export async function distributeGpuMiningProfit(
  transferableProfit: number
): Promise<ServerResponse<null>> {
  const now = new Date();
  let remaining = transferableProfit;

  try {
    // ✅ Fetch admin accounts
    const adminAccounts = await db.query.userWalletAccountTable.findMany({
      where: (acc, { eq }) => eq(acc.isAdmin, true),
      with: { user: true },
    });

    if (!adminAccounts || adminAccounts.length === 0) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "No admin accounts found.",
      };
    }

    // ✅ Check total balance
    const adminBalances = adminAccounts.map((acc) => parseFloat(acc.balance));
    const totalBalance = adminBalances.reduce(
      (sum, balance) => sum + (isNaN(balance) ? 0 : balance),
      0
    );

    if (totalBalance < transferableProfit) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "Insufficient balance available to distribute profit.",
      };
    }

    // ✅ Prepare email jobs after DB updates
    const emailJobs: {
      email: string;
      userName: string;
      transactionId: string;
      transferAmount: number;
      walletCurrency: string;
    }[] = [];

    // ✅ First pass: distribute profit & update DB
    for (const acc of adminAccounts) {
      if (remaining <= 0) break;

      const adminBalance = parseFloat(acc.balance);
      if (isNaN(adminBalance) || adminBalance <= 0) continue;

      const transferAmount = adminBalance >= remaining ? remaining : adminBalance;
      const newBalance = adminBalance - transferAmount;

      const transactionId = generateUniqueId("tx", 35);

      await db.insert(transactionTable).values({
        id: transactionId,
        title: "GPU Mining Profit",
        description: "GPU Mining Profit Distribution",
        type: "deposit",
        status: "completed",
        amount: transferAmount.toString(),
        currency: acc.currency ?? "USDT",
        date: now,
        walletId: acc.id ?? "",
      });

      await db
        .update(userWalletAccountTable)
        .set({ balance: newBalance.toString(), updatedAt: now })
        .where(eq(userWalletAccountTable.id, acc.id));

      if (acc.user?.email) {
        const userName =
          acc.user.name ??
          `${acc.user.firstName ?? ""} ${acc.user.lastName ?? ""}`.trim();

        emailJobs.push({
          email: acc.user.email,
          userName,
          transactionId,
          transferAmount,
          walletCurrency: acc.currency ?? "USDT",
        });
      }

      remaining -= transferAmount;
    }

    // ✅ Second pass: send all emails in parallel (non-blocking)
    await Promise.allSettled(
      emailJobs.map(async (job) => {
        const { subject, message } = getTransactionDescription({
          type: "deposit",
          newStatus: "completed",
          amount: job.transferAmount,
          walletCurrency: job.walletCurrency,
          userName: job.userName,
          transactionId: job.transactionId,
        });

        await sendMail(job.email, EmailTemplate.DepositApprovedNotification, {
          subject,
          message,
          amount: job.transferAmount,
          url: SEO_CONFIG.seo.baseUrl ?? "",
          name: job.userName,
          transactionId: job.transactionId,
          status: "completed",
        });
      })
    );

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "GPU mining profit distributed successfully.",
    };
  } catch (error) {
    console.error("❌ Error in distributeGpuMiningProfit:", error);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Internal server error while distributing profit.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
