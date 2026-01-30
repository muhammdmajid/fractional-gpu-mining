"use client";

import React, { useState, useMemo } from "react";
import HomePricingHeader from "./home-pricing-header";
import PricingSwitch from "./pricing-switch";
import PricingCard from "./pricing-card";
import { MiningPlanFull, MiningPlanOptionWithGpus, PlanOptionType } from "@/types/mining-plans";

interface PricingMainProps {
  miningPlans: MiningPlanFull[];
}

export default function MiningPlans({ miningPlans }: PricingMainProps) {
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<PlanOptionType>("monthly");

  // Toggle billing cycle
  const togglePricingPeriod = (value: PlanOptionType) => {
    try {
      setBillingCycle(value);
      setError(null);
    } catch (err) {
      console.error("Pricing period switch error:", err);
      setError("Failed to switch pricing period.");
    }
  };

const plansToShow: MiningPlanFull[] = useMemo(() => {
  if (!miningPlans || miningPlans.length === 0) return [];

  try {
    return miningPlans
      .map((plan) => {
        // Find the option matching the billing cycle
        const option: MiningPlanOptionWithGpus | undefined = plan.options?.find(
          (opt) => opt.type === billingCycle
        );

        if (!option) return null; // skip if no matching option
        // Return a new object combining the plan with the matched option
        return { ...plan, option };
      })
      .filter((p): p is MiningPlanFull & { option: MiningPlanOptionWithGpus } => p !== null); 
      // type guard ensures p is not null and includes 'option'
  } catch (err) {
    console.error("Error processing plans:", err);
    setError("Failed to load pricing plans.");
    return [];
  }
}, [miningPlans, billingCycle]);

  return (
    <div>
  <HomePricingHeader
  title="Our GPU Fraction Plans"
  subtitle="Select the GPU fraction that best fits your needs"
/>


      <PricingSwitch onSwitch={togglePricingPeriod} defaultValue={billingCycle} />

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
<div className="container">
<section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 justify-items-center items-center">

        {plansToShow.length > 0 ? (
          plansToShow.sort((a, b) => a.priority - b.priority).map(plan => (
            <PricingCard key={plan.id} miningPlan={plan} defaultOptionType={billingCycle} />
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">
            No plans available for the selected billing cycle.
          </p>
        )}
      </section></div>
    </div>
  );
}
