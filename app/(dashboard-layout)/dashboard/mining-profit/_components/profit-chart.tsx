"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/ui/primitives/card";
import dayjs from "dayjs";
import { MonthlyData } from "@/types/fractional-mining-profit";

const formatMonth = (value: string | number) =>
  dayjs.utc(value).local().format("MMM YYYY");

export default function ProfitChart({
  safeData,
  currency,
  yAxisOffset,
}: {
  safeData: MonthlyData[];
  currency: string;
  yAxisOffset: number;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl capitalize">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200 text-lg sm:text-xl font-semibold tracking-wide">
          Monthly Profit
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={safeData.map((d) => {
              const profitNum = parseFloat(d.profit as unknown as string);
              return {
                ...d,
                profit: !isNaN(profitNum) ? profitNum : 0,
              };
            })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="monthEnd"
              tickFormatter={formatMonth}
              className="capitalize text-xs sm:text-sm"
            />
            <YAxis className="text-xs sm:text-sm">
              <Label
                value={currency}
                angle={-90}
                position="insideLeft"
                offset={+yAxisOffset}
                className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium"
              />
            </YAxis>
            <Tooltip
              labelFormatter={(val) => formatMonth(val)}
              formatter={(value: unknown) => {
                if (typeof value === "number" && !isNaN(value)) {
                  return [`${value.toFixed(2)}`, "Profit"];
                }
                return [`0.00`, "Profit"];
              }}
              contentStyle={{ textTransform: "capitalize" }}
            />
            <Legend className="uppercase text-xs sm:text-sm" />
            <Bar dataKey="profit" fill="#6366f1" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="profit"
                position="top"
                formatter={(label: unknown) =>
                  typeof label === "number" && !isNaN(label)
                    ? `${label.toFixed(2)}`
                    : `0.00`
                }
                className="uppercase text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
