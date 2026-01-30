// app/coming-soon/page.tsx
import ComingSoon from "@/ui/components/pages/coming-soon";
import { SEO_CONFIG } from "@/config/index";
import type { Metadata } from "next";

// Metadata for Coming Soon page
export const metadata: Metadata = {
  title: `Coming Soon | ${SEO_CONFIG.name}`,
  description: "Subscribe to be notified when we launch.",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: `Coming Soon | ${SEO_CONFIG.name}`,
    description: "Subscribe to be notified when we launch.",
    url: SEO_CONFIG.seo.baseUrl + "/coming-soon",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Coming Soon | ${SEO_CONFIG.name}`,
    description: "Subscribe to be notified when we launch.",
  },
};

export default function ComingSoonPgae() {
  // Get the current date and add two days
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);

  return <ComingSoon targetDate={targetDate} />;
}
