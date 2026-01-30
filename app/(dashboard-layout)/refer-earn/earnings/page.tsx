import type { Metadata, Viewport } from "next";

import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message";
import { SEO_CONFIG } from "@/config/index";
import { getReferralStatsForUser } from "@/actions/referral/get-referral-stats";
import ReferEarnClientDashboard from "./page.client";
import { ReferralData } from "@/types/referrals";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Refer & Earn - GPU Based Cryptocurrency Mining`,
  description:
    "Invite your friends to join GPU-based cryptocurrency mining and earn exciting rewards. Start referring and boost your earnings today.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Refer & Earn - GPU Based Cryptocurrency Mining`,
    description:
      "Invite your friends to join GPU-based cryptocurrency mining and earn exciting rewards. Start referring and boost your earnings today.",
    url: `${SEO_CONFIG.seo.baseUrl}/finance/refer-earn`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Refer & Earn - GPU Based Cryptocurrency Mining`,
    description:
      "Invite your friends to join GPU-based cryptocurrency mining and earn exciting rewards. Start referring and boost your earnings today.",
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
export default async function ReferEarnPage() {
  try {
    // 🔹 Fetch referral stats (replace with real userId/auth)
    const { data: referralStats, message: referralError } =
      await fetchServerData<ReferralData>(
        () => getReferralStatsForUser(),
        "get-referral-stats"
      );

    // Handle server-side fetch errors
    if (referralError) {
      console.error("Referral stats fetch error:", referralError);
      return <ErrorMessage error={referralError} className="my-6" />;
    }

    // Handle null or undefined referral data
    if (!referralStats) {
      console.warn("Referral data is empty or undefined.");
      return <ErrorMessage error="No referral data available." className="my-6" />;
    }

    // ✅ Render client dashboard with fetched referral data
    return <ReferEarnClientDashboard referralData={referralStats} />;
  } catch (err) {
    // Catch unexpected runtime errors during server-side rendering
    const errorMsg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while fetching referral stats.";
    console.error("Unexpected error in ReferEarnPage:", err);
    return <ErrorMessage error={errorMsg} className="my-6" />;
  }
}
