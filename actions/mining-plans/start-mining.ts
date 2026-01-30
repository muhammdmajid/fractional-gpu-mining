import { db } from "@/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  gpu_mining_monthly,
  gpu_mining_daily,
  gpu_mining_hourly,
} from "@/db/schema";
import { NewGpuMiningHourly } from "@/types/fractional-mining-profit";
import { and, eq, gte, lt } from "drizzle-orm";

dayjs.extend(utc);

// ----------------- helpers -----------------
export function randVariation(f: number) {
  return (Math.random() * 2 - 1) * f;
}

export function miningPartition(total: number, parts: number, intensity = 2): number[] {
  if (parts <= 0) return [];
  const weights = Array.from({ length: parts }, () =>
    Math.pow(-Math.log(Math.random()), intensity)
  );
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (w / sum) * total);
}

// ----------------- main seeding -----------------
export async function startMining(investmentId: string) {
  if (!investmentId) throw new Error("Missing investmentId");

  try {
    // 1️⃣ Load investment
    const [investment] = await db.query.miningInvestmentsTable.findMany({
      where: (fields, { eq }) => eq(fields.id, investmentId),
      columns: {
        miningCycle: true,
        depositAmount: true,
        startDate: true,
        currency: true
      },
      with: {
        option: { columns: { miningCycle: true } },
        gpus: {
          with: {
            gpu: { columns: { hashRate: true, fraction: true } },
          },
        },
      },
    });

    if (!investment) {
      console.warn(`⚠️ Investment ${investmentId} not found. Skipping seed.`);
      return;
    }

    // Aggregate GPU data
    const hashRate = investment.gpus.reduce(
      (sum, rel) => sum + Number(rel.gpu.hashRate),
      0
    );
    const f = investment.gpus.reduce(
      (sum, rel) => sum + Number(rel.gpu.fraction),
      0
    );

    const D = Number(investment.depositAmount ?? 0);
    const N = Number(investment.miningCycle ?? 1); // months
    const H = Number(hashRate || 1);

    if (!D || !N || N <= 0) {
      console.warn(`⚠️ Invalid investment params: D=${D}, N=${N}`);
      return;
    }

    const investmentStart = investment.startDate
      ? dayjs.utc(investment.startDate)
      : dayjs.utc();

    const f_month = f; // variation factor
    const offsetStart = investmentStart.add(1, "hour"); // Always +1h after investment start

    // 2️⃣ Loop months
    for (let monthIndex = 1; monthIndex <= N; monthIndex++) {
      try {
        const monthStart = offsetStart.add(monthIndex - 1, "month");
        const monthEnd = monthStart.add(1, "month");
        const daysInMonth = monthEnd.diff(monthStart, "day");

        // Skip if month already exists
        const existingMonth = await db.query.gpu_mining_monthly.findFirst({
          where: and(
            eq(gpu_mining_monthly.planId, investmentId),
            gte(gpu_mining_monthly.monthStart, monthStart.toDate()),
            lt(gpu_mining_monthly.monthEnd, monthEnd.toDate())
          ),
        });
        if (existingMonth) {
          console.log(`⏭️ Month ${monthIndex} already seeded. Skipping...`);
          continue;
        }

        // Profit calculation
        const monthlyBase = D;
        const monthlyWithNoise = monthlyBase * (1 + randVariation(f_month));
        const finalMonthlyTarget =
          monthIndex === 1
            ? monthlyBase*1.8 + Math.random() * 0.000001
            : monthlyWithNoise * H;

        // Insert monthly record
        const [monthlyRow] = await db
          .insert(gpu_mining_monthly)
          .values({
            planId: investmentId,
            monthStart: monthStart.toDate(),
            monthEnd: monthEnd.toDate(),
            currency: investment?.currency ?? "USDT",
            withdrawable: monthIndex === 1 ? true : false,
            locked: monthIndex === 1 ? false : true,
            isTransferred:false,
            profit: finalMonthlyTarget.toString(),
          })
          .returning();

        if (!monthlyRow) throw new Error("Failed to insert monthly record");

        // Divide profit into daily profits
        const dailyProfits = miningPartition(finalMonthlyTarget, daysInMonth, f_month / daysInMonth);
        const hourlyRows: NewGpuMiningHourly[] = [];

        for (let i = 0; i < dailyProfits.length; i++) {
          const dayProfit = dailyProfits[i];
          const dayDate = monthStart.add(i, "day");

          // Skip if daily already exists
          const existingDay = await db.query.gpu_mining_daily.findFirst({
            where: and(
              eq(gpu_mining_daily.planId, investmentId),
              eq(gpu_mining_daily.monthlyId, monthlyRow.id),
              gte(gpu_mining_daily.dayTimestamp, dayDate.startOf("day").toDate()),
              lt(gpu_mining_daily.dayTimestamp, dayDate.endOf("day").toDate())
            ),
          });
          if (existingDay) {
            console.log(`⏭️ Day ${dayDate.format("YYYY-MM-DD")} already exists. Skipping...`);
            continue;
          }

          // Insert daily
          const [dailyRow] = await db
            .insert(gpu_mining_daily)
            .values({
              planId: investmentId,
              monthlyId: monthlyRow.id,
              dayTimestamp: dayDate.toDate(),
              currency: investment?.currency ?? "USDT",
              profit: dayProfit.toString(),
            })
            .returning();

          if (!dailyRow) continue;

          // Split daily profit into hourly profits
          const hourAllocations = miningPartition(dayProfit, 24, f_month / (daysInMonth * 24));

          for (let h = 0; h < 24; h++) {
            const hourDate = dayDate.add(h, "hour");

            // Skip if hour already exists
            const existingHour = await db.query.gpu_mining_hourly.findFirst({
              where: and(
                eq(gpu_mining_hourly.planId, investmentId),
                eq(gpu_mining_hourly.dailyId, dailyRow.id),
                eq(gpu_mining_hourly.hourTimestamp, hourDate.toDate())
              ),
            });
            if (existingHour) continue;

            hourlyRows.push({
              planId: investmentId,
              dailyId: dailyRow.id,
              hourTimestamp: hourDate.toDate(),
              profit: hourAllocations[h].toString(),
              currency: investment?.currency ?? "USDT",
            });
          }
        }

        // Batch insert hourly rows
        if (hourlyRows.length > 0) {
          const batchSize = 500;
          for (let i = 0; i < hourlyRows.length; i += batchSize) {
            const batch = hourlyRows.slice(i, i + batchSize);
            await db.insert(gpu_mining_hourly).values(batch);
          }
        }
      } catch (err) {
        console.error(`❌ Failed seeding month ${monthIndex} for ${investmentId}:`, err);
      }
    }
  } catch (err) {
    console.error(`❌ Fatal error in startMining(${investmentId}):`, err);
  }
}
