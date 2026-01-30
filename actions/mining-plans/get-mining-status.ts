import { eq, and, lte,  gte, } from "drizzle-orm";
import type { ServerResponse } from "@/types";
import type {
  MiningStatusStream,
} from "@/types/fractional-mining-profit";
import { db } from "@/db";
import {
  gpu_mining_daily,
  gpu_mining_hourly,
  gpu_mining_monthly,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { SYSTEM_CONFIG } from "@/config";
import { redirect } from "next/navigation";
import { Investment } from "@/types/mining-plans";

// 🕒 Day.js setup
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/* ---------------------------------- */
/* 🔹 Main Mining Status API          */
/* ---------------------------------- */
export default async function getMiningStatus(): Promise<
  ServerResponse<MiningStatusStream[]>
> {
  try {
   /**
      * Step 1️⃣: Authenticate user
      */
     const user = await getCurrentUser();
            if (!user || !user.id) {
       return {
         success: false,
         status: "unauthorized",
         statusCode: 401,
         message: "User not signed in",
       };
     }
 
    let investments: Investment[] = [];
    try {
      investments = await db.query.miningInvestmentsTable.findMany({
        where: (fields, { eq }) => eq(fields.email, user.email),
        with: {
          plan: true,
          option: true,
          gpus: { with: { gpu: true } },
        },
      });
    } catch (err) {
      console.error("❌ Failed to fetch investment:", err);
      return {
        success: false,
        status: "error",
        statusCode: 500,
        error: err instanceof Error ? err.message : "DB error",
        message: "Could not fetch investment details",
      };
    }

    if (!investments.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        data: [],
        message: "No investments found",
      };
    }

    const now = dayjs.utc();

    // // // ✅ Add one day
    // const tomorrow = now1.add(1, "day").add(3, "month");

    // // ✅ Convert to JS Date if needed for Drizzle
    // const now = tomorrow; // 🔥 always UTC-based timestamp
    const results: MiningStatusStream[] = [];

    for (const investment of investments) {
      const { last7Months, nextMonthData,totalProfit,allMonths } = await getLast7Months(
        investment.id,
        now.toDate()
      );
      const { last7Days, nextDayData, } = await getLast7Days(
        investment.id,
        now.toDate()
      );
      const { last7Hours, nextHourData, } = await getLast7Hours(
        investment.id,
        now.toDate()
      );

      // =========================
      // Totals (safe parsing)
      // =========================
      const profitLast7Hours = last7Hours.reduce(
        (acc, r) => acc + (parseFloat(r.profit ?? "0") || 0),
        0
      );
      const profitLast7Days = last7Days.reduce(
        (acc, r) => acc + (parseFloat(r.profit ?? "0") || 0),
        0
      );
      const profitLast7Months = last7Months.reduce(
        (acc, r) => acc + (parseFloat(r.profit ?? "0") || 0),
        0
      );

      const profitPreviousHour = Array.isArray(last7Hours) && last7Hours.length > 0
        ? Number(last7Hours.at(-1)?.profit) || 0
        : 0;
      const profitPreviousDay = Array.isArray(last7Days) && last7Days.length > 0
        ? Number(last7Days.at(-1)?.profit) || 0
        : 0;

      const profitPreviousMonth = Array.isArray(last7Months) && last7Months.length > 0
        ? Number(last7Months.at(-1)?.profit) || 0
        : 0;

      // =========================
      // Format output timestamps
      // =========================
      const last7HoursData = last7Hours.map(r => ({
        ...r,
        hourTimestamp: r.hourTimestamp
          ? dayjs.utc(r.hourTimestamp).format("YYYY-MM-DD HH:mm")
          : "",
      }));

      const last7DaysData = last7Days.map(r => ({
        ...r,
        dayTimestamp: r.dayTimestamp
          ? dayjs.utc(r.dayTimestamp).format("YYYY-MM-DD")
          : "",
      }));

      const last7MonthsData = last7Months.map(r => ({
        ...r,
        monthStart: r.monthStart ? dayjs.utc(r.monthStart).format("YYYY-MM-DD") : "",
        monthEnd: r.monthEnd ? dayjs.utc(r.monthEnd).format("YYYY-MM-DD") : "",
      }));
const allMonthsFormat=allMonths.map(r => ({
        ...r,
        monthStart: r.monthStart ? dayjs.utc(r.monthStart).format("YYYY-MM-DD") : "",
        monthEnd: r.monthEnd ? dayjs.utc(r.monthEnd).format("YYYY-MM-DD") : "",
      }));


      // =========================
      // Push into results
      // =========================
      results.push({
        ...investment,
        totalProfit,
        latestUpdate: now.format("YYYY-MM-DD HH:mm"),
        profitLast7Hours,
        profitLast7Days,
        profitLast7Months,
        profitPreviousHour,
        profitPreviousDay,
        profitPreviousMonth,
        last7HoursData,
        last7DaysData,
        last7MonthsData,
        allMonths:allMonthsFormat,
        nextHourData: nextHourData ? {
          ...nextHourData,
          hourTimestamp: nextHourData?.hourTimestamp ? dayjs.utc(nextHourData?.hourTimestamp).format("YYYY-MM-DD HH:mm") : "",
        } : null,
        nextDayData: nextDayData
          ? {
            ...nextDayData,
            dayTimestamp: nextDayData.dayTimestamp
              ? dayjs.utc(nextDayData.dayTimestamp).format("YYYY-MM-DD")
              : "",
          }
          : null,

        nextMonthData: nextMonthData
          ? {
            ...nextMonthData,
            monthStart: nextMonthData.monthStart
              ? dayjs.utc(nextMonthData.monthStart).format("YYYY-MM-DD")
              : "",
            monthEnd: nextMonthData.monthEnd
              ? dayjs.utc(nextMonthData.monthEnd).format("YYYY-MM-DD")
              : "",
          }
          : null,


      });
    }


    return {
      success: true,
      status: "success",
      statusCode: 200,
      data: results,
      message: "Mining statuses fetched successfully",
    };
  } catch (error) {
    console.error("❌ getMiningStatus error:", error);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to fetch mining status",
    };
  }
}
// ============================
// 🔹 Last 7 Days (excluding today) + Current Day + Next Day
// ============================
export async function getLast7Days(planId: string, now: Date = new Date()) {



  // Last 7 days excluding today
  const last7DaysStart = dayjs.utc(now).subtract(7, "day").startOf("day").toDate();
  const last7DaysEnd = dayjs.utc(now).subtract(1, "day").endOf("day").toDate();

  const last7Days = await db.query.gpu_mining_daily.findMany({
    where: and(
      eq(gpu_mining_daily.planId, planId),
      gte(gpu_mining_daily.dayTimestamp, last7DaysStart),
      lte(gpu_mining_daily.dayTimestamp, last7DaysEnd)
    ),
    orderBy: (fields, { asc }) => [asc(fields.dayTimestamp)],
    limit: 7, // ✅ fetch only 7
  });

  // Current day
  const startOfDay = dayjs.utc(now).startOf("day").toDate();
  const endOfDay = dayjs.utc(now).endOf("day").toDate();

  const nextDayData = await db.query.gpu_mining_daily.findFirst({
    where: and(
      eq(gpu_mining_daily.planId, planId),
      gte(gpu_mining_daily.dayTimestamp, startOfDay),
      lte(gpu_mining_daily.dayTimestamp, endOfDay)
    ),
  });



  // // Debug log
  // console.log("time:",dayjs.utc(now).format("YYYY-MM-DD"),
  //   "📅 Last 7 Days (excluding today):",
  //   last7Days.map((d) => dayjs.utc(d.dayTimestamp).format("YYYY-MM-DD"))
  // );
  // console.log(
  //   "🟢 Current Day:",
  //   nextDayData
  //     ? dayjs.utc(nextDayData.dayTimestamp).format("YYYY-MM-DD")
  //     : "No data"
  // );


  return { last7Days, nextDayData };
}


// 🔹 Fetch Last 7 Hours (excluding current hour) + Current Hour
// ============================

export async function getLast7Hours(planId: string, now: Date = new Date()) {
  // ----------------------------
  // Calculate time ranges
  // ----------------------------

  //Last 7 full hours (excluding current hour)
const last7HoursStart = dayjs.utc(now).subtract(7, "hour").startOf("hour").toDate();
const last7HoursEnd = dayjs.utc(now).subtract(1, "hour").endOf("hour").toDate();

  // ----------------------------
  // Fetch last 7 hours from DB
  // ----------------------------
  const last7Hours = await db.query.gpu_mining_hourly.findMany({
    where: and(
      eq(gpu_mining_hourly.planId, planId),
      gte(gpu_mining_hourly.hourTimestamp, last7HoursStart),
      lte(gpu_mining_hourly.hourTimestamp, last7HoursEnd)
    ),
    orderBy: (fields, { asc }) => [asc(fields.hourTimestamp)],
    limit: 7, // ✅ only fetch 7 records
  });

  // ----------------------------
  // Current hour range
  // ----------------------------
  const startOfCurrentHour = dayjs.utc(now).startOf("hour").toDate();
  const endOfCurrentHour = dayjs.utc(now).endOf("hour").toDate();

  // ----------------------------
  // Fetch current hour data
  // ----------------------------
  const nextHourData = await db.query.gpu_mining_hourly.findFirst({
    where: and(
      eq(gpu_mining_hourly.planId, planId),
      gte(gpu_mining_hourly.hourTimestamp, startOfCurrentHour),
      lte(gpu_mining_hourly.hourTimestamp, endOfCurrentHour)
    ),
  });

  // ----------------------------
  // Logging for debugging
  // ----------------------------
  // console.log("time:",dayjs.utc(now).format("YYYY-MM-DD HH:mm "),"🕒 Last 7 Hours:");
  // last7Hours.forEach((entry) =>
  //   console.log(dayjs.utc(entry.hourTimestamp).format("YYYY-MM-DD HH:mm"), entry.profit)
  // );

  // console.log(
  //   "🟢 Current Hour:",
  //   nextHourData
  //     ? `${dayjs.utc(nextHourData.hourTimestamp).format("YYYY-MM-DD HH:mm")} → Profit: ${nextHourData.profit}`
  //     : "No data"
  // );

  // ----------------------------
  // Return structured result
  // ----------------------------
  return { last7Hours, nextHourData };
}

// ============================
// 🔹 Last 7 Months (excluding current) + Current Month + Next Month
// ============================
export async function getLast7Months(planId: string, now: Date = new Date()) {


  // Last 7 days excluding today
  const last7MonthsStart = dayjs.utc(now).subtract(7, "month").startOf("month").toDate();
  const refMonth = dayjs.utc(now).subtract(1, "month").endOf("month").toDate();

  const last7Months = await db.query.gpu_mining_monthly.findMany({
    where: and(
      eq(gpu_mining_monthly.planId, planId),
      gte(gpu_mining_monthly.monthStart, last7MonthsStart),
      lte(gpu_mining_monthly.monthStart, refMonth)
    ),
    orderBy: (fields, { asc }) => [asc(fields.monthStart)],
    limit: 7, // ✅ fetch only 7
  });



  // Current day
  const startOfMonth = dayjs.utc(now).startOf("month").toDate();
  const endOfMonth = dayjs.utc(now).endOf("month").toDate();

  // 2️⃣ Current month
  const nextMonthData = await db.query.gpu_mining_monthly.findFirst({
    where: (fields, { and, eq, lte, gte }) =>
      and(
        eq(fields.planId, planId),
        gte(fields.monthStart, startOfMonth),
        lte(fields.monthStart, endOfMonth)
      ),
  });


  const allMonths = await db
  .select()
  .from(gpu_mining_monthly)
  .where(
    and(
      eq(gpu_mining_monthly.planId, planId),
      lte(gpu_mining_monthly.monthStart, refMonth)
    )
  );
  
// Calculate reference hour
const refHour = dayjs.utc(now).subtract(1, "hour").endOf("hour").toDate();

// Fetch all hourly records up to refHour
const allHours = await db
  .select()
  .from(gpu_mining_hourly)
  .where(
    and(
      eq(gpu_mining_hourly.planId, planId),
      lte(gpu_mining_hourly.hourTimestamp, refHour)
    )
  );

// Sum the profit
const totalProfit = allHours.reduce(
  (sum, row) => sum + parseFloat(row.profit.toString()), // Convert numeric to float
  0
);

// console.log("Total profit:", totalProfit);
  // // Debug
  // console.log("time:",dayjs.utc(now).format("YYYY-MM-DD"),
  //   "📆 Last 7 Months:",
  //   last7Months.map((m) => ({
  //     start: dayjs.utc(m.monthStart).format("YYYY-MM-DD"),
  //     end: dayjs.utc(m.monthEnd).format("YYYY-MM-DD"),
  //   }))
  // );
  // console.log(
  //   "🟢 Current Month:",
  //   nextMonthData
  //     ? {
  //         start: dayjs.utc(nextMonthData.monthStart).format("YYYY-MM-DD"),
  //         end: dayjs.utc(nextMonthData.monthEnd).format("YYYY-MM-DD"),
  //       }
  //     : "No data"
  // );


  return { last7Months, nextMonthData,totalProfit ,allMonths};
}
