import { SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";
import MiningDashboard from "./page.client";
import { MiningStatusStream } from "@/types/fractional-mining-profit";
import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message";
import getMiningStatus from "@/actions/mining-plans/get-mining-status";

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: `Mining Stats | ${SEO_CONFIG.name}`,
  description:
    "View detailed mining statistics including GPU performance and hash rates.",
  robots: "index, follow",
  openGraph: {
    title: `Mining Stats | ${SEO_CONFIG.name}`,
    description:
      "View detailed mining statistics including GPU performance and hash rates.",
    url: SEO_CONFIG.seo.baseUrl + "/dashboards/mining-stats",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Mining Stats | ${SEO_CONFIG.name}`,
    description:
      "View detailed mining statistics including GPU performance and hash rates.",
  },
};

// ✅ Viewport must be separate
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function MiningStatsPage() {
  const { data: miningStatus, message: miningError } =
    await fetchServerData<MiningStatusStream[]>(
      () => getMiningStatus(),
      "get-mining-status"
    );
  

  return (
    <>
      {miningError ? (
        <ErrorMessage error={miningError} className="my-3" />
      ) : (
        <MiningDashboard miningStatus={miningStatus}  />
      )}
    </>
  );
}
