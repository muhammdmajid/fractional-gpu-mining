"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/ui/primitives/card";
import { motion } from "framer-motion";
import { MiningPlanFull, } from "@/types/mining-plans";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import PricingCardHeader from "./pricing-card-header";
import PricingCardContent from "./pricing-card-content";
import PricingCardFooter from "./pricing-card-footer";

const MotionCard = motion.create(Card);

interface PricingCardProps {
  miningPlan: MiningPlanFull;
  defaultOptionType?: "monthly" | "yearly";
  isCart?: boolean;
}


const PricingCard: React.FC<PricingCardProps> = ({
  miningPlan,
  defaultOptionType = "monthly",
  isCart = false,
}) => {
  const { selectedPlan } = useGPUPlans();
  // ✅ Select the option based on default type
  const option = useMemo(() => {
    return miningPlan?.options?.find((o) => o.type === defaultOptionType);
  }, [miningPlan?.options, defaultOptionType]);

  const isSelected = useMemo(() => {
    return selectedPlan?.id === miningPlan.id;
  }, [selectedPlan, miningPlan.id]);

  if (!option) {
    console.error(`PricingCard: Missing option for plan "${miningPlan.title}"`);
    return null;
  }

  return (
<MotionCard
  key={miningPlan.id}
  className={cn(
    "w-full cursor-pointer relative flex flex-col justify-between rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl",
    "light:bg-gradient-to-br light:from-white light:via-gray-50 light:to-white light:text-gray-900",
    "dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100",
    miningPlan.popular && "ring-2 ring-indigo-500",
    isCart &&
      (selectedPlan
        ? isSelected
          ? "border-2 border-blue-500 shadow-lg dark:border-blue-400 dark:shadow-xl"
          : "border border-gray-300 shadow-sm opacity-50 pointer-events-none"
        : ""),
   
  )}
  whileHover={{ y: isCart ? 0 : -6 }}
>

      <PricingCardHeader miningPlan={miningPlan} option={option}     />

      <PricingCardContent
        miningPlan={miningPlan}
        option={option}
      />
      <PricingCardFooter
        miningPlan={miningPlan}
     
        isCart={isCart}
    
      />
    </MotionCard>
  );
};

export default PricingCard;
