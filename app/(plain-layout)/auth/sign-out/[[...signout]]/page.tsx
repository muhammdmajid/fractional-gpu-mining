import type { Metadata, Viewport } from "next";

import { SignOutPageClient } from "@/app/(plain-layout)/auth/sign-out/[[...signout]]/page.client";
import { getCurrentUser, } from "@/lib/auth";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/ui/components/page-header";
import { Shell } from "@/ui/primitives/shell";
import { SEO_CONFIG, SYSTEM_CONFIG } from "@/config/index";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Sign Out`,
  description: "Sign out of your account and end your session securely.",
  metadataBase: new URL(SEO_CONFIG.seo.baseUrl),
  robots: "noindex, nofollow", // usually sign-out pages should not be indexed
  openGraph: {
    title: `${SEO_CONFIG.name} | Sign Out`,
    description: "Sign out of your account and end your session securely.",
    url: SEO_CONFIG.seo.baseUrl + "/auth/sign-out",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Sign Out`,
    description: "Sign out of your account and end your session securely.",
  },
};

// ✅ Fix: move viewport to a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function SignOutPage() {
  const user = await getCurrentUser();

  if (!user) {
    // User is already signed in → redirect to dashboard
    redirect(SYSTEM_CONFIG.redirectBeforeSignIn);
  }



  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>Sign out</PageHeaderHeading>
        <PageHeaderDescription>
          Are you sure you want to sign out?
        </PageHeaderDescription>
      </PageHeader>
      <SignOutPageClient />
    </Shell>
  );
}
