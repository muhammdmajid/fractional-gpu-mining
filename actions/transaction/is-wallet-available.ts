
"use server";
import { db } from "@/db";
import { ServerResponse } from "@/types";
import { getCurrentUser } from "@/lib/auth";

/**
 * Checks if a wallet account is currently available based on its ID.
 * @param id - The ID of the wallet account to check.
 * @returns ServerResponse with `available` boolean.
 */
export async function isWalletAvailable(
  id: string
): Promise<ServerResponse<{ available: boolean }>> {
  try {
    // Get the currently authenticated user
    const user = await getCurrentUser();
    if (!user?.id) {
      return {
        success: false,
        status: "error",
        statusCode: 401,
        message: "User not authenticated",
      };
    }

    // Find the wallet account by ID and ensure it belongs to the current user
    const wallet = await db.query.userWalletAccountTable.findFirst({
      where: (acc, { eq, and }) => and(eq(acc.id, id), eq(acc.userId, user.id)),
    });

    // If wallet not found, return 404
    if (!wallet) {
      return {
        success: false,
        status: "error",
        statusCode: 404,
        message: "Wallet not found",
      };
    }

    // Determine if the wallet is available (availableAt <= current time)
    const available = wallet.availableAt <= new Date();

    // Return availability status
    return {
      success: true,
      status: "success",
      statusCode: 200,
      message: available ? "Wallet is available" : "Wallet is not available yet",
      data: { available },
    };
  } catch (err: unknown) {
    // Catch any unexpected errors
    console.error("❌ Wallet availability check failed:", err);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      message: "Error checking wallet availability",
      error: err instanceof Error ? err.message : "Unknown",
    };
  }
}
