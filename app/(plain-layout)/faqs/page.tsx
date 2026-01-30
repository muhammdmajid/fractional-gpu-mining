// app/faqs/page.tsx
import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config";
import FaqsPageClient from "./page.client";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | FAQs - GPU Based Cryptocurrency Mining`,
  description:
    "Find answers to frequently asked questions about GPU-based cryptocurrency mining. Learn about setup, monitoring, plans, performance, and troubleshooting.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | FAQs - GPU Based Cryptocurrency Mining`,
    description:
      "Find answers to frequently asked questions about GPU-based cryptocurrency mining. Learn about setup, monitoring, plans, performance, and troubleshooting.",
    url: `${SEO_CONFIG.seo.baseUrl}/faqs`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | FAQs - GPU Based Cryptocurrency Mining`,
    description:
      "Find answers to frequently asked questions about GPU-based cryptocurrency mining. Learn about setup, monitoring, plans, performance, and troubleshooting.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default async function FaqsPage() {
  return <FaqsPageClient />;
}
