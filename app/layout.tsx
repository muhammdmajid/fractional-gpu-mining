import "@/css/globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { SEO_CONFIG } from "@/config/index";
import { Toaster } from "@/ui/primitives/sonner";

import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import React from "react";
import { fetchServerData } from "@/lib/fetch-utils";
import { MiningPlanFull, MiningPlanGpu } from "@/types/mining-plans";
import { getAllMiningPlans } from "@/actions/mining-plans/get-all-mining-plans";
import { GPUPlansClient } from "@/ui/components/gpu-plans/gpu-plans.client";
import { GPUPlansProvider } from "@/providers/gpu-plans-provider";
import { getAllGpus } from "@/actions/mining-plans/get-all-gpus";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import CookieConsentController from "@/ui/components/cookie-consent-controller"
// ================================
// 🎨 Font Configuration
// ================================
const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
});

// ================================
// 🌐 Metadata
// ================================
export const metadata: Metadata = {
  title: SEO_CONFIG.seo.title,
  description: SEO_CONFIG.seo.description,
  keywords: SEO_CONFIG.seo.keywords.join(", "),
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.authorUrl }],
  creator: SEO_CONFIG.author.name,
  openGraph: {
    title: SEO_CONFIG.seo.title,
    description: SEO_CONFIG.seo.description,
    url: SEO_CONFIG.seo.baseUrl,
    siteName: SEO_CONFIG.seo.siteName,
    images: [
      {
        url: SEO_CONFIG.seo.ogImage,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.fullName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.seo.title,
    description: SEO_CONFIG.seo.description,
    site: SEO_CONFIG.seo.twitterSite,
    creator: SEO_CONFIG.seo.twitterCreator,
    images: [SEO_CONFIG.seo.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
};

// ================================
// 🌟 Root Layout with Error Handling
// ================================
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { data: miningPlans, message: errorMessage } = await fetchServerData<
      MiningPlanFull[]
    >(() => getAllMiningPlans(), "get-all-mining-plans");
    const { data: gpus, message: errorMessageGpus } = await fetchServerData<
      MiningPlanGpu[]
    >(() => getAllGpus(), "get-all-gpus");

    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "font-lato",
            "bg-background text-foreground antialiased overscroll-none",
            latoFont.variable
          )}
        >
          <NuqsAdapter>
            <Providers>
              <GPUPlansProvider plans={miningPlans ?? []} gpus={gpus ?? []}>
                <GPUPlansClient />

                {children}
                    {/* ✅ Global Cookie Consent Banner */}
        <CookieConsentController
          description="We use cookies to personalize content, analyze traffic, and enhance your browsing experience."
          learnMoreHref="/privacy-policy"
 
        />
                <Toaster />
              </GPUPlansProvider>
            </Providers>
          </NuqsAdapter>
        </body>
      </html>
    );
  } catch (error) {
    console.error("❌ RootLayout error:", error);

    // Fallback UI in case of error
    return (
      <html lang="en">
        <body className="flex min-h-screen items-center justify-center bg-red-100 text-red-600">
          <div className={"h-svh w-full"}>
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
              <span className="font-medium">
                Oops! Something went wrong {`:')`}
              </span>
              <p className="text-center text-muted-foreground">
                We apologize for the inconvenience. <br /> Please try again
                later.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
