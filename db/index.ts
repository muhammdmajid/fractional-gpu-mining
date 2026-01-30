import { DB_DEV_LOGGER } from "@/config/index";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { config } from "dotenv";


/**
 * Resolve runtime environment
 * Defaults to "development" for safety
 */
const NODE_ENV = process.env.NODE_ENV ?? "development";

/**
 * Load environment-specific variables
 * - development → .env.development
 * - production  → .env.production
 */
config({
  path: `.env.${NODE_ENV}`,
});


// ✅ Ensure DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

// ✅ Determine SSL mode (default: disable for local)
const sslMode = (process.env.DB_SSLMODE || "disable").toLowerCase();
let ssl: boolean | object = false;

if (sslMode === "require") {
  ssl = true;
} else if (sslMode === "verify-full") {
  ssl = { rejectUnauthorized: true };
} else if (sslMode === "allow" || sslMode === "prefer") {
  ssl = { rejectUnauthorized: false };
} else {
  ssl = false;
}

// ✅ Create PostgreSQL connection pool using DATABASE_URL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

// ✅ Initialize Drizzle ORM
export const db = drizzle(pool, {
  schema,
  logger: DB_DEV_LOGGER && process.env.NODE_ENV !== "production",
});

// ✅ Connection log
console.log(`[Database] Connected → ${process.env.DATABASE_URL?.split("@")[1]}`);
