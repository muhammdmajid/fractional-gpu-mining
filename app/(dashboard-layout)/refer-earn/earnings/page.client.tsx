"use client";

import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Trophy, Share2 } from "lucide-react";

import { GenericDialogDrawer } from "@/ui/components/generic-dialog-drawer";
import ViewLeaderboard from "../_components/view-leader-board";
import HeroSection from "../_components/hero-section";
import SummaryCards from "../_components/summary-cards";
import MonthlyOverviewChart from "../_components/monthly-overview-chart";
import { ReferralShareButton } from "../_components/referral-share-button";
import { ReferralData } from "@/types/referrals";
import { cn } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

interface ReferEarnClientDashboardProps {
  referralData?: ReferralData | null;
  isOverview?: boolean;
}

export default function ReferEarnClientDashboard({
  referralData,
  isOverview = false,
}: ReferEarnClientDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Destructure with safe defaults to avoid undefined errors
  const {
    monthlyData = [],
    totalReferrals = 0,
    totalRewards = 0,
    referralCode = "",
    referralLink = "",
    referrals = [],
  } = referralData || {};

  return (
    <>
<main
  className={cn(
    "w-full p-6 space-y-6",
    !isOverview &&
      "bg-gradient-to-br from-[#fffaf0] to-[#fef3c7] " +
      "dark:from-[#1f1b0b] dark:to-[#3c2e0a] " +
      "text-[#1a1200] dark:text-[#fff8dc] " +
      "transition-all duration-500"
  )}
>

        {!isOverview && (
          <>
            {/* Hero Section with Copy & Leaderboard */}
            <HeroSection
              referralLink={referralLink}
              copied={copied}
              setCopied={setCopied}
              onLeaderboardClick={() => setIsLeaderboardOpen((prev) => !prev)}
            />

            {/* Summary Cards */}
            <SummaryCards
              totalReferrals={totalReferrals}
              totalRewards={totalRewards}
            />

            {/* Monthly Stats Chart */}
            <MonthlyOverviewChart monthlyData={monthlyData} />
          </>
        )}

        {/* 🔗 Share Referral Link Section */}
        <div className=" p-2 sm:p-2 md:p-4 space-y-2 sm:space-y-2 lg:space-y-3">
          <h2 className="flex items-center capitalize gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Share your referral link
          </h2>
          <ReferralShareButton referralData={{ referralLink, referralCode }} />
        </div>


          {/* Leaderboard Drawer */}

        <GenericDialogDrawer
          title={
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Leaderboard
            </div>
          }
          open={isLeaderboardOpen}
          onOpenChange={setIsLeaderboardOpen}
          renderContent={() => (
            <div className="w-full">
              <ViewLeaderboard referrals={referrals} />
            </div>
          )}
        />

      </main>

    
    </>
  );
}
