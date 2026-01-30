// app/auth/sign-in/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { SignInPageClient } from "./page.client";
import { SYSTEM_CONFIG, SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";

// ✅ Correct way to export metadata
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Sign In`,
  description: "Sign in to access your dashboard and manage your account.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Sign In`,
    description: "Sign in to access your dashboard and manage your account.",
    url: SEO_CONFIG.seo.baseUrl + "/auth/sign-in",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Sign In`,
    description: "Sign in to access your dashboard and manage your account.",
  },
};

// ✅ Move viewport into its own export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    // User is already signed in → redirect to dashboard
    redirect(SYSTEM_CONFIG.redirectAfterSignIn);
  }


  return <SignInPageClient />;
}
