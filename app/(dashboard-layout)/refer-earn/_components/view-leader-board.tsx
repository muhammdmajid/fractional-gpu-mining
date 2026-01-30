"use client";

import React from "react";
import { Trophy, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/primitives/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table";
import { ReferralWithUsers } from "@/types/referrals";

export interface ViewLeaderboardProps {
  referrals: ReferralWithUsers[];
}

export default function ViewLeaderboard({ referrals }: ViewLeaderboardProps) {
  const referralStats = referrals.reduce((acc, r) => {
    const referrerId = r.referrerId;
    if (!acc[referrerId]) {
      acc[referrerId] = {
        referrerId,
        name:
          r.referee?.name ||
          `${r.referee?.firstName ?? ""} ${r.referee?.lastName ?? ""}`.trim() ||
          "Unknown User",
        referrals: 0,
        rewards: 0,
      };
    }
    acc[referrerId].referrals += 1;
    acc[referrerId].rewards += Number(r.rewardAmount ?? 0);
    return acc;
  }, {} as Record<string, { referrerId: string; name: string; referrals: number; rewards: number }>);

  const leaderboard = Object.values(referralStats)
    .sort((a, b) => b.referrals - a.referrals || b.rewards - a.rewards)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#facc15] dark:from-[#1a1200] dark:via-[#3b2f00] dark:to-[#6b4f00] rounded-2xl p-6 sm:p-10 md:p-12 text-center shadow-lg">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1200] dark:text-[#fff8dc] mb-3 sm:mb-4 md:mb-6 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#d4af37]" /> Leaderboard
        </h1>
        <p className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-[#1a1200]/90 dark:text-[#fff8dc]/90 leading-relaxed">
          See the top users who referred the most friends and earned rewards!
        </p>
      </section>

      {/* Leaderboard Table - Desktop */}
      <Card className="rounded-2xl shadow-lg bg-[#fffaf0] dark:bg-[#1f1b0b] hidden sm:block border border-[#facc15]/40">
        <CardHeader className="px-4 sm:px-6 md:px-8 py-2 sm:py-4">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a1200] dark:text-[#fff8dc]">
            Top Referrers
          </CardTitle>
        </CardHeader>

        <CardContent className="p-2 sm:p-4 md:p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-[#fef3c7] dark:bg-[#3b2f00]">
                <TableHead className="text-[#1a1200] dark:text-[#fff8dc]">Rank</TableHead>
                <TableHead className="text-[#1a1200] dark:text-[#fff8dc]">Icon</TableHead>
                <TableHead className="text-[#1a1200] dark:text-[#fff8dc]">Name</TableHead>
                <TableHead className="text-right text-[#1a1200] dark:text-[#fff8dc]">Referrals</TableHead>
                <TableHead className="text-right text-[#1a1200] dark:text-[#fff8dc]">Rewards</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow
                  key={entry.referrerId}
                  className="hover:bg-[#fde68a]/20 dark:hover:bg-[#6b4f00]/40"
                >
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate font-bold text-[#d4af37]">{`#${entry.rank}`}</span>
                      </TooltipTrigger>
                      <TooltipContent>{`#${entry.rank}`}</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell className="text-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#facc15] dark:text-[#fde68a] mx-auto" />
                  </TableCell>

                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate font-medium max-w-[250px] text-[#1a1200] dark:text-[#fff8dc]">{entry.name}</span>
                      </TooltipTrigger>
                      <TooltipContent>{entry.name}</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell className="text-right font-semibold text-[#d4af37] dark:text-[#fde68a]">
                    {entry.referrals}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-[#d4af37] dark:text-[#fde68a]">
                    ${entry.rewards}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Grid */}
      <div className="flex flex-col sm:hidden space-y-4">
        {leaderboard.map((entry) => (
          <div
            key={entry.referrerId}
            className="border border-[#facc15]/40 dark:border-[#fde68a]/40 rounded-lg p-3 space-y-2 bg-[#fffaf0] dark:bg-[#1f1b0b]"
          >
            <div className="flex justify-between items-center text-[#1a1200] dark:text-[#fff8dc]">
              <span className="font-medium">Rank:</span>
              <span className="font-bold text-[#d4af37] dark:text-[#fde68a]">{`#${entry.rank}`}</span>
            </div>

            <div className="flex justify-between items-center text-[#1a1200] dark:text-[#fff8dc]">
              <span className="font-medium">Icon:</span>
              <Users className="w-5 h-5 text-[#facc15] dark:text-[#fde68a]" />
            </div>

            <div className="flex justify-between items-center text-[#1a1200] dark:text-[#fff8dc]">
              <span className="font-medium">Name:</span>
              <span className="font-medium truncate max-w-[65%] text-right">{entry.name}</span>
            </div>

            <div className="flex justify-between items-center text-[#1a1200] dark:text-[#fff8dc]">
              <span className="font-medium">Referrals:</span>
              <span className="font-semibold text-[#d4af37] dark:text-[#fde68a]">{entry.referrals}</span>
            </div>

            <div className="flex justify-between items-center text-[#1a1200] dark:text-[#fff8dc]">
              <span className="font-medium">Rewards:</span>
              <span className="font-semibold text-[#d4af37] dark:text-[#fde68a]">${entry.rewards}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
