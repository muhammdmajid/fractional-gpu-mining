import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

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

// ✅ Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

// ✅ Handle SSL mode (optional, default disable)
const sslMode = (process.env.DB_SSLMODE || "disable").toLowerCase();
let sslSetting: boolean | object = false;

if (sslMode === "require") {
  sslSetting = true;
} else if (sslMode === "verify-full") {
  sslSetting = { rejectUnauthorized: true };
} else if (sslMode === "disable") {
  sslSetting = false;
} else {
  sslSetting = { rejectUnauthorized: false };
}

// ✅ Final Drizzle configuration
export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: sslSetting,
  },
});
