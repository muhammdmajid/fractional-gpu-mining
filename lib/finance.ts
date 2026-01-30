import { PAYMENT_WITHDRAWAL_POLICY } from "@/config/index";

interface WithdrawalResult {
  netWithdrawal: number;
  isEligible: boolean;
  error: string | null;
  maxWithdrawal: number;
}

export function calculateWithdrawal(
  withdrawalInput: string | number,
  balanceInput: string | number
): WithdrawalResult {
  try {
    const withdrawalAmount =
      typeof withdrawalInput === "string"
        ? parseFloat(withdrawalInput)
        : withdrawalInput;

    const accountBalance =
      typeof balanceInput === "string"
        ? parseFloat(balanceInput)
        : balanceInput;

    if (isNaN(withdrawalAmount) || isNaN(accountBalance)) {
      throw new Error("Invalid numeric input provided.");
    }

    if (withdrawalAmount <= 0) {
      return {
        netWithdrawal: 0,
        isEligible: false,
        error: "Withdrawal amount must be greater than zero.",
        maxWithdrawal: Math.min(
          accountBalance,
          PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL
        ),
      };
    }

    // ✅ Check against gross withdrawal, not netWithdrawal
    if (withdrawalAmount > accountBalance) {
      return {
        netWithdrawal: 0,
        isEligible: false,
        error: "Withdrawal amount exceeds available balance.",
        maxWithdrawal: Math.min(
          accountBalance,
          PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL
        ),
      };
    }

    const netWithdrawal =
      withdrawalAmount * (1 - PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE);

    // ✅ Eligibility should check requested withdrawal (gross), not balance
    const isEligible =
      withdrawalAmount >= PAYMENT_WITHDRAWAL_POLICY.MIN_WITHDRAWAL &&
      withdrawalAmount <= PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL;

    const maxWithdrawal = Math.min(
      accountBalance,
      PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL
    );

    return { netWithdrawal, isEligible, error: null, maxWithdrawal };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    return {
      netWithdrawal: 0,
      isEligible: false,
      error: errorMessage,
      maxWithdrawal: PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL,
    };
  }
}
