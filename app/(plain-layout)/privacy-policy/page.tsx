import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config";
import PrivacyPolicyClient from "./page.client";

// ✅ Metadata for Privacy Policy page
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Privacy Policy `,
  description:
    "Read our Privacy Policy to understand how Fractional GPU Mining collects, uses, and protects your personal data.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Privacy Policy `,
    description:
      "Read our Privacy Policy to understand how Fractional GPU Mining collects, uses, and protects your personal data.",
    url: SEO_CONFIG.seo.baseUrl + "/privacy-policy",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Privacy Policy `,
    description:
      "Read our Privacy Policy to understand how Fractional GPU Mining collects, uses, and protects your personal data.",
  },
};

// ✅ Separate viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
