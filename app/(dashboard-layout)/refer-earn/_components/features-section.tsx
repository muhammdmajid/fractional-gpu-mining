"use client";

import { FC } from "react";
import { Card, CardHeader, CardContent } from "@/ui/primitives/card";
import { LinkIcon, AwardIcon, BadgeIcon } from "lucide-react";
import React from "react";

export const FeaturesSection: FC = () => {
  const features = [
    {
      icon: <LinkIcon />,
      title: "Refer a Friend",
      description:
        "Share your unique referral link with your friends and family to earn rewards.",
    },
    {
      icon: <AwardIcon />,
      title: "Earn Rewards",
      description:
        "Earn rewards for every successful referral, including cash bonuses and platform credits.",
    },
    {
      icon: <BadgeIcon />,
      title: "Leaderboard",
      description:
        "Check the leaderboard to see how you're doing and compete with your friends.",
    },
  ];

  return (
    <section className="py-10 md:py-15 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <Card
              key={title}
              className={`group rounded-2xl border border-[#facc15]/30
                bg-gradient-to-br from-[#fffaf0] to-[#fef3c7] 
                dark:from-[#1f1b0b] dark:to-[#3c2e0a]
                text-[#1a1200] dark:text-[#fff8dc]
                shadow-lg hover:shadow-[0_0_20px_rgba(250,200,60,0.4)]
                transition-all duration-500`}
            >
              <CardHeader className="flex flex-col items-start space-y-4">
                {/* Icon with golden stroke */}
                <div className="p-2 rounded-lg bg-transparent border border-transparent">
                  {React.cloneElement(icon, {
                    className: "h-12 w-12 stroke-[#facc15] dark:stroke-[#facc15]",
                  })}
                </div>
                <h3 className="text-xl font-semibold text-[#facc15] dark:text-[#facc15]">
                  {title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-[#1d1d1d] dark:text-[#fff8dc] leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
