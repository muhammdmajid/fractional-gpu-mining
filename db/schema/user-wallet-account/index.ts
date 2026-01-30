// 📦 Drizzle ORM / pg-core imports
import {
  pgTable,
  numeric,
  timestamp,
  text,
  uniqueIndex,
  boolean,   // ✅ add this import
} from "drizzle-orm/pg-core";
import { userTable } from "../user";
import { generateUniqueId } from "@/db/utils";

// ============================
// User Wallet Account Table
// ============================
export const userWalletAccountTable = pgTable(
  "user_wallet_account",
  {
    // 🔑 Unique wallet account ID (hexadecimal, 16 bytes)
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUniqueId("wallet", 38)),

    // 👤 Reference to the user (foreign key)
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    // 🏷 Account name
    name: text("name").notNull(),

    // 💰 Current wallet balance (precision up to 18 digits, 2 decimals)
    balance: numeric("balance", { precision: 18, scale: 2 })
      .notNull()
      .default("0"),

    // 💱 Currency of the wallet
    currency: text("currency").default("USDT"),

    // ⏳ Timestamp when balance becomes available
    availableAt: timestamp("available_at").defaultNow().notNull(),

    // 📅 Record creation timestamp (auto-set)
    createdAt: timestamp("created_at").defaultNow().notNull(),

    // 📅 Last update timestamp (auto-set on update)
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // 🛡 Whether this wallet account belongs to an admin
    isAdmin: boolean("is_admin").notNull().default(false), // ✅ new field
  },
  (table) => [
    // ✅ Composite unique constraint: userId + name
    uniqueIndex("unique_user_account_name").on(table.userId, table.name),
  ]
);
