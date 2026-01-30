// app/contact-us/page.tsx
import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config";
import ContactUsPageClient from "./page.client";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Contact Us - GPU Based Cryptocurrency Mining`,
  description:
    "Get in touch with our support team for assistance with GPU-based cryptocurrency mining. We’re available 24/7 to help with account setup, mining plans, withdrawals, and troubleshooting.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Contact Us - GPU Based Cryptocurrency Mining`,
    description:
      "Get in touch with our support team for assistance with GPU-based cryptocurrency mining. We’re available 24/7 to help with account setup, mining plans, withdrawals, and troubleshooting.",
    url: `${SEO_CONFIG.seo.baseUrl}/contact-us`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Contact Us - GPU Based Cryptocurrency Mining`,
    description:
      "Get in touch with our support team for assistance with GPU-based cryptocurrency mining. We’re available 24/7 to help with account setup, mining plans, withdrawals, and troubleshooting.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function ContactUsPage() {
  return <ContactUsPageClient />;
}
