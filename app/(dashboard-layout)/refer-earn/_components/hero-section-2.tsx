"use client";

import { FC } from "react";
import { ReferralShareButton } from "./referral-share-button";

interface HeroSectionProps {
  referralData: { referralCode: string; referralLink: string };
}

export const HeroSection: FC<HeroSectionProps> = ({ referralData }) => {
  return (
    <section
      className="
        py-20 md:py-32 w-full 
        transition-all duration-300
      "
    >
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
        <h1
          className="
            text-center text-3xl font-extrabold
            bg-clip-text text-transparent 
            bg-gradient-to-r from-[#facc15] via-[#fcd34d] to-[#fde68a]
            dark:from-[#facc15] dark:via-[#fcd34d] dark:to-[#fde68a]
            sm:text-4xl md:text-5xl lg:text-6xl
          "
        >
          Earn Rewards for Referring Friends
        </h1>

        <p
          className="
            max-w-xl text-center text-lg font-medium
            text-[#1d1d1d]/90 dark:text-[#fff8dc]/90
            md:text-xl
          "
        >
          Invite your friends and family to join our platform and earn exclusive
          bonuses for every successful referral.
        </p>

        {/* Referral Share Buttons with error handling */}
        <div>
          {referralData ? (
            <ReferralShareButton referralData={referralData} />
          ) : (
            <p className="text-[#b91c1c] dark:text-[#f87171] font-semibold">
              Referral data not available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
