import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config";
import GPUMiningGalleryClient from "./page.client";


// ✅ Metadata for GPU Fractional Mining Gallery page
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | GPU Fractional Mining Gallery`,
  description:
    "Explore fractional GPU mining rigs, monitor performance metrics, and see your shared mining resources in action.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | GPU Fractional Mining Gallery`,
    description:
      "Explore fractional GPU mining rigs, monitor performance metrics, and see your shared mining resources in action.",
    url: SEO_CONFIG.seo.baseUrl + "/gpu-mining-gallery",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | GPU Fractional Mining Gallery`,
    description:
      "Explore fractional GPU mining rigs, monitor performance metrics, and see your shared mining resources in action.",
  },
};

// ✅ Viewport for responsive scaling
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ✅ Server Component renders the client component
export default function GPUMiningGalleryPage() {
  return <GPUMiningGalleryClient />;
}
