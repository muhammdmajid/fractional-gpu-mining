"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { ServerResponse } from "@/types";
import {
  AccountInfo,
  FinancialAccountsBundle,
  FinancialAccountsResponse,
} from "@/types/user-wallet-account";
import { getUserByEmail } from "../user/get-user-by-email";

/**
 * Fetch transactions based on user role:
 * - admin → all users & all accounts
 * - registered → only their own accounts
 */
export async function getTransactionsForAllUsers(): Promise<
  ServerResponse<FinancialAccountsResponse>
> {
  try {
    // Step 1: Ensure the user is authenticated
    let currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // Step 2: Fetch the latest user data from DB
    currentUser = await getUserByEmail(currentUser.email);
    if (!currentUser) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "User not found in database.",
      };
    }

    // Step 3: Fetch users based on role
    const users =
      currentUser.role === "admin"
        ? await db.query.userTable.findMany()
        : await db.query.userTable.findMany({
            where: (u, { eq }) => eq(u.id, currentUser.id),
          });

    if (!users.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message:
          currentUser.role === "admin"
            ? "No users found."
            : "No data found for current user.",
        data: { financialAccounts: [], user: currentUser },
      };
    }

    // Step 4: Fetch wallet accounts based on role
    const accounts =
      currentUser.role === "admin"
        ? await db.query.userWalletAccountTable.findMany()
        : await db.query.userWalletAccountTable.findMany({
            where: (acc, { eq }) => eq(acc.userId, currentUser.id),
          });

    if (!accounts.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        message: "No accounts found.",
        data: { financialAccounts: [], user: currentUser },
      };
    }

    // Step 5: Fetch transactions for the fetched accounts
    const accountIds = accounts.map((a) => a.id);
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

    // Step 6: Build structured bundles per user
    const bundles: FinancialAccountsBundle[] = users.map((user) => {
      const userAccounts = accounts.filter((acc) => acc.userId === user.id);

      const accountInfo: AccountInfo[] = userAccounts.map((account) => ({
        ...account,
        transactions: transactions.filter((tx) => tx.walletId === account.id),
      }));

      return { user, accounts: accountInfo };
    });

    // Step 7: Return success response
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message:
        currentUser.role === "admin"
          ? "Transactions for all users fetched successfully."
          : "Transactions for current user fetched successfully.",
      data: {
        financialAccounts: bundles,
        user: currentUser,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Failed to fetch transactions:", error);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Something went wrong while fetching transactions.",
      error: error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
}
