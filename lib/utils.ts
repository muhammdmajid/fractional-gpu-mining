import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OTP_ATTEMPT_LIMIT } from "./constants";
import { GPUEntry, MiningPlanSelected } from "@/types/mining-plans";


import { PAYMENT_WITHDRAWAL_POLICY } from "@/config";
import { TransactionStatus, TransactionType } from "@/types/transaction";
import { MiningStatusStream, MonthlyData } from "@/types/fractional-mining-profit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRemainingTimeString(expiresAt: Date, now: Date = new Date()): string {
  const diffInMs = expiresAt.getTime() - now.getTime();

  if (diffInMs <= 0) return "expired";

  const seconds = Math.floor((diffInMs / 1000) % 60);
  const minutes = Math.floor((diffInMs / 1000 / 60) % 60);
  const hours = Math.floor(diffInMs / 1000 / 60 / 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}


export const remainingAttemptsMessage = (attempts: number): string => {
  const remaining = OTP_ATTEMPT_LIMIT - attempts;
  return `You have ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining out of ${OTP_ATTEMPT_LIMIT}.`;
};


export function isActivePathname(
  basePathname: string,
  currentPathname: string,
  exactMatch: boolean = false
) {
  if (typeof basePathname !== "string" || typeof currentPathname !== "string") {
    throw new Error("Both basePathname and currentPathname must be strings")
  }

  // Use this when you want a strict comparison, e.g., highlighting a specific page.
  if (exactMatch) {
    return basePathname === currentPathname
  }

  // Allow deeper routes to be considered as active.
  // Example: If basePathname is "/dashboard", it should match "/dashboard/stats".
  return (
    currentPathname.startsWith(basePathname) &&
    (currentPathname.length === basePathname.length ||
      currentPathname[basePathname.length] === "/")
  )
}

export function titleCaseToCamelCase(titleCaseStr: string) {
  const camelCaseStr = titleCaseStr
    .toLowerCase() // Convert the entire string to lowercase first
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Remove spaces and capitalize the following character

  return camelCaseStr
}

export function calculatePlansTotals(selectedPlan?: MiningPlanSelected | null) {
  if (!selectedPlan?.selectedOption) {
    return { gpuTotal: 0, optionPrice: 0, grandTotal: 0, discount: 0 };
  }

  const {
    selectedgpus = [],
    basePrice = 0,
    baseDiscount = 0,
    type,
  } = selectedPlan.selectedOption;

  // 🔹 GPU total (sum of GPU prices)
  const gpuTotal = selectedgpus.reduce(
    (sum, gpu) => sum + Number(gpu.pricePerGpu || 0),
    0
  );

  const basePriceN = Number(basePrice || 0);
  const discountRate = Number(baseDiscount || 0); // percentage (0–100)

  // 🔹 Monthly cost (base + GPU)
  const monthlyTotal = basePriceN + gpuTotal;

  // 🔹 Option price (before discount)
  const optionPrice =
    type === "monthly"
      ? monthlyTotal
      : type === "yearly"
      ? monthlyTotal * 12
      : 0;

  // 🔹 Discount value in currency
  const discountValue = (optionPrice * discountRate) / 100;

  // 🔹 Grand total (after discount)
  const grandTotal = optionPrice - discountValue;

  return {
    gpuTotal,
    optionPrice,
    grandTotal,
    discount: discountValue,
  };
}

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}



/**
 * Generate a professional transaction subject + message.
 */
export function getTransactionDescription({
  type,
  newStatus,
  amount,
  walletCurrency,
  userName,
  transactionId,
  thirdpartyTransactionId,
  thirdpartyWithdrawalAddress
}: {
  type: TransactionType; // "deposit" | "withdrawal"
  newStatus: TransactionStatus;
  amount: number;
  walletCurrency: string;
  userName: string;
  transactionId: string;
  thirdpartyTransactionId?: string;
  thirdpartyWithdrawalAddress?: string;
}): { subject: string; message: string } {
  if (!type || !newStatus || !walletCurrency || !userName || !transactionId) {
    throw new Error("Missing required transaction parameters.");
  }

  if (amount == null || amount < 0) {
    throw new Error("Amount must be a positive number.");
  }

  // === Withdrawal Transactions ===
  if (type === "withdrawal") {
    const withdrawalChargeRate =
      PAYMENT_WITHDRAWAL_POLICY?.WITHDRAWAL_CHARGE ?? 0;

    const chargeAmount = Math.max(
      0,
      +((amount * withdrawalChargeRate)).toFixed(2),
    );
    const netAmount = Math.max(
      0,
      +(amount - (amount > 0 ? chargeAmount : 0)).toFixed(2),
    );

    switch (newStatus) {
      case "pending":
        return {
          subject: `Withdrawal Request Pending – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your withdrawal request has been received and is under review.",
            "",
            "Withdrawal Summary:",
            `• Requested Amount: ${walletCurrency}${amount.toFixed(2)}`,
            `• Withdrawal Fee: ${withdrawalChargeRate}% (${walletCurrency}${chargeAmount.toFixed(2)})`,
            `• Net Amount: ${walletCurrency}${netAmount.toFixed(2)}`,
            `• Withdrawal Address: ${thirdpartyWithdrawalAddress ?? "N/A"}`,
            "",
            "Status: ⏳ Pending",
          ].join("\n"),
        };

      case "completed":
        return {
          subject: `Withdrawal Completed – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your withdrawal has been successfully processed.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            `Withdrawal Address: ${thirdpartyWithdrawalAddress ?? "N/A"}`,
            "",
            "Withdrawal Summary:",
            `• Requested Amount: ${walletCurrency}${amount.toFixed(2)}`,
            `• Withdrawal Fee: ${withdrawalChargeRate}% (${walletCurrency}${chargeAmount.toFixed(2)})`,
            `• Net Amount: ${walletCurrency}${netAmount.toFixed(2)}`,
            "",
            "Status: ✅ Completed",
          ].join("\n"),
        };

      case "failed":
        return {
          subject: `Withdrawal Failed – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Unfortunately, your withdrawal could not be processed.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            `Withdrawal Address: ${thirdpartyWithdrawalAddress ?? "N/A"}`,
            "",
            `Requested Amount: ${walletCurrency}${amount.toFixed(2)}`,
            "",
            "Status: ❌ Failed",
          ].join("\n"),
        };

      case "cancelled":
        return {
          subject: `Withdrawal Cancelled – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your withdrawal request was cancelled by the administrator.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            `Withdrawal Address: ${thirdpartyWithdrawalAddress ?? "N/A"}`,
            "",
            `Requested Amount: ${walletCurrency}${amount.toFixed(2)}`,
            "",
            "Status: 🚫 Cancelled",
          ].join("\n"),
        };

      default:
        throw new Error(`Unknown withdrawal status: ${newStatus}`);
    }
  }


  // === Deposit Transactions ===
  if (type === "deposit") {
    switch (newStatus) {
      case "pending":
        return {
          subject: `Deposit Pending – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your deposit request has been received and is under review.",
            "",
            "Deposit Summary:",
            `• Amount: ${walletCurrency}${amount.toFixed(2)}`,
            thirdpartyTransactionId
              ? `• Third-Party Transaction ID: ${thirdpartyTransactionId}`
              : "",
            "",
            "Status: ⏳ Pending",
          ]
            .filter(Boolean)
            .join("\n"),
        };

      case "completed":
        return {
          subject: `Deposit Successful – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your deposit has been successfully credited to your wallet.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            thirdpartyTransactionId
              ? `Third-Party Transaction ID: ${thirdpartyTransactionId}`
              : "",
            "",
            "Deposit Summary:",
            `• Amount: ${walletCurrency}${amount.toFixed(2)}`,
            "",
            "Status: ✅ Completed",
          ]
            .filter(Boolean)
            .join("\n"),
        };

      case "failed":
        return {
          subject: `Deposit Failed – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Unfortunately, your deposit could not be processed.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            thirdpartyTransactionId
              ? `Third-Party Transaction ID: ${thirdpartyTransactionId}`
              : "",
            "",
            `Amount: ${walletCurrency}${amount.toFixed(2)}`,
            "",
            "Status: ❌ Failed",
          ]
            .filter(Boolean)
            .join("\n"),
        };

      case "cancelled":
        return {
          subject: `Deposit Cancelled – ${walletCurrency}${amount.toFixed(2)}`,
          message: [
            "Your deposit request was cancelled by the administrator.",
            "",
            `User: ${userName}`,
            `Transaction ID: ${transactionId}`,
            thirdpartyTransactionId
              ? `Third-Party Transaction ID: ${thirdpartyTransactionId}`
              : "",
            "",
            `Amount: ${walletCurrency}${amount.toFixed(2)}`,
            "",
            "Status: 🚫 Cancelled",
          ]
            .filter(Boolean)
            .join("\n"),
        };

      default:
        throw new Error(`Unknown deposit status: ${newStatus}`);
    }
  }

  throw new Error(`Unknown transaction type: ${type}`);
}




export function asString(n: number) {
  return Number.isFinite(n) ? n.toFixed(8) : "0";
}


/**
 * Generate a professional transaction description
 * specifically for mining investment transactions.
 */
export function formatInvestmentTransactionDescription(params: {
  action: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  planTitle: string;
  optionCycle: string | number;
  transactionId: string;
  userName: string;
}) {
  const { action, amount, currency, planTitle, optionCycle, transactionId, userName } =
    params;

  const formattedAmount = `${currency}${amount.toFixed(2)}`;

  if (action === "withdrawal") {
    return {
      subject: `Mining Investment - Withdrawal Processed`,
      message: [
        "Your mining investment withdrawal has been successfully processed.",
        "",
        `User: ${userName}`,
        `Transaction ID: ${transactionId}`,
        "",
        "Withdrawal Summary:",
        `• Plan: ${planTitle}`,
        `• Cycle: ${optionCycle}`,
        `• Amount: ${formattedAmount}`,
        "",
        "Status: ✅ Completed",
      ].join("\n"),
    };
  }

  if (action === "deposit") {
    return {
      subject: `Mining Investment - Deposit Confirmed`,
      message: [
        "Your mining investment deposit has been successfully received.",
        "",
        `User: ${userName}`,
        `Transaction ID: ${transactionId}`,
        "",
        "Deposit Summary:",
        `• Plan: ${planTitle}`,
        `• Cycle: ${optionCycle}`,
        `• Amount: ${formattedAmount}`,
        "",
        "Status: ✅ Completed",
      ].join("\n"),
    };
  }

  return {
    subject: "Mining Investment Transaction",
    message: [
      `Transaction ${transactionId} processed for ${formattedAmount}.`,
      "",
      "Status: ✅ Completed",
    ].join("\n"),
  };
}


export function calculateTotalHashRateMHs(
  gpus: GPUEntry[] | null | undefined
): string {
  try {
    if (!gpus || !Array.isArray(gpus)) {
      return "0.00"; // no GPUs
    }

    const totalPerHour = gpus.reduce((sum, g) => {
      const rate = g?.gpu?.hashRate;
      if (!rate) return sum;

      const parsed = parseFloat(rate);
      return isNaN(parsed) ? sum : sum + parsed;
    }, 0);

    // Convert per hour → MH/s
    const mhps = (totalPerHour * 1_000_000) / 3600;

    return mhps.toFixed(2);
  } catch (error) {
    console.error("Error calculating total hash rate:", error);
    return "0.00"; // fallback safe value
  }
}



export const filterWithdrawable = (
  monthlyData: MonthlyData[] | null | undefined
): MonthlyData[] => {
  try {
    if (!monthlyData) return [];

    if (!Array.isArray(monthlyData)) {
      console.error("filterWithdrawable: Expected an array, got", monthlyData);
      return [];
    }

    return monthlyData.filter((item) => {
      try {
        return item.withdrawable && !item.locked && !item.isTransferred;
      } catch (err) {
        console.error("filterWithdrawable: Invalid item structure", item, err);
        return false; // skip bad items
      }
    });
  } catch (error) {
    console.error("filterWithdrawable: Unexpected error", error);
    return [];
  }
};
