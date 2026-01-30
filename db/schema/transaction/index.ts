// 📦 Drizzle ORM core imports
import { pgTable, text, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { userWalletAccountTable } from "../user-wallet-account";
import { generateUniqueId } from "@/db/utils";
import { miningPlanOptionsTable, miningPlansTable } from "../mining-plans";


// ============================
// ✅ Enum Constants
// ============================

// Possible statuses for a transaction
export const TRANSACTION_STATUSES = [
  "pending",   // Transaction is in progress
  "completed", // Transaction successfully completed
  "failed",    // Transaction failed due to an error
  "cancelled", // Transaction was manually cancelled
] as const;

// Types of transactions
export const TRANSACTION_TYPES = ["deposit", "withdrawal"] as const;

// ============================
// ✅ pgEnum Definitions
// ============================

// PostgreSQL enum for transaction status
export const transactionStatusEnum = pgEnum("transaction_status", TRANSACTION_STATUSES);

// PostgreSQL enum for transaction type
export const transactionTypeEnum = pgEnum("transaction_type", TRANSACTION_TYPES);

// ============================
// 📑 Transaction Table Definition (Updated)
// ============================
export const transactionTable = pgTable("transactions", {
  // 🔑 Unique transaction ID (hexadecimal, 16 bytes)
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("tx", 35)),

  // 📝 Transaction metadata
  title: text("title"),
  description: text("description"),
  date: timestamp("date").notNull().$defaultFn(() => new Date()),

  // 🎯 Transaction type & status
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull().default(TRANSACTION_STATUSES[0]),

  // 💰 Transaction amount
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").default("USDT"),
  // 📤 Linked wallet
  walletId: text("wallet_id")
    .notNull()
    .references(() => userWalletAccountTable.id, { onDelete: "cascade" }),

  // 🆕 Optional third-party transaction ID (deposit only)
  thirdpartyTransactionId: text("thirdparty_transaction_id"), // nullable by default

  // 🆕 Optional third-party withdrawal address (withdrawal only)
  thirdpartyWithdrawalAddress: text("thirdparty_withdrawal_address"), // nullable by default

  // 🆕 Optional Mining Plan & Billing Option References
  miningPlanId: text("mining_plan_id").references(() => miningPlansTable.id, {
    onDelete: "set null",
  }),
  billingOptionId: text("billing_option_id").references(
    () => miningPlanOptionsTable.id,
    { onDelete: "set null" },
  ),
  // 📅 Timestamps for auditing
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});
