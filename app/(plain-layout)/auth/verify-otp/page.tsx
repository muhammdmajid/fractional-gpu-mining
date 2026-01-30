export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import VerifyOtpClient from "./page.client";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { SEO_CONFIG, SYSTEM_CONFIG } from "@/config/index";

export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Verify Your Email Address`,
  description:
    "Confirm your email address to activate your account and access all features securely.",
  metadataBase: new URL(SEO_CONFIG.seo.baseUrl),
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow", // OTP verification pages should not be indexed
  openGraph: {
    title: `${SEO_CONFIG.name} | Verify Your Email Address`,
    description:
      "Confirm your email address to activate your account and access all features securely.",
    url: SEO_CONFIG.seo.baseUrl + "/auth/verify-otp",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Verify Your Email Address`,
    description:
      "Confirm your email address to activate your account and access all features securely.",
  },
};

export default async function Page() {
  await getCurrentUserOrRedirect(
    undefined,
    SYSTEM_CONFIG.redirectAfterSignIn,
    true
  );

  return <VerifyOtpClient />;
}
