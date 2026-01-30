/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bitcoin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en"; // fallback locale
import SVGComponent from "./gpu-icon";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

type HistoryEntry = { timestamp: string; profit: number };

interface MiningVisualizerProps {
  history: HistoryEntry[];
  profit: number;
  locale?: string; // optional for i18n
}

// ------------------------------
// Utility formatter
// ------------------------------
function formatProfit(value: number): string {
  if (isNaN(value)) return "0.0e+0";
  return value.toExponential(1); // compact display
}

const MiningVisualizer: FC<MiningVisualizerProps> = ({ history, profit }) => {
  const latestTimestamp = history?.[0]?.timestamp ?? null;
  const prevTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    prevTimestampRef.current = latestTimestamp;
  }, [latestTimestamp,]);

  // ✅ Prepare chart data (convert profit back to number for scaling)
  const chartData = useMemo(
    () =>
      [...history].reverse().map((h) => ({
        ...h,
        profit: Number(h.profit),
        profitLabel: h.profit,
      })),
    [history,]
  );

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-4 transition-colors w-full">
      {/* HEADER */}
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-3">
          {/* Bitcoin icon - rocking animation */}
          <motion.div
            aria-hidden
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: [0, -12, 12, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="p-1 flex-shrink-0"
          >
            <Bitcoin className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 drop-shadow-md" />
          </motion.div>

          <div>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
              Live Mining Visualizer
            </CardTitle>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
              Real-time profit + GPU
            </div>
          </div>
        </div>

        {/* ✅ Current Profit Display */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Current Hour Profit
          </span>
          <motion.span
            key={profit}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400 font-mono break-all"
            title={String(Number(profit))} // 👈 full decimal on hover
          >
            {profit}
          </motion.span>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 w-full h-full gap-6">
          {/* CHART AREA (2/3) */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Timestamp row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Latest:{" "}
                {latestTimestamp
                  ? dayjs(latestTimestamp)
                    .utc()
                    .local()
                    .format("YYYY-MM-DD hh:mm:ss")
                  : "—"}
              </div>
            </div>

            {/* LIVE CHART */}
            <div className="h-48 sm:h-56 md:h-64 text-gray-800 dark:text-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    opacity={0.2}
                  />

                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(v) =>
                      dayjs(v).utc().local().format("hh:mm:ss")
                    }
                    stroke="currentColor"
                    minTickGap={20}
                    domain={["auto", "auto"]} // auto zoom x range
                  />

                  <YAxis
                    stroke="currentColor"
                    tickFormatter={(val) => formatProfit(val)}
                    domain={["dataMin - 1", "dataMax + 1"]} // 👈 add padding around profit values
                    allowDecimals={true}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tw-prose-bg, #1f2937)",
                      color: "var(--tw-prose-body, #f9fafb)",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#facc15" }}
                    labelFormatter={(v) =>
                      dayjs(v).utc().local().format("YYYY-MM-DD hh:mm:ss")
                    }
                    formatter={(val: any) => [Number(val).toString(), "Profit"]}
                  />

                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      fill: "#facc15",
                      stroke: "#f59e0b",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 5, fill: "#facc15", stroke: "#f59e0b" }}
                    isAnimationActive={true}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* FOOTER INFO */}
            <div className="relative mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Showing last {history?.length ?? 0} snapshots (max 7)
              </span>

              <AnimatePresence>
                {history?.[0] ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-[10px] sm:text-xs"
                  >
                    <span>New snapshot</span>
                    <span className="font-mono">
                      {dayjs(history[0].timestamp)
                        .utc()
                        .local()
                        .format("hh:mm:ss")}
                    </span>
                  </motion.span>
                ) : (
                  <span></span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* GPU ICON (1/3) */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="w-32 sm:w-40 md:w-48 max-w-full">
              <SVGComponent />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningVisualizer;
