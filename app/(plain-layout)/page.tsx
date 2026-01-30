import { SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";
import HeroSection from "@/ui/components/pages/home/hero-section";
import MiningPlansSection from "@/ui/components/pages/home/mining-plans-section";
import FeaturesSection from "@/ui/components/pages/home/features-section";
import TestimonialsSectionWrapper from "@/ui/components/pages/home/testimonials-section-wrapper";
import CTASection from "@/ui/components/pages/home/CTA-section";

// ✅ Metadata & viewport
export const metadata: Metadata = {
  title: `${SEO_CONFIG?.name ?? "Fractional GPU Mining"} | Home`,
  description: SEO_CONFIG?.description ?? "Access powerful GPUs for mining and AI workloads without owning hardware.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG?.name ?? "Fractional GPU Mining"} | Home`,
    description: SEO_CONFIG?.description ?? "Access powerful GPUs for mining and AI workloads without owning hardware.",
    url: SEO_CONFIG?.seo?.baseUrl ?? "/",
    siteName: SEO_CONFIG?.name ?? "Fractional GPU Mining",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG?.name ?? "Fractional GPU Mining"} | Home`,
    description: SEO_CONFIG?.description ?? "Access powerful GPUs for mining and AI workloads without owning hardware.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-y-16 bg-gradient-to-b from-muted/50 via-muted/25 to-background">
      <HeroSection />
      <MiningPlansSection />
      <FeaturesSection />
      <TestimonialsSectionWrapper />
      <CTASection />
    </main>
  );
}
