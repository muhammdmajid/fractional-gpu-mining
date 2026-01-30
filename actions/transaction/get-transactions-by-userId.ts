"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import { AccountInfo, FinancialAccountsBundle } from "@/types/user-wallet-account";
import { User } from "@/types/user"; // assuming you have a User type

/**
 * Fetch all transactions for a given userId
 * Returns AccountInfo[] + user inside FinancialAccountsBundle
 */
export async function getUserAccounts(
  user: User
): Promise<ServerResponse<FinancialAccountsBundle>> {
  try {
    // ✅ Fetch accounts
    const accounts = await db.query.userWalletAccountTable.findMany({
      columns: {
        id: true,
        balance: true,
        currency: true,
        availableAt: true,
        name: true,
        isAdmin:true
      },
      where: (acc, { eq }) => eq(acc.userId, user.id),
    });

    if (!accounts.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No accounts found for this user",
        data: { accounts: [], user }, // ✅ always return user
      };
    }

    // ✅ Collect account IDs
    const accountIds = accounts.map((a) => a.id);

    // ✅ Fetch transactions for these accounts
    const transactions = await db.query.transactionTable.findMany({
      where: (tx, { inArray }) => inArray(tx.walletId, accountIds),
      columns: {
        id: true,
        title: true,
        description: true,
        date: true,
        type: true,
        status: true,
        amount: true,
        walletId: true,
        currency: true,
        thirdpartyTransactionId: true,
        thirdpartyWithdrawalAddress: true,
        miningPlanId: true,
        billingOptionId: true,
      },
      with: {
        miningPlan: {
          columns: {
            id: true,
            title: true,
            description: true,
          },
        },
        billingOption: {
          columns: {
            id: true,
            type: true,
            miningCycle: true,
          },
        },
      },
    });

    // ✅ Attach transactions to respective accounts
    const accountInfo: AccountInfo[] = accounts.map((account) => {
      const txsForAccount = transactions.filter(
        (tx) => tx.walletId === account.id
      );
      return { ...account, transactions: txsForAccount };
    });

    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: "Accounts and transactions fetched successfully",
      data: { accounts: accountInfo, user }, // ✅ include user
    };
  } catch (error) {
    console.error("getUserAccounts error:", error);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to fetch accounts and transactions",
      error: String(error),
    };
  }
}

/**
 * Get transactions for the currently logged-in user
 */
export async function getTransactionsByUserId(): Promise<
  ServerResponse<FinancialAccountsBundle>
> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // ✅ Pass full user object, not just id
    return await getUserAccounts(user);
  } catch (err: unknown) {
    console.error("❌ Failed to fetch transactions by walletId:", err);

    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while fetching transactions",
      error: err instanceof Error ? err.message : "Failed to fetch transactions",
    };
  }
}
