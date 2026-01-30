"use client";

import { useState } from "react";
import { useUpdateEffect, useMedia } from "react-use";
import { ReferralMonthlyStat } from "@/types/referrals";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/ui/primitives/tooltip";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { TooltipArrow } from "@radix-ui/react-tooltip";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

interface MonthlyOverviewChartProps {
  monthlyData?: ReferralMonthlyStat[] | null;
}

export default function MonthlyOverviewChart({ monthlyData }: MonthlyOverviewChartProps) {
  const [recentData, setRecentData] = useState<ReferralMonthlyStat[]>([]);

  const isMobile = useMedia("(max-width: 640px)");
  const isTablet = useMedia("(min-width: 641px) and (max-width: 1024px)");

  useUpdateEffect(() => {
    if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
      setRecentData([]);
      return;
    }

    const validData = monthlyData.filter(
      (item): item is ReferralMonthlyStat =>
        item &&
        typeof item.month === "string" &&
        !isNaN(new Date(item.month).getTime()) &&
        typeof item.referrals === "number" &&
        !isNaN(item.referrals) &&
        typeof item.rewardAmount === "number" &&
        !isNaN(item.rewardAmount)
    );

    if (validData.length === 0) {
      setRecentData([]);
      return;
    }

    const last7Months = validData
      .sort((a, b) => dayjs.utc(a.month).valueOf() - dayjs.utc(b.month).valueOf())
      .slice(-7)
      .map((d) => ({
        ...d,
        month: dayjs.utc(d.month).local().format("MMM YY"),
      }));

    setRecentData(last7Months);
  }, [monthlyData]);

  const maxReferrals = recentData.length > 0 ? Math.max(...recentData.map((d) => d.referrals)) : 0;
  const maxRewards = recentData.length > 0 ? Math.max(...recentData.map((d) => d.rewardAmount)) : 0;

  if (recentData.length === 0) {
    return (
      <div className=" p-4 sm:p-6 md:p-8  ">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a1200] dark:text-[#fff8dc]">
            Monthly Overview (Referrals & Rewards)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 sm:h-72 md:h-80 text-[#1d1d1d]/80 dark:text-[#fff8dc]/80">
          No valid monthly data available.
        </CardContent>
      </div>
    );
  }

  const chartHeight = isMobile ? 250 : isTablet ? 300 : 350;
  const xAxisFontSize = isMobile ? 10 : isTablet ? 12 : 14;
  const yAxisFontSize = isMobile ? 10 : isTablet ? 12 : 14;
  const labelFontSize = isMobile ? 9 : isTablet ? 11 : 12;
  const barSize = isMobile ? 15 : isTablet ? 20 : 24;
  const xAxisAngle = isMobile ? -45 : isTablet ? -30 : -20;
  const yAxisOffset = isMobile ? 30 : isTablet ? 20 : 10;

  return (
    <div className="relative z-50 w-full">
      <div className=" p-4 sm:p-6 md:p-8  ">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle
            className={`font-semibold text-[#1a1200] dark:text-[#fff8dc] ${
              isMobile ? "text-base" : isTablet ? "text-lg" : "text-xl"
            }`}
          >
            Monthly Overview (Referrals & Rewards)
          </CardTitle>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-1 cursor-help text-[#1a1200] dark:text-[#fff8dc] font-medium ${
                  isMobile ? "text-xs" : isTablet ? "text-sm" : "text-base"
                }`}
              >
                Rewards
                <ArrowUp
                  className={`${
                    isMobile ? "w-4 h-4" : isTablet ? "w-5 h-5" : "w-6 h-6"
                  } text-[#facc15] dark:text-[#fde68a]`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={6}
              className="bg-[#1a1200] dark:bg-[#fff8dc] text-[#fff8dc] dark:text-[#1a1200] p-1 sm:p-2 rounded-md text-xs sm:text-sm md:text-base shadow-lg z-50"
            >
              USDT
              <TooltipArrow className="fill-current text-[#1a1200] dark:text-[#fff8dc]" />
            </TooltipContent>
          </Tooltip>
        </CardHeader>

        <CardContent className={`relative px-0 sm:px-2 md:px-4`} style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentData} margin={{ top: 20, right: 20, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-[#facc15]/20 dark:stroke-[#fde68a]/20" />
              <XAxis
                dataKey="month"
                stroke="#1a1200"
                tick={{ fontSize: xAxisFontSize, fill: "#1a1200" }}
                interval={0}
                angle={xAxisAngle}
                textAnchor="end"
                height={isMobile ? 60 : 50}
                tickLine={false}
              />
              <YAxis
                stroke="#1a1200"
                width={70}
                tick={{ fontSize: yAxisFontSize, fill: "#1a1200" }}
                label={{
                  value: "Referrals / Rewards",
                  angle: -90,
                  position: "insideLeft",
                  offset: yAxisOffset,
                  style: { textAnchor: "middle", fontSize: yAxisFontSize, fill: "#1a1200" },
                }}
              />
              <RechartsTooltip
                cursor={{ fill: "rgba(250,200,60,0.1)" }}
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "#fffaf0",
                  color: "#1a1200",
                  padding: "6px 10px",
                  fontSize: isMobile ? 10 : isTablet ? 12 : 14,
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: isMobile ? 10 : isTablet ? 12 : 14,
                  paddingBottom: 4,
                  color: "#1a1200",
                }}
                iconSize={12}
              />
              <Bar dataKey="referrals" fill="#facc15" radius={[4, 4, 0, 0]} barSize={barSize} name="Referrals">
                <LabelList
                  dataKey="referrals"
                  position="top"
                  style={{ fontSize: labelFontSize, fill: "#1a1200", fontWeight: "bold" }}
                  formatter={(value) => (value === maxReferrals ? `${value}` : value)}
                />
              </Bar>
              <Bar dataKey="rewardAmount" fill="#fde68a" radius={[4, 4, 0, 0]} barSize={barSize} name="Rewards ($)">
                <LabelList
                  dataKey="rewardAmount"
                  position="top"
                  style={{ fontSize: labelFontSize, fill: "#1a1200", fontWeight: "bold" }}
                  formatter={(value) => (value === maxRewards ? `${value}` : value)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </div>
    </div>
  );
}
