import { config } from "dotenv";
import type { NextConfig } from "next";
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
// 🌐 Trusted origins list (from .env or defaults)
const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
  .toString()
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean).length
  ? (process.env.TRUSTED_ORIGINS || "")
      .toString()
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:3000",
      "http://localhost:80",
    ];

// ⚙️ Main Next.js Configuration
const nextConfig: NextConfig = {
  basePath: "",
  reactStrictMode: true,

  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
    ],
  },

  crossOrigin: "use-credentials",
  devIndicators: false,
  /* 
  'anonymous': Adds crossOrigin="anonymous", omitting credentials.
  'use-credentials': Adds crossOrigin="use-credentials", sending credentials like cookies.
  */
  allowedDevOrigins: trustedOrigins,

  env: {
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_DISABLE_DEVTOOLS: "1",

    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_SERVER_APP_URL:
      process.env.NEXT_SERVER_APP_URL || "http://localhost:3000",

    AUTH_SECRET: process.env.AUTH_SECRET,
    BETTER_AUTH_SECRET:
      process.env.BETTER_AUTH_SECRET || "fwDrAZJCfPa8mkzCSNvO6V8qTv5ZYXcx",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    TRUSTED_ORIGINS: trustedOrigins.join(","),

    DATABASE_URL: process.env.DATABASE_URL,

    SMTP_HOST: process.env.SMTP_HOST || "mail.privateemail.com",
    SMTP_PORT: process.env.SMTP_PORT || "465",
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,

    OTP_LENGTH: process.env.OTP_LENGTH || "4",
    OTP_EXPIRE: process.env.OTP_EXPIRE || "300",
    OTP_ATTEMPT_LIMIT: process.env.OTP_ATTEMPT_LIMIT || "3",
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
