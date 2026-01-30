import type { Metadata, Viewport } from "next";

import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message";
import { SEO_CONFIG } from "@/config/index";
import ReferEarnClient from "./page.client";
import { getReferralCodeAndLink } from "@/actions/referral/get-referral-code-and-link";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Referrals - GPU Based Cryptocurrency Mining`,
  description:
    "Track your referrals and invite friends to join GPU-based cryptocurrency mining. Earn exciting rewards by referring others today.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Referrals - GPU Based Cryptocurrency Mining`,
    description:
      "Track your referrals and invite friends to join GPU-based cryptocurrency mining. Earn exciting rewards by referring others today.",
    url: `${SEO_CONFIG.seo.baseUrl}/finance/refer-earn`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Referrals - GPU Based Cryptocurrency Mining`,
    description:
      "Track your referrals and invite friends to join GPU-based cryptocurrency mining. Earn exciting rewards by referring others today.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * ReferEarnPage component - server-side rendering
 * Handles fetching referral program data and passes it to the client component
 */
export default async function ReferralsPage() {
  try {
    // Call server function through fetchServerData wrapper
    const { data: referralData, message: referralError } =
      await fetchServerData(() => getReferralCodeAndLink(), "get-referral-code");

    // Handle errors from server function
    if (referralError) {
      console.error("Referral fetch error:", referralError);
      return <ErrorMessage error={referralError} className="my-6" />;
    }

    // Handle missing data
    if (!referralData) {
      console.warn("Referral data is empty or undefined.");
      return <ErrorMessage error="No referral data available." className="my-6" />;
    }

    // Success: render client component with fetched data
    return <ReferEarnClient referralData={referralData} />;
  } catch (err) {
    // Catch unexpected errors during server-side rendering
    const errorMsg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while fetching referral data.";
    console.error("Unexpected error in ReferralsPage:", err);
    return <ErrorMessage error={errorMsg} className="my-6" />;
  }
}
