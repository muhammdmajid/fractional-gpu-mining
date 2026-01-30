 
 
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Investment } from "@/types/mining-plans";
import AllPlans, { statusConfig } from "./_components/all-plans";
import { GPUMiningPlanClient } from "@/app/(plain-layout)/mining-plans/page.client";
import { FilterableList } from "../_components/filterable-list";
import InvestmentListRow from "./_components/investment-list-row";
import { Table, TableHeader, TableRow, TableHead } from "@/ui/primitives/table";
import { Plus } from "lucide-react";
import { Button } from "@/ui/primitives/button";

interface InvestmentDashboardProps {
  investments: Investment[];
  isOverview?: boolean;
}

export default function InvestmentDashboard({
  investments,
  isOverview = false,
}: InvestmentDashboardProps) {
  const [currentInvestmentPlan, setCurrentInvestmentPlan] =
    useState<Investment | null>(investments?.[0] ?? null);
  const [isNewPlan, setNewPlan] = useState(false);

  if (!investments || investments.length === 0) {
    return !isOverview ? <GPUMiningPlanClient isDashboard={true} /> : null;
  }

  const handleAddNewPlan = () => {
    setNewPlan((prev) => !prev); // toggle state
  };

  return (
    <div className="p-6 space-y-6 w-full relative">
      {/* 🔹 Floating Button */}
      {!isOverview ? (
        <div className="flex">
          <Button
            variant="default"
            size="icon"
            onClick={handleAddNewPlan}
            className="ml-auto rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      ) : null}

      {/* 🔹 Animate toggle content */}
      <AnimatePresence mode="wait">
        {!isNewPlan && (
          <motion.div
            key="investment-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {!isOverview && (
              <AllPlans
                investments={investments}
                currentInvestmentPlan={currentInvestmentPlan}
                setCurrentInvestmentPlan={setCurrentInvestmentPlan}
              />
            )}

            <FilterableList
              data={investments}
              statusConfig={statusConfig}
              getStatus={(inv) => inv.status}
              header={
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-muted-foreground text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide">
                        <TableHead className="px-3 sm:px-4 md:px-6">
                          Plan
                        </TableHead>
                        <TableHead className="px-3 sm:px-4 md:px-6">
                          Deposit
                        </TableHead>
                        <TableHead className="px-3 sm:px-4 md:px-6">
                          Cycle
                        </TableHead>
                        <TableHead className="px-3 sm:px-4 md:px-6">
                          Start Date
                        </TableHead>
                        <TableHead className="px-3 sm:px-4 md:px-6">
                          End Date
                        </TableHead>
                        <TableHead className="hidden lg:table-cell px-3 sm:px-4 md:px-6">
                          Status
                        </TableHead>
                        <TableHead className="px-3 sm:px-4 md:px-6 text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
              }
              renderRow={(inv) => (
                <InvestmentListRow
                  key={inv.id}
                  investment={inv}
                  currentInvestmentPlan={currentInvestmentPlan}
                  setCurrentInvestmentPlan={setCurrentInvestmentPlan}
                />
              )}
              emptyMessage="No investments found for this status."
            />
          </motion.div>
        )}

        {isNewPlan && (
          <motion.div
            key="new-plan"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <GPUMiningPlanClient isDashboard={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
