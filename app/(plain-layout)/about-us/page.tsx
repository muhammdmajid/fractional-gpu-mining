import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config";
import AboutPageClient from "./page.client";

// ✅ Metadata for About Us page
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} |About Us `,
  description:
    "We are a US-based startup offering fractional GPU mining to make cryptocurrency mining accessible for everyone.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} |About Us `,
    description:
      "We are a US-based startup offering fractional GPU mining to make cryptocurrency mining accessible for everyone.",
    url: SEO_CONFIG.seo.baseUrl + "/about-us",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} |About Us `,
    description:
      "We are a US-based startup offering fractional GPU mining to make cryptocurrency mining accessible for everyone.",
  },
};

// ✅ Separate viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AboutPage() {
  return <AboutPageClient />;
}
