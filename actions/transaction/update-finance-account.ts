"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import {
  FinancialAccountsBundle,
  InsertUserWalletAccount,
} from "@/types/user-wallet-account";
import { ServerResponse, FieldErrors } from "@/types";
import { insertUserWalletAccountSchema } from "@/validation/user-wallet-account";
import zodErrorToFieldErrors from "@/lib/zod-error-t-field-errors";
import { userWalletAccountTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import { getUserAccounts } from "./get-transactions-by-userId";

/**
 * Update an existing financial account for the authenticated user.
 *
 * Steps:
 *  1. Authenticate the current user.
 *  2. Validate the incoming account payload using Zod schema.
 *  3. Ensure the account belongs to the authenticated user.
 *  4. Update the wallet account in the database.
 *  5. Fetch and return all accounts (with transactions) for the user, including the updated one.
 *
 * Returns:
 *  - On success: Updated FinancialAccountsBundle containing user accounts and transactions.
 *  - On failure: ServerResponse with error details and status code.
 */
export async function updateFinanceAccount(
  accountId: string,
  accountInput: Partial<InsertUserWalletAccount>
): Promise<ServerResponse<FinancialAccountsBundle>> {
  try {
    // ✅ Step 1: Ensure the user is authenticated
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        status: "unauthorized",
        statusCode: 401,
        message: "User not signed in",
      };
    }

    // ✅ Step 2: Validate account input (only provided fields)
    const validation = insertUserWalletAccountSchema
      .partial()
      .safeParse(accountInput);

    if (!validation.success) {
      const fieldErrors: FieldErrors = zodErrorToFieldErrors(validation.error);
      return {
        success: false,
        status: "validation_error",
        statusCode: 400,
        error: fieldErrors,
      };
    }

    // ✅ Step 3: Check if account belongs to the current user
    const account = await db.query.userWalletAccountTable.findFirst({
      where: (fields, { eq, and }) =>
        and(eq(fields.id, accountId), eq(fields.userId, user.id)),
    });

    if (!account) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Account not found or does not belong to the user",
      };
    }

    // ✅ Step 4: Update account in the database
    await db
      .update(userWalletAccountTable)
      .set({
        ...(validation.data.name && { name: validation.data.name }),
        ...(validation.data.currency && { currency: validation.data.currency }),
        isAdmin:user.role==="admin",
        updatedAt: new Date(),
      })
      .where(and(eq(userWalletAccountTable.id, accountId)));

    // ✅ Step 5: Return updated accounts list
    return await getUserAccounts(user);
  } catch (err: unknown) {
    console.error("❌ Failed to update finance account:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Failed to update finance account",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
