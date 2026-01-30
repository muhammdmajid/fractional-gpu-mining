"use client";

import { FC } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

export const HowItWorksSection: FC = () => {
  const steps = [
    {
      title: "Share Your Referral Link",
      description:
        "Copy your unique referral link and share it with your friends and family.",
    },
    {
      title: "Your Friend Signs Up",
      description:
        "When your friend signs up using your referral link, you’ll both earn rewards.",
    },
    {
      title: "Earn Rewards",
      description:
        "Earn cash bonuses, platform credits, or other rewards for each successful referral.",
    },
  ];

  return (
    <section
      className="py-16 md:py-24
                 "
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-3xl font-bold md:text-4xl text-[#facc15] dark:text-[#facc15]">
              How the Refer & Earn Program Works
            </h2>
            <p className="mt-4 text-[#1d1d1d]/90 dark:text-[#fff8dc]/90">
              Our Refer & Earn program is designed to be simple and
              straightforward. Here&apos;s how it works:
            </p>
            <ul className="mt-6 space-y-6">
              {steps.map(({ title, description }) => (
                <li
                  key={title}
                  className="flex items-start gap-4 group hover:translate-x-1 transition-transform duration-300"
                >
                  <div className="p-1.5 rounded-full bg-[#facc15]/30 dark:bg-[#facc15]/50 shadow-inner">
                    <CheckIcon className="h-6 w-6 text-[#facc15] dark:text-[#fff8dc]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1200] dark:text-[#fff8dc]">
                      {title}
                    </h4>
                    <p className="text-[#1d1d1d]/80 dark:text-[#fff8dc]/70">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex items-center justify-center">
            <div
              className="rounded-2xl border-2 border-[#facc15]/50
                         shadow-[0_0_25px_rgba(250,200,60,0.3)]
                         overflow-hidden bg-[#fffaf0]/40 dark:bg-[#1f1b0b]/70
                         transition-all duration-500"
            >
              <Image
                src="/img/refer-earn.png"
                alt="Refer & Earn Illustration"
                width={500}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
