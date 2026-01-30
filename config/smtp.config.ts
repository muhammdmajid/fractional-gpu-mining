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

/**
 * Utility function for safer env variable access
 */
function getEnvVar(key: string, required = true): string | undefined {
  const value = process.env[key];
  if (required && (!value || value.trim() === "")) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

let smtpConfig: {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
};

try {
  smtpConfig = {
    host: getEnvVar("SMTP_HOST")!,
    port: Number(getEnvVar("SMTP_PORT")),
    auth: {
      user: getEnvVar("SMTP_USER")!,
      pass: getEnvVar("SMTP_PASSWORD")!,
    },
  };

  if (isNaN(smtpConfig.port) || smtpConfig.port <= 0) {
    throw new Error("❌ Invalid SMTP_PORT value. Must be a positive number.");
  }
} catch (error) {
  console.error("⚠️ SMTP configuration error:", (error as Error).message);
  // Throw an error to prevent the app from running with invalid config
  throw error;
}

export default smtpConfig;
