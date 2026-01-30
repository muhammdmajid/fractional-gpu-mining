// note: run `bun db:auth` to generate the `users.ts`
// schema after making breaking changes to this file

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserDbType } from "@/lib/auth-types";
import { emailOTP } from "better-auth/plugins";
import { SEO_CONFIG, SYSTEM_CONFIG } from "@/config/index";
import { db } from "@/db";
import {
  accountTable,
  sessionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from "@/db/schema";
import { OTP_ATTEMPT_LIMIT, OTP_EXPIRE, OTP_LENGTH } from "./constants";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { getRemainingTimeString } from "./utils";

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

// ================== Interfaces ==================
interface GitHubProfile {
  [key: string]: unknown;
  email?: string;
  name?: string;
}

interface GoogleProfile {
  [key: string]: unknown;
  email?: string;
  family_name?: string;
  given_name?: string;
}

interface FacebookProfile {
  [key: string]: unknown;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface SocialProviderConfig {
  [key: string]: unknown;
  clientId: string;
  clientSecret: string;
  mapProfileToUser: (
    profile: GitHubProfile | GoogleProfile | FacebookProfile,
  ) => Record<string, unknown>;
  redirectURI?: string;
  scope: string[];
}

// ================== Social Providers ==================
const hasGithubCredentials =
  process.env.AUTH_GITHUB_ID &&
  process.env.AUTH_GITHUB_SECRET &&
  process.env.AUTH_GITHUB_ID.length > 0 &&
  process.env.AUTH_GITHUB_SECRET.length > 0;

const hasGoogleCredentials =
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET &&
  process.env.AUTH_GOOGLE_ID.length > 0 &&
  process.env.AUTH_GOOGLE_SECRET.length > 0;

const hasFacebookCredentials =
  process.env.AUTH_FACEBOOK_ID &&
  process.env.AUTH_FACEBOOK_SECRET &&
  process.env.AUTH_FACEBOOK_ID.length > 0 &&
  process.env.AUTH_FACEBOOK_SECRET.length > 0;

// Build social providers configuration
const socialProviders: Record<string, SocialProviderConfig> = {};

// --- GitHub Provider ---
if (hasGithubCredentials) {
  socialProviders.github = {
    clientId: process.env.AUTH_GITHUB_ID ?? "",
    clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    mapProfileToUser: (profile: GitHubProfile) => {
      let firstName = "";
      let lastName = "";
      if (profile.name) {
        const nameParts = profile.name.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      }
      return {
        age: null,
        firstName,
        lastName,
      };
    },
    scope: ["user:email", "read:user"],
  };
}

// --- Google Provider ---
if (hasGoogleCredentials) {
  socialProviders.google = {
    clientId: process.env.AUTH_GOOGLE_ID ?? "",
    clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    mapProfileToUser: (profile: GoogleProfile) => {
      return {
        age: null,
        firstName: profile.given_name ?? "",
        lastName: profile.family_name ?? "",
      };
    },
    scope: ["openid", "email", "profile"],
  };
}

// --- Facebook Provider ---
if (hasFacebookCredentials) {
  socialProviders.facebook = {
    clientId: process.env.AUTH_FACEBOOK_ID ?? "",
    clientSecret: process.env.AUTH_FACEBOOK_SECRET ?? "",
    mapProfileToUser: (profile: FacebookProfile) => {
      return {
        age: null,
        firstName: profile.first_name ?? profile.name?.split(" ")[0] ?? "",
        lastName:
          profile.last_name ??
          profile.name?.split(" ").slice(1).join(" ") ??
          "",
      };
    },
    scope: ["email", "public_profile"],
    redirectURI: `${process.env.NEXT_SERVER_APP_URL}/api/auth/callback/facebook`,
  };
}

const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
  .toString()
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean) || [
  // 🌐 Production domains
  "http://localhost:3000",
  "https://fgpumining.site",
  "http://www.fgpumining.site",
  "http://fgpumining.site",

  // 🧩 Server IP access
  "https://199.192.23.73:3000",
  "http://199.192.23.73:3000",
  "http://199.192.23.73:80",

  // 💻 Local development
  "https://localhost:3000",
  "http://localhost:3000",
  "http://localhost:80",
  "*",
];
// ================== Auth Configuration ==================
export const auth = betterAuth({
  account: {
    accountLinking: {
      allowDifferentEmails: false,
      enabled: true,
      trustedProviders: Object.keys(socialProviders),
    },
  },
  baseURL: process.env.NEXT_SERVER_APP_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account: accountTable,
      session: sessionTable,
      twoFactor: twoFactorTable,
      user: userTable,
      verification: verificationTable,
    },
  }),

  emailVerification: {
    // 🔹 Configure email verification logic here if needed
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
  }, // ✅ removed extra brace here

  // Configure OAuth behavior
  oauth: {
    defaultCallbackUrl: SYSTEM_CONFIG.redirectAfterSignIn,
    errorCallbackUrl: "/auth/error",
    linkAccountsByEmail: true,
  },

  // ================== Plugins ==================
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          // TODO: configure your email/SMS provider here
          // Example: send email with `otp`
        },
      },
      skipVerificationOnEnable: true,
    }),

    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const expiry = new Date(Date.now() + OTP_EXPIRE * 1000);
        const remainingTime = getRemainingTimeString(expiry);

        if (type === "sign-in") {
          // 🔹 Handle sign-in OTP
        } else if (type === "email-verification") {
          // 🔹 Handle email verification OTP
          await sendMail(email, EmailTemplate.OTPEmailVerification, {
            code: otp,
            url: SEO_CONFIG.seo.baseUrl ?? "",
            remainingTime,
            email,
          });
        } else {
          // 🔹 Password reset OTP
          await sendMail(email, EmailTemplate.OTPPasswordForgot, {
            code: otp,
            url: SEO_CONFIG.seo.baseUrl ?? "",
            remainingTime,
            email,
          });
        }
      },
      otpLength: OTP_LENGTH,
      expiresIn: OTP_EXPIRE,
      allowedAttempts: OTP_ATTEMPT_LIMIT,
    }),
  ],
  trustHost: true, // required behind reverse proxy
  cookies: {
    secure: true, // ensures HTTPS-only cookies
    sameSite: "none", // ✅ allow cross-origin cookies for public frontend
  },

  secret: process.env.AUTH_SECRET,

  // Only include social providers if credentials are available
  socialProviders,

  // ================== User Schema Extensions ==================
  user: {
    additionalFields: {
      age: { input: true, required: false, type: "number" },
      firstName: { input: true, required: false, type: "string" },
      lastName: { input: true, required: false, type: "string" },
      referral_code: { input: true, required: false, type: "string" }, // ✅
    },
  },
  trustedOrigins,
});

// ================== Utility Functions ==================
export const getCurrentUser = async (): Promise<null | UserDbType> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session ? (session.user as UserDbType) : null;
};

export const getCurrentUserOrRedirect = async (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
): Promise<null | UserDbType> => {
  const user = await getCurrentUser();

  if (!user) {
    if (!ignoreForbidden) {
      redirect(forbiddenUrl);
    }
    return user;
  }

  if (okUrl) {
    redirect(okUrl);
  }

  return user;
};
