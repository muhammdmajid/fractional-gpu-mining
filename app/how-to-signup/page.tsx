import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config/index";
import HowToSignUpClient from "./page.client";

// ================================
// ⚙️ Local Constants
// ================================
const PLATFORM_NAME = SEO_CONFIG.fullName;
const SEO_BASE_URL = SEO_CONFIG.seo.baseUrl;
const LAST_UPDATED = "August 28, 2025";

// ================================
// 🔍 Metadata
// ================================
export const metadata: Metadata = {
  title: `${PLATFORM_NAME} | How to Sign Up`,
  description: `Learn how to create an account on ${PLATFORM_NAME} in a few easy steps.`,
  alternates: { canonical: `${SEO_BASE_URL}/how-to-signup` },
  openGraph: {
    title: `${PLATFORM_NAME} | How to Sign Up`,
    description: `Step-by-step guide to signing up on ${PLATFORM_NAME}.`,
    url: `${SEO_BASE_URL}/how-to-signup`,
    siteName: PLATFORM_NAME,
    type: "article",
    images: [{ url: SEO_CONFIG.seo.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PLATFORM_NAME} | How to Sign Up`,
    description: `Follow this simple step-by-step guide to create your account on ${PLATFORM_NAME}.`,
    site: SEO_CONFIG.seo.twitterSite,
    creator: SEO_CONFIG.seo.twitterCreator,
  },
};

// ================================
// 🖥️ Viewport
// ================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ================================
// 📄 Page Component (Server Side)
// ================================
export default function HowToSignUpPage() {
  return <HowToSignUpClient lastUpdated={LAST_UPDATED} platformName={PLATFORM_NAME} />;
}
