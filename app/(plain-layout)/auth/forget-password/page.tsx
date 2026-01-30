export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { PasswordForgotPageClient } from "./page.client";
import { getCurrentUser } from "@/lib/auth";
import { SEO_CONFIG, SYSTEM_CONFIG } from "@/config/index";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Update Password – Verify OTP`,
  description:
    "Verify the one-time password (OTP) sent to your registered email address and securely update your password.",
  metadataBase: new URL(SEO_CONFIG.seo.baseUrl),
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow", // usually auth/reset pages should not be indexed
  openGraph: {
    title:  `${SEO_CONFIG.name} | Update Password – Verify OTP`,
    description:
      "Verify the one-time password (OTP) sent to your registered email address and securely update your password.",
    url: SEO_CONFIG.seo.baseUrl + "/auth/password-forgot",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:  `${SEO_CONFIG.name} | Update Password – Verify OTP`,
    description:
      "Verify the one-time password (OTP) sent to your registered email address and securely update your password.",
  },
};

export default async function Page() {
  const user = await getCurrentUser();

  if (user) {
    // User is already signed in → redirect to dashboard
    redirect(SYSTEM_CONFIG.redirectAfterSignIn);
  }

  return <PasswordForgotPageClient />;
}
