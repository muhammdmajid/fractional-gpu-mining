"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/primitives/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import {
  TrendingUp,
  LineChart as LineChartIcon,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { MiningStatusStream } from "@/types/fractional-mining-profit";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMiningStatusStream } from "@/lib/hooks/use-mining-status-stream";
import MiningVisualizer from "../_component/mining-visualizer";
import { Skeleton } from "@/ui/primitives/skeleton";
import { Button } from "@/ui/primitives/button";
import timezone from "dayjs/plugin/timezone";
import { MiningOverviewCard } from "../_component/mining-overview-card";
import PlanHeader from "../_component/plan-header";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);
const fix6 = (n?: number) => Number(n ?? 0).toFixed(6);

// ✅ Formatters
const formatHour = (value: string | number) =>
  dayjs.utc(value).local().format(" DD MMM YY hh:mm");
const formatDay = (value: string | number) =>
  dayjs.utc(value).local().format("DD MMM YY");
const formatMonth = (value: string | number) =>
  dayjs.utc(value).local().format("DD MMM YY");

interface MiningDashboardProps {
  miningStatus:  MiningStatusStream[] | null;
  isOverview?: boolean;
}

const MiningDashboard: FC<MiningDashboardProps> = ({
  miningStatus,
  isOverview = false,
}) => {
 const [selectedPlan, setSelectedPlan] = useState<string>(
    miningStatus?.[0]?.id ?? ""
  );

  const { data, loading, profit, error, history, retry } = useMiningStatusStream({
    initialData: miningStatus,
    investmentId: selectedPlan,
  });

  // ✅ Update selectedPlan if miningStatus changes or becomes null/empty
  useEffect(() => {
    if (!miningStatus || miningStatus.length === 0) {
      setSelectedPlan("");
      return;
    }
    if (!miningStatus.find((m) => m.id === selectedPlan)) {
      setSelectedPlan(miningStatus[0].id);
    }
  }, [miningStatus, selectedPlan]);

  const current: MiningStatusStream | null = data;
if (!loading && !error && miningStatus && !(miningStatus.length > 0))
  return (<div className="p-6">
        <section className="bg-gradient-to-r light:from-indigo-400 light:to-purple-500 dark:from-indigo-900 dark:to-purple-800 rounded-2xl p-10 text-center shadow-lg  ">
      <div className="flex flex-col items-center gap-4 mb-6">
        <AlertCircle className="w-12 h-12 light:text-white/90 dark:text-gray-300/90" />
        <h1 className="text-3xl md:text-5xl font-bold light:text-white dark:text-gray-100">
          No Mining Plan Active
        </h1>
        <p className="max-w-2xl mx-auto text-lg light:text-white/90 dark:text-gray-300/90">
          You currently don’t have any active mining plans. Start mining now
          or explore available plans to maximize your profits.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row justify-center mt-4">
        <Link href="/finance/mining-plans">
          <Button
            className="h-12 gap-1.5 px-8 text-base font-semibold light:bg-white light:text-indigo-600 light:hover:bg-gray-100 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-600 transition-colors duration-200"
            size="lg"
          >
            Start Mining <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

      </div>
    </section>
  </div>

  );



  return (
    <div className="p-6 space-y-6 ">
      {/* Header: Plan Info + Selector */}
      <PlanHeader
        plans={miningStatus}
        selectedId={selectedPlan}
        onSelectPlan={(planId: string) => setSelectedPlan(planId)}
      />

      {/* 🔄 Loading State */}
      {loading && (
        <div className="space-y-6">
          {/* Overview card skeleton */}
          <Skeleton className="h-48 w-full rounded-2xl" />
          {!isOverview ? (
            <>
              {/* KPI Cards (Last 7 hours/days/months) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={`kpi-${i}`}
                    className="h-28 w-full rounded-2xl"
                  />
                ))}
              </div>

              {/* Profit Cards (Previous hour/day/month) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={`profit-${i}`}
                    className="h-28 w-full rounded-2xl"
                  />
                ))}
              </div>

              {/* Visualizer chart */}
              <Skeleton className="h-80 w-full rounded-2xl" />

              {/* Tabbed charts */}
              <Skeleton className="h-96 w-full rounded-2xl" />
            </>
          ) : null}
        </div>
      )}

      {/* ❌ Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Failed to load mining data
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {String(error)}
          </p>
          <Button onClick={retry} variant="default" className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* ✅ Success State */}
      {!loading && !error && current && (
        <>
          <MiningOverviewCard current={current} />
          {!isOverview ? (
            <>
              <MiningVisualizer history={history} profit={profit} />
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {[
                {
  title: "Last 7 Hours",
  value: fix6(current?.profitLast7Hours),
  color: "text-green-500",
},
{
  title: "Last 7 Days",
  value: fix6(current?.profitLast7Days),
  color: "text-blue-500",
},
{
  title: "Last 7 Months",
  value: fix6(current?.profitLast7Months),
  color: "text-purple-500",
}

                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <TrendingUp className={`w-5 h-5 ${item.color}`} />{" "}
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                          {item.value ?? "-"}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Current Profit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {[
                  {
  title: "Previous Hour",
  value: fix6(current?.profitPreviousHour),
  color: "text-indigo-500",
},
{
  title: "Previous Day",
  value: fix6(current?.profitPreviousDay),
  color: "text-yellow-500",
},
{
  title: "Previous Month",
  value: fix6(current?.profitPreviousMonth),
  color: "text-pink-500",
},

                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <LineChartIcon
                              className={`w-5 h-5 ${item.color}`}
                            />{" "}
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xl text-gray-900 dark:text-gray-50">
                          {item.value ?? "-"}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Tabbed Charts */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl capitalize">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                      <LineChartIcon className="w-5 h-5 text-cyan-500" /> Profit
                      trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="hours" className="w-full">
                      <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 capitalize">
                        <TabsTrigger value="hours">Last 7 hours</TabsTrigger>
                        <TabsTrigger value="days">Last 7 days</TabsTrigger>
                        <TabsTrigger value="months">Last 7 months</TabsTrigger>
                      </TabsList>

                      {/* Hourly */}
                      <TabsContent value="hours">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={current?.last7HoursData ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="hourTimestamp"
                              stroke="currentColor"
                              tickFormatter={(val) => formatHour(val)}
                            />
                            <YAxis stroke="currentColor" />
                            <Tooltip
                              labelFormatter={(val) => formatHour(val)}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="profit"
                              stroke="#06b6d4"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </TabsContent>

                      {/* Daily */}
                      <TabsContent value="days">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={current?.last7DaysData ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="dayTimestamp"
                              stroke="currentColor"
                              tickFormatter={(val) => formatDay(val)}
                            />
                            <YAxis stroke="currentColor" />
                            <Tooltip labelFormatter={(val) => formatDay(val)} />
                            <Legend />
                            <Bar dataKey="profit" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </TabsContent>

                      {/* Monthly (changed to BarChart) */}
                      <TabsContent value="months">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={current?.last7MonthsData ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="monthEnd"
                              stroke="currentColor"
                              tickFormatter={(val) => formatMonth(val)}
                            />
                            <YAxis stroke="currentColor" />
                            <Tooltip
                              labelFormatter={(val) => formatMonth(val)}
                            />
                            <Legend />
                            <Bar dataKey="profit" fill="#6366f1" />
                          </BarChart>
                        </ResponsiveContainer>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MiningDashboard;
