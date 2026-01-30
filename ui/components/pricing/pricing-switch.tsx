"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui/primitives/tabs";
import { PlanOptionType } from "@/types/mining-plans";

type PricingSwitchProps = {
  onSwitch: (value: PlanOptionType) => void;
  defaultValue?: PlanOptionType; // "0" = Monthly, "1" = Yearly
};

const PricingSwitch: React.FC<PricingSwitchProps> = ({
  onSwitch,
  defaultValue = "monthly",
}) => {
  return (
    <Tabs
      defaultValue={defaultValue}
     onValueChange={(value) => onSwitch(value as PlanOptionType)}
      className="w-full max-w-xs mx-auto"
    >
      <TabsList
        className="
          flex w-full p-1 rounded-full 
          bg-muted dark:bg-muted/30 border border-border shadow-sm
        "
      >
        <TabsTrigger
          value="monthly"
          className="
            flex-1 text-sm py-2 text-center rounded-full transition
            data-[state=active]:bg-background data-[state=active]:text-foreground
            hover:bg-muted dark:hover:bg-muted/50
          "
        >
          Monthly
        </TabsTrigger>
        <TabsTrigger
          value= "yearly"
          className="
            flex-1 text-sm py-2 text-center rounded-full transition
            data-[state=active]:bg-background data-[state=active]:text-foreground
            hover:bg-muted dark:hover:bg-muted/50
          "
        >
          Yearly
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default PricingSwitch;
