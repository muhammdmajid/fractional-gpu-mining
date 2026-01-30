"use server";

import { db } from "@/db";
import { gpu_mining_monthly, transactionTable, userWalletAccountTable } from "@/db/schema";
import { generateUniqueId } from "@/db/utils";
import { eq, and } from "drizzle-orm";
import { TransactionStatus } from "@/types/transaction";
import { getCurrentUser } from "@/lib/auth";

/**
 * Transfer eligible GPU mining profits to user wallets.
 */
export async function transferGpuMiningProfit(investmentId:string) {
  try {
 /**
 * Authenticate user
 */
const user = await getCurrentUser();

if (!user?.id || !user.email) {
  return {
    success: false,
    status: "error",
    statusCode: 401,
    error: "User not authenticated",
    message: "Authentication required",
  };
}

const investments = await db.query.miningInvestmentsTable.findMany({
  where: (fields, { eq, and }) =>
    and(eq(fields.id, investmentId), eq(fields.email, user.email)),
  with: {
    plan: true,
    option: true,
    gpus: { with: { gpu: true } },
  },
});

if (!investments.length) {
  return {
    success: true,
    status: "success",
    statusCode: 200,
    message: "No investments found",
  };
}

// ✅ Calculate profits safely
const totalProfit = (
  await Promise.all(
    investments.map(async (investment) => {
      // 1️⃣ Fetch all eligible profits
      const eligibleProfits = await db.query.gpu_mining_monthly.findMany({
        where: (gmm, { eq, and }) =>
          and(
            eq(gmm.planId, investment.id),
            eq(gmm.isTransferred, false),
            eq(gmm.locked, false),
            eq(gmm.withdrawable, true)
          ),
      });

      // 2️⃣ Sum profits for this investment
      return eligibleProfits.reduce(
        (sum, p) => sum + Number(p.profit),
        0
      );
    })
  )
).reduce((acc, val) => acc + val, 0); // sum across all investments
  

    // if (eligibleProfits.length === 0) {
    //   return {
    //     success: true,
    //     message: "No eligible GPU mining profits for transfer.",
    //     count: 0,
    //   };
    // }

    // // 2️⃣ Process each eligible profit
    // for (const profit of eligibleProfits) {
    //   // Get the user wallet linked to this mining plan
    //   const userWallet = await db.query.userWalletAccountTable.findFirst({
    //     where: (w, { eq }) => eq(w.id, profit.planId), // adjust if walletId is different
    //   });

    //   if (!userWallet) continue; // Skip if wallet not found

    //   const currentBalance = Number(userWallet.balance);
    //   const profitAmount = Number(profit.profit);

    //   // Create transaction and update wallet & mining record
    //   await db.transaction(async (trx) => {
    //     // ➡️ Insert transaction
    //     await trx.insert(transactionTable).values({
    //       id: generateUniqueId("tx", 35),
    //       title: "GPU Mining Profit Transfer",
    //       description: `Profit from GPU mining plan transferred to user wallet.`,
    //       date: new Date(),
    //       type: "deposit",
    //       status: "completed" as TransactionStatus,
    //       amount: profitAmount.toString(),
    //       currency: profit.currency ?? "USDT",
    //       walletId: userWallet.id,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     });

    //     // ➡️ Update wallet balance
    //     await trx.update(userWalletAccountTable)
    //       .set({
    //         balance: (currentBalance + profitAmount).toString(),
    //       })
    //       .where(eq(userWalletAccountTable.id, userWallet.id));

    //     // ➡️ Mark profit as transferred
    //     await trx.update(gpu_mining_monthly)
    //       .set({ isTransferred: true })
    //       .where(eq(gpu_mining_monthly.id, profit.id));
    //   });
    // }

    return {
      success: true,
      message: "Eligible GPU mining profits transferred successfully.",
     
    };
  } catch (error: unknown) {
    console.error("Failed to transfer GPU mining profits:", error);
    return {
      success: false,
      message: "An unexpected error occurred during profit transfer.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
