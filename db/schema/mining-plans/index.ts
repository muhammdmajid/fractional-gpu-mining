import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import CryptoJS from "crypto-js";
import { transactionTable } from "../transaction";
import { generateUniqueId } from "@/db/utils";



/**
 * Helper to generate a random 16-byte hex string (default ID)
 */
const generateId = () =>
  CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

// ==============================
// Mining Plans (main investment plans)
// ==============================
export const miningPlansTable = pgTable("mining_plans", {
  id: text("id").primaryKey().$defaultFn(generateId), // Unique ID
  title: varchar("title", { length: 100 }).notNull(), // Plan title
  description: text("description").notNull(), // Description of the plan
  features: text("features").array().default([]),
  actionLabel: varchar("action_label", { length: 50 }).notNull(), // e.g., "Buy Now"
  popular: boolean("popular").default(false), // Highlight as popular
  custom: boolean("custom").default(false), // Mark as custom plan
  priority: integer("priority").notNull().unique(), // Unique priority (sorting order)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});


// ==============================
// Plan Options (billing cycles, lock periods, discounts)
// ==============================

// ============================
// ✅ Plan Option Types
// ============================
export const PLAN_OPTION_TYPES = ["monthly", "yearly"] as const;


export const planOptionTypeEnum = pgEnum("plan_option_type", PLAN_OPTION_TYPES);


// ============================
// ✅ Mining Plan Options Table
// ============================
export const miningPlanOptionsTable = pgTable("mining_plan_options", {
  id: text("id").primaryKey().$defaultFn(() => generateUniqueId("plan", 37)),
  planId: text("plan_id")
    .notNull()
    .references(() => miningPlansTable.id, { onDelete: "cascade" }),
  type: planOptionTypeEnum("type").notNull(), // using enum
  basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(), // Base price of the investment
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(), // ✅ Final calculated price
  miningCycle: integer("mining-cycle").notNull(),
  baseDiscount: integer("base_discount").default(0),
  currency: text("currency").default("USDT"),
  features: text("features").array().default([]), // ✅ Array of text features
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ==============================
// GPUs included in a plan option
// ==============================
export const miningPlanGpusTable = pgTable("mining_plan_gpus", {
  id: text("id").primaryKey().$defaultFn(generateId),
  model: varchar("model", { length: 100 }).notNull(), // GPU model name
  memory: varchar("memory", { length: 50 }).notNull(), // GPU memory
  hashRate:numeric("hash_rate", { precision: 5, scale: 2 }).default("1.00").notNull(), // Hash rate
  powerConsumption: varchar("power_consumption", { length: 50 }).notNull(), // Power usage
  fraction: numeric("fraction", { precision: 5, scale: 2 }).default("1.00").notNull(),
  pricePerGpu: numeric("price_per_gpu", { precision: 12, scale: 2 }).notNull(), // Price per GPU
     currency: text("currency").default("USDT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ==============================
// Many-to-Many: Plan Options ↔ GPUs
// ==============================
export const miningPlanOptionGpusTable = pgTable("mining_plan_option_gpus", {
  id: text("id").primaryKey().$defaultFn(generateId), // Unique ID for the relation
  optionId: text("option_id")
    .notNull()
    .references(() => miningPlanOptionsTable.id, { onDelete: "cascade" }),
  gpuId: text("gpu_id")
    .notNull()
    .references(() => miningPlanGpusTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
// ============================
// Plan Status Enum
// ============================
export const PLAN_STATUSES = [
  "pending",   // Waiting for payment/confirmation
  "active",    // Currently running
  "expired",   // Finished duration
  "cancelled", // Cancelled before expiry
] as const;

export const planStatusEnum = pgEnum("plan_status", PLAN_STATUSES);

// ==============================
// User Investments (at plan level)
// ==============================
export const miningInvestmentsTable = pgTable("mining_investments", {
  id: text("id").primaryKey().$defaultFn(generateId), // Unique investment ID

  email: varchar("email", { length: 255 }).notNull(), // Investor's email

  planId: text("plan_id")
    .notNull()
    .references(() => miningPlansTable.id, { onDelete: "cascade" }), // FK → plans/gpus

  optionId: text("option_id")
    .notNull()
    .references(() => miningPlanOptionsTable.id, { onDelete: "cascade" }), // FK → plan options

  miningCycle: integer("mining-cycle").notNull(), // Investment lock duration (days)

  depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 }).notNull(), // Paid amount
  currency: text("currency").default("USDT"),
  transactionDepositId: text("transaction_deposit_id")
    .notNull()
    .references(() => transactionTable.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").defaultNow(), // Investment start date

  // ✅ Now using plan_status enum
  status: planStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow(), // Record creation
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Last updated
});



// ==============================
// Investment GPU Details
// ==============================
export const miningInvestmentGpusTable = pgTable("mining_investment_gpus", {
  id: text("id").primaryKey().$defaultFn(generateId), // Unique record ID
  investmentId: text("investment_id") // FK → miningInvestmentsTable
    .notNull()
    .references(() => miningInvestmentsTable.id, { onDelete: "cascade" }),
  gpuId: text("gpu_id") // FK → miningPlanGpusTable
    .notNull()
    .references(() => miningPlanGpusTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(), // Record creation timestamp
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Record last update timestamp
});



