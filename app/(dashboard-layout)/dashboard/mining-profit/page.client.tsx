"use client";

import { FC, useState, useEffect, useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { useMedia } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  MonthlyData,
  UserPlanFinancialReport,
} from "@/types/fractional-mining-profit";
import PlanHeader from "../_component/plan-header";
import MonthlyProfitList from "./_components/monthly-profit-list";
import StatsGrid from "./_components/stats-grid";
import ProfitChart from "./_components/profit-chart";
import {
  AccountInfo,
  FinancialAccountsBundle,
} from "@/types/user-wallet-account";
import { Button } from "@/ui/primitives/button";
import { GenericDialogDrawer } from "@/ui/components/generic-dialog-drawer";
import { CardHeader, CardTitle } from "@/ui/primitives/card";
import ProfitTransferCard from "./_components/profitT-transfer-card";
import { filterWithdrawable } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/primitives/tooltip";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProfitDashboardProps {
  plansReport: UserPlanFinancialReport | null;
  financialAccounts: FinancialAccountsBundle | null;
}

const ProfitDashboard: FC<ProfitDashboardProps> = ({
  plansReport,
  financialAccounts,
}) => {
  // Client-side state for financial accounts
  const [financialAccountsClient, setFinancialAccounts] =
    useState<FinancialAccountsBundle | null>(financialAccounts);
  const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(
    financialAccountsClient?.accounts?.[0] ?? null
  );

  // Accounts list derived from state
  const accountInfo: AccountInfo[] = useMemo(
    () => financialAccountsClient?.accounts ?? [],
    [financialAccountsClient]
  );
  // ✅ responsive breakpoints
  const isMobile = useMedia("(max-width: 640px)", false);
  const isTablet = useMedia(
    "(min-width: 641px) and (max-width: 1024px)",
    false
  );
  const isDesktop = useMedia("(min-width: 1025px)", true);

  let yAxisOffset = 12; // default mobile
  if (isMobile) yAxisOffset = 14;
  if (isTablet) yAxisOffset = 18;
  if (isDesktop) yAxisOffset = 22;

  const [profitTransferOpen, setProfitTransferOpen] = useState(false);
  const plans = useMemo(
    () => plansReport?.profitMonths ?? [],
    [plansReport?.profitMonths]
  );

  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans?.[0]?.planId ?? ""
  );

  const selectedPlanObj = useMemo(
    () => plans.find((p) => p.planId === selectedPlan),
    [plans, selectedPlan]
  );

  // ✅ Sanitize data
  const safeData: MonthlyData[] = useMemo(
    () => (selectedPlanObj?.allMonths ?? []).map((d) => ({ ...d })),
    [selectedPlanObj]
  );

  // ✅ Stats and currency
  const { currency, stats } = useMemo(() => {
    const totalProfit =
      typeof selectedPlanObj?.totalProfit === "number" &&
      !isNaN(selectedPlanObj.totalProfit)
        ? selectedPlanObj.totalProfit
        : 0;

    const transferableProfit =
      typeof selectedPlanObj?.transferableProfit === "number" &&
      !isNaN(selectedPlanObj.transferableProfit)
        ? selectedPlanObj.transferableProfit
        : 0;

    const currency = selectedPlanObj?.currency ?? "USDT";
    const remainingProfit = totalProfit - transferableProfit;

    const stats = [
      {
        title: "Total",
        value: totalProfit.toFixed(2),
        type: "total" as const,
      },
      {
        title: "Transferable",
        value: transferableProfit.toFixed(2),
        type: "transferable" as const,
      },
      {
        title: "Remaining",
        value: remainingProfit.toFixed(2),
        type: "remaining" as const,
      },
    ];

    return { currency, stats };
  }, [selectedPlanObj]);

  useEffect(() => {
    if (!plans.find((p) => p.planId === selectedPlan)) {
      setSelectedPlan(plans?.[0]?.planId ?? "");
    }
  }, [plans, selectedPlan]);


  return (
    <>
      <div className="p-6 space-y-6 w-full">
        {/* 🔹 Plan Selector */}
        <PlanHeader
          plans={plansReport?.investments}
          selectedId={selectedPlan}
          onSelectPlan={(planId: string) => setSelectedPlan(planId)}
        />
        {/* All Profit Transfer Button */}
        {/* All Profit Transfer Button */}
        <div className="flex justify-end mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  size="sm"
                  onClick={() => setProfitTransferOpen(!profitTransferOpen)}
                  disabled={!(filterWithdrawable(safeData).length > 0)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md shadow-sm text-xs sm:text-sm lg:text-base font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 dark:from-purple-500 dark:to-pink-400 dark:text-gray-900 dark:hover:from-purple-600 dark:hover:to-pink-500 transition-all duration-200"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Transfer Profit</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="bg-indigo-600 text-white 
                 dark:bg-indigo-400 dark:text-gray-900 
                 border border-indigo-700 dark:border-indigo-500 
                 px-3 py-1.5 rounded-md shadow-lg text-xs sm:text-sm lg:text-base font-medium"
            >
              {filterWithdrawable(safeData).length > 0 ? (
                <p>Transfer all available profits to your account</p>
              ) : (
                <p>No profits available to transfer</p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 🔹 Stats Grid */}
        <StatsGrid stats={stats} currency={currency} />

        {/* 🔹 Monthly Profit Chart */}
        <ProfitChart
          safeData={safeData}
          currency={currency}
          yAxisOffset={yAxisOffset}
        />

        {/* 🔹 Monthly Profit List */}
        <MonthlyProfitList monthlyData={safeData} />
      </div>

      <GenericDialogDrawer
        title={
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Profit Transfer
            </CardTitle>
          </CardHeader>
        }
        open={profitTransferOpen}
        onOpenChange={setProfitTransferOpen}
        renderContent={(Close) => (
          <ProfitTransferCard
            accountInfo={accountInfo}
            currentAccount={currentAccount}
            setCurrentAccount={setCurrentAccount}
            monthlyData={safeData}
          />
        )}
      />
    </>
  );
};

export default ProfitDashboard;
