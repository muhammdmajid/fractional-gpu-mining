import { SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";

import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message";
import InvestmentDashboard from "./page.client";

import { Investment } from "@/types/mining-plans";
import { getAllInvestments } from "@/actions/mining-plans/get-all-investments";

// ✅ Correct way to export metadata
export const metadata: Metadata = {
  title: `Investment Plan - GPU Based Cryptocurrency Mining | ${SEO_CONFIG.name}`,
  description:
    "Explore our GPU-based cryptocurrency mining investment plans. Invest securely, monitor your mining performance, and manage your wallet with ease.",
  robots: "index, follow",
  openGraph: {
    title: `Investment Plan - GPU Based Cryptocurrency Mining | ${SEO_CONFIG.name}`,
    description:
      "Explore our GPU-based cryptocurrency mining investment plans. Invest securely, monitor your mining performance, and manage your wallet with ease.",
    url: SEO_CONFIG.seo.baseUrl + "/finance/mining-plans",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Investment Plan - GPU Based Cryptocurrency Mining | ${SEO_CONFIG.name}`,
    description:
      "Explore our GPU-based cryptocurrency mining investment plans. Invest securely, monitor your mining performance, and manage your wallet with ease.",
  },
};

// ✅ Move viewport into its own export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function InvestmentPlanPage() {

  // ✅ Fetch investments scoped to the user
  const { data: investments, message: investmentsError } =
    await fetchServerData<Investment[]>(
      () => getAllInvestments(),
      "get-all-investments"
    );

  return (
    <>
      {investmentsError ? (
        <ErrorMessage error={investmentsError} className="my-3" />
      ) : (
        <InvestmentDashboard investments={investments??[]}  />
      )}
    </>
  );
}
