"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Users, Gift, ArrowRightLeft } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Button } from "@/ui/primitives/button";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

interface SummaryCardsProps {
  totalReferrals: number;
  totalRewards: number;
  currency?: string;
}

export default function SummaryCards({
  totalReferrals = 0,
  totalRewards = 0,
  currency = "USDT",
}: SummaryCardsProps) {
  let currentDate: string;

  // Error handling for date
  try {
    const date = dayjs.utc().local();
    if (!date.isValid()) throw new Error("Invalid date");
    currentDate = date.format("DD MMM YYYY");
  } catch (error) {
    console.error("Error formatting date:", error);
    currentDate = "N/A";
  }

  return (
  <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-2 lg:space-y-3">
<CardHeader className="flex items-center justify-between">
  <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a1200] dark:text-[#fff8dc]">
    Referral Summary ({currentDate})
  </CardTitle>

  <Button
    onClick={() => {}}
    className="flex items-center gap-2 px-3 py-2 rounded-md shadow-sm bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 dark:from-blue-500 dark:to-indigo-400 dark:text-gray-900 dark:hover:from-blue-600 dark:hover:to-indigo-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    <ArrowRightLeft className="h-5 w-5" />
    Transfer Profit
  </Button>
</CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Total Referrals */}
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#fef3c7]/40 dark:bg-[#3c2e0a]/50 border border-[#facc15]/50 shadow-sm sm:shadow-md flex flex-col justify-between">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#facc15] dark:text-[#fde68a]" />
            <div>
              <p className="text-sm sm:text-base font-medium text-[#1d1d1d]/80 dark:text-[#fff8dc]/80">
                Total Referrals
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#facc15] dark:text-[#fde68a]">
                {totalReferrals}
              </p>
            </div>
          </div>
        </div>

        {/* Total Rewards */}
        <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#fff4e6]/40 dark:bg-[#3c2e0a]/50 border border-[#facc15]/50 shadow-sm sm:shadow-md flex flex-col justify-between">
          <div className="flex items-center space-x-4">
            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-[#facc15] dark:text-[#fde68a]" />
            <div>
              <p className="text-sm sm:text-base font-medium text-[#1d1d1d]/80 dark:text-[#fff8dc]/80">
                Total Rewards
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#facc15] dark:text-[#fde68a]">
                {totalRewards}{" "}
                <span className="text-sm sm:text-base md:text-lg font-medium text-[#1a1200] dark:text-[#fff8dc]">
                  {currency}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
