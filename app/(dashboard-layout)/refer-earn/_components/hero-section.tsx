"use client";

import { Button } from "@/ui/primitives/button";
import { Trophy, Copy, Check } from "lucide-react";

interface HeroSectionProps {
  referralLink: string;
  copied: boolean;
  setCopied: (val: boolean) => void;
  onLeaderboardClick: () => void;
}

export default function HeroSection({
  referralLink,
  copied,
  setCopied,
  onLeaderboardClick,
}: HeroSectionProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy referral link:", err);
    }
  };

  return (
    <section
      className=" p-10  text-center
      "
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-[#facc15] via-[#fcd34d] to-[#fde68a]
                     dark:from-[#facc15] dark:via-[#fcd34d] dark:to-[#fde68a]">
        Earn Rewards for Referring Friends
      </h1>
      <p className="max-w-2xl mx-auto text-lg mb-6
                    text-[#1d1d1d]/90 dark:text-[#fff8dc]/90">
        Invite your friends and family to join our platform and earn rewards
        for every successful referral.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          size="lg"
          onClick={handleCopy}
          className="
            bg-[#facc15] text-[#1a1200] hover:bg-[#fcd34d]
            dark:bg-[#facc15] dark:text-[#1a1200] dark:hover:bg-[#fde68a]
            transition-all duration-300
          "
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onLeaderboardClick}
          className="
            bg-[#facc15] text-[#1a1200] hover:bg-[#fcd34d]
            dark:bg-[#facc15] dark:text-[#1a1200] dark:hover:bg-[#fde68a]
            transition-all duration-300
          "
        >
          <Trophy className="w-4 h-4 mr-2" /> View Leaderboard
        </Button>
      </div>
    </section>
  );
}
