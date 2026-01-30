import { CardContent } from "@/ui/primitives/card";
import CheckItem from "./check-Item";
import { MiningPlanFull, MiningPlanOptionWithGpus } from "@/types/mining-plans";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContentProps {
  miningPlan: MiningPlanFull;
  option: MiningPlanOptionWithGpus;
}

export default function PricingCardContent({
  miningPlan,
  option,
}: ContentProps) {
  const [expanded, setExpanded] = useState(false);
  const formatLockPeriod = (days?: number) => {
    if (!days || days <= 0) return "None";
    return `Mining cycle  ${miningPlan.custom ? "Custom" : days} month${days > 1 ? "s" : ""} `;
  };
  return (
    <div className="relative">
      <CardContent
        className={cn(
          "flex flex-col gap-3 pt-2 pb-4 border-t light:border-gray-200 dark:border-gray-800 transition-all duration-300",
          expanded ? "h-auto" : "h-[230px] overflow-hidden"
        )}
      >
        {option.miningCycle > 0 && (
          <CheckItem text={` ${formatLockPeriod(option.miningCycle)}`} />
        )}

        <CheckItem
          text={`  Your ${option.totalPrice} recovered within the ${option.type === "monthly" ? "month" : "year"}`}
        />
        {/* <CheckItem key={index} text={feature} /> */}
        {Array.isArray(miningPlan.features) &&
        miningPlan.features.length > 0 ? (
          miningPlan.features.map((feature: string, index: number) => (
            <CheckItem key={index} text={feature} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No features listed.</p>
        )}
        {option &&
        Array.isArray(option?.features) &&
        option?.features.length > 0 ? (
          option?.features.map((feature: string, index: number) => (
            <CheckItem key={index} text={feature} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No features listed.</p>
        )}
        {option?.gpus && option?.gpus?.length > 0 && (
          <CheckItem
            text={`${miningPlan.custom ? "Custom" : option.gpus.length} GPU${option.gpus.length === 1 ? "" : "s"}`}
          />
        )}
        {option?.gpus && option.gpus.length > 0 && (
          <div className="mt-4">
            <h4
              className={cn(
                "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-start"
              )}
            >
              GPU Specifications:
            </h4>
            <ul className="space-y-1">
              {!miningPlan.custom ? (
                option.gpus.map((gpu) => (
                  <li
                    key={gpu.id}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                  >
                    <CheckItem
                      text={`${gpu.model} • ${gpu.memory} • ${gpu.hashRate} `}
                    />
                  </li>
                ))
              ) : (
                <>
                  {" "}
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckItem
                      text={`Multiple GPUs optimize performance and cost.`}
                    />
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckItem
                      text={`Customize GPU model, memory, hash rate, power.`}
                    />
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>

      <div
        onClick={() => setExpanded(!expanded)}
        className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/90 dark:from-gray-900/90 to-transparent flex items-end justify-center pb-2 cursor-pointer"
      >
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 animate-bounce" />
        )}
      </div>
    </div>
  );
}
