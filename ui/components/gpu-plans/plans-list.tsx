import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/ui/primitives/button";
import { cn } from "@/lib/utils";
import { MiningPlanFull } from "@/types/mining-plans";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import PricingCard from "../pricing/pricing-card";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import Link from "next/link";
import { ArrowLeft,  } from "lucide-react";

interface PlansListProps {
  miningPlans: MiningPlanFull[];
}

export function PlansList({ miningPlans }: PlansListProps) {
  const { selectedPlan, clearGPUPlans } = useGPUPlans();
  const isMobile = useIsMobile();
  return (
    <>
      {/* Reset Button - Top Left */}
      {selectedPlan ? (
        <div className={cn("px-10", isMobile ? "py-3" : "")}>
          <Button
            size="sm"
            variant="outline"
            onClick={clearGPUPlans}
            className="rounded-sm w-full px-3 py-1 text-xs font-medium shadow-md hover:shadow-lg transition-all dark:bg-gray-800 dark:border-gray-700"
          >
            Reset Plan
          </Button>
        </div>
      ) : null}
      {/* Plans List */}
      <div className="relative  flex-1 overflow-y-auto px-6 py-4  w-full ">
        <AnimatePresence>
          {miningPlans
            .sort((a, b) => a.priority - b.priority)
            .map((plan) => {
              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "group relative mb-4",
                    selectedPlan?.id === plan.id && "border-primary"
                  )}
                >
                  <PricingCard miningPlan={plan} isCart={true} />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {selectedPlan && selectedPlan.id ? (
        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold capitalize">
              Selected: {selectedPlan.title} ({selectedPlan.selectedOption.type}
              )
            </span>
            <Button size="sm" asChild>
              <Link href="/mining-plans" target="_blank" rel="noopener noreferrer">
                Continue
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4">
          <div className="flex items-center justify-center">
            <Link href="/mining-plans">
              <Button className="group h-12 px-8" size="lg" variant="outline">
                <ArrowLeft
                  className={`
                      mr-2 h-4 w-4 transition-transform duration-300
                      group-hover:translate-x-1
                    `}
                />
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
