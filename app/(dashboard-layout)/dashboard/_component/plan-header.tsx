"use client";

import { FC, useMemo } from "react";
import { PlanSelect } from "./plan-select";
import { Investment } from "@/types/mining-plans";

interface PlanHeaderProps {
  plans?: Investment[] | null; // array of plans or null/undefined
  selectedId?: string | null;
  onSelectPlan: (planId: string) => void;
}

/**
 * Header component showing the selected plan info and a plan selector dropdown
 */
const PlanHeader: FC<PlanHeaderProps> = ({
  plans,
  selectedId,
  onSelectPlan,
}) => {
  // Memoize selected plan to avoid recalculations
  const selectedPlan = useMemo(
    () => plans?.find((p) => p.id === selectedId) ?? null,
    [plans, selectedId]
  );

  const planInitial =
    selectedPlan?.planId?.[0]?.toUpperCase() ??
    selectedId?.[0]?.toUpperCase() ??
    "P";
  if (!selectedPlan) return null;

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Plan Info Card */}
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold">
          {planInitial}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {selectedPlan ? `${selectedPlan.plan?.title}` : "No Plan Selected"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {selectedId ?? "—"}
          </span>
        </div>
      </div>

      {/* Right: Plan Selector Dropdown */}
      <PlanSelect
        plans={plans}
        selectedId={selectedId ?? ""}
        onChange={onSelectPlan}
        className="w-full sm:w-auto"
      />
    </div>
  );
};

export default PlanHeader;
