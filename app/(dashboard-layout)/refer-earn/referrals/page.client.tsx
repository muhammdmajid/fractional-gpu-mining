"use client";

import { FC } from "react";
import { HeroSection } from "../_components/hero-section-2";
import { FeaturesSection } from "../_components/features-section";
import { HowItWorksSection } from "../_components/how-it-works-section";
import ErrorMessage from "@/ui/components/default/error-message";

interface ReferEarnClientProps {
  referralData?: { referralCode: string; referralLink: string } | null;
}

const ReferEarnClient: FC<ReferEarnClientProps> = ({ referralData }) => {
  // ------------------------------
  // Error handling: missing or invalid referral data
  // ------------------------------
  if (!referralData || !referralData.referralCode || !referralData.referralLink) {
    return (
      <ErrorMessage
        error="Referral data is missing or invalid. Please try again later."
        className="my-6"
      />
    );
  }

  return (
<main
  className="
    w-full p-6 space-y-6
  bg-gradient-to-br from-[#fffaf0] to-[#fef3c7]
                 dark:from-[#1f1b0b] dark:to-[#3c2e0a]
                 text-[#1a1200] dark:text-[#fff8dc]
              
                 transition-all duration-500
  "
>
  <HeroSection referralData={referralData} />
  <FeaturesSection />
  <HowItWorksSection />
</main>


  );
};

export default ReferEarnClient;
