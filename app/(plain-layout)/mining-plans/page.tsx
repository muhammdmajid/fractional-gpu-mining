// app/plans/gpu-mining/page.tsx
import type { Metadata } from "next";
import { SEO_CONFIG } from "@/config/index";
import { GPUMiningPlanClient } from "./page.client";


export const metadata: Metadata = {
  title: `GPU Mining Plan | ${SEO_CONFIG.name}`,
  description:
    "Tailored GPU cryptocurrency mining plan. Choose your GPUs, customize quantities, and optimize your mining setup for maximum efficiency.",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: `GPU Mining Plan | ${SEO_CONFIG.name}`,
    description:
      "Tailored GPU cryptocurrency mining plan. Choose your GPUs, customize quantities, and optimize your mining setup for maximum efficiency.",
    url: SEO_CONFIG.seo.baseUrl + "/mining-plans",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `GPU Mining Plan | ${SEO_CONFIG.name}`,
    description:
      "Tailored GPU cryptocurrency mining plan. Choose your GPUs, customize quantities, and optimize your mining setup for maximum efficiency.",
  },
};

export default function GPUMiningPlanPage() {
  return (
    <>
      <GPUMiningPlanClient />
    </>
  );
}
