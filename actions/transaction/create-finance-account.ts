"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { FinancialAccountsBundle, InsertUserWalletAccount } from "@/types/user-wallet-account";
import { ServerResponse, FieldErrors } from "@/types";
import { insertUserWalletAccountSchema } from "@/validation/user-wallet-account";
import zodErrorToFieldErrors from "@/lib/zod-error-t-field-errors";
import { userWalletAccountTable } from "@/db/schema";

import { getUserAccounts } from "./get-transactions-by-userId";

/**
 * Create a new financial account for the authenticated user.
 *
 * Steps:
 *  1. Authenticate the current user.
 *  2. Validate the incoming account payload using Zod schema.
 *  3. Insert the new wallet account into the database with an initial balance.
 *  4. Fetch and return all accounts (with transactions) for the user, including the newly created one.
 *
 * Returns:
 *  - On success: Updated FinancialAccountsBundle containing user accounts and transactions.
 *  - On failure: ServerResponse with error details and status code.
 */
export async function createFinanceAccount(
    accountInput: InsertUserWalletAccount
): Promise<ServerResponse<FinancialAccountsBundle>> {
    try {
        // ✅ Step 1: Ensure the user is authenticated
        const user = await getCurrentUser();
        if (!user || !user.id) {
            return {
                success: false,
                status: "unauthorized",
                statusCode: 401,
                message: "User not signed in",
            };
        }

        // ✅ Step 2: Validate account input using Zod schema
        const validation = insertUserWalletAccountSchema.safeParse(accountInput);
        if (!validation.success) {
            const fieldErrors: FieldErrors = zodErrorToFieldErrors(validation.error);
            return {
                success: false,
                status: "error",
                statusCode: 400,
                error: fieldErrors,
            };
        }

        // ✅ Step 3: Insert new account into the database
        await db.insert(userWalletAccountTable).values({
            userId: user.id,
            name: accountInput.name,
            currency: accountInput.currency,
            isAdmin:user.role==="admin",
            balance: "0.0",          // Initial balance always starts at zero
            availableAt: new Date(), // Set availability to current timestamp
        });

        // ✅ Step 4: Return all accounts (including the newly created one)
        return await getUserAccounts(user);
    } catch (err: unknown) {
        console.error("❌ Failed to create finance account:", err);
        return {
            success: false,
            status: "error",
            statusCode: 500,
            message: "Failed to create finance account",
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
