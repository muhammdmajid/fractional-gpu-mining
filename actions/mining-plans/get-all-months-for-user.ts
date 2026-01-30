import { and } from "drizzle-orm";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { ServerResponse } from "@/types";
import { UserPlanFinancialReport } from "@/types/fractional-mining-profit";

dayjs.extend(utc);

export async function getAllMonthsForUser(): Promise<ServerResponse<UserPlanFinancialReport>> {
  try {
    const user = await getCurrentUser();

    if (!user?.id || !user.email) {
      return {
        success: false,
        status: "error",
        statusCode: 401,
        error: "User not authenticated",
        message: "Authentication required",
      };
    }

    const investments = await db.query.miningInvestmentsTable.findMany({
      where: (fields, { eq }) => eq(fields.email, user.email),
      with: {
        plan: true,
        option: true,
        gpus: { with: { gpu: true } },
      },
    });

    if (!investments.length) {
      return {
        success: true,
        status: "success",
        statusCode: 200,
        data: {
          profitMonths: [],
          investments: [],
        },
        message: "No investments found",
      };
    }

    const refMonth = dayjs.utc().subtract(1, "month").endOf("month");
    // const refMonth = dayjs.utc().add(10, "month").add(5, "day").endOf("day");

    const profitMonths = await Promise.all(
      investments.map(async (investment) => {
        const allMonths = await db.query.gpu_mining_monthly.findMany({
          where: (fields, { eq, lte }) =>
            and(eq(fields.planId, investment.id), lte(fields.monthStart, refMonth.toDate())),
          orderBy: (fields, { asc }) => asc(fields.monthStart),
        });

        const totalProfit = allMonths.reduce((sum, m) => sum + Number(m.profit ?? 0), 0);

        const transferableProfit = allMonths.reduce(
          (sum, m) =>
            m.withdrawable && !m.locked && !m.isTransferred
              ? sum + Number(m.profit ?? 0)
              : sum,
          0
        );

        const formattedMonths = allMonths.map((m) => ({
          ...m,
          monthStart: m.monthStart ? dayjs.utc(m.monthStart).format("YYYY-MM-DD") : "",
          monthEnd: m.monthEnd ? dayjs.utc(m.monthEnd).format("YYYY-MM-DD") : "",
        }));

        return {
          planId: investment.id,
          allMonths: formattedMonths,
          totalProfit,
          transferableProfit,
          currency: investment?.currency ?? "USDT"
        };
      })
    );

    return {
      success: true,
      status: "success",
      statusCode: 200,
      data: {
        profitMonths,
        investments,
      },
      message: "All months for user plans fetched successfully",
    };
  } catch (error) {
    console.error("❌ getAllMonthsForUser error:", error);
    return {
      success: false,
      status: "error",
      statusCode: 500,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to fetch months for user plans",
    };
  }
}
