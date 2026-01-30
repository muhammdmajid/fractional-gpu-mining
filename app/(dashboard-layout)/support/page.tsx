// app/support/page.tsx

import SupportPageClient from "./page.client";

import { SEO_CONFIG, SYSTEM_CONFIG } from "@/config";
import { getCurrentUser } from "@/lib/auth";
import { UserDbType } from "@/lib/auth-types";
import { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Support - GPU Based Cryptocurrency Mining`,
  description:
    "Get answers to your questions about GPU-based cryptocurrency mining. Explore FAQs, manage investments, check referrals, and contact support.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Support - GPU Based Cryptocurrency Mining`,
    description:
      "Get answers to your questions about GPU-based cryptocurrency mining. Explore FAQs, manage investments, check referrals, and contact support.",
    url: `${SEO_CONFIG.seo.baseUrl}/support`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Support - GPU Based Cryptocurrency Mining`,
    description:
      "Get answers to your questions about GPU-based cryptocurrency mining. Explore FAQs, manage investments, check referrals, and contact support.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function SupportPage() {

    const user:UserDbType | null= await getCurrentUser();
  
    if (!user) {
      redirect(SYSTEM_CONFIG.redirectBeforeSignIn);
    }
  
  return (
    <>
      <SupportPageClient user={user} />
    </>
  );
}
