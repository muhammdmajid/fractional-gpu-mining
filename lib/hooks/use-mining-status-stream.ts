import { useState, useEffect, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import type { MiningStatusStream } from "@/types/fractional-mining-profit";
import "dayjs/locale/en"; // fallback locale

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

interface UseMiningStatusStreamProps {
  initialData?:  MiningStatusStream[] | null;
  apiInterval?: number; // API polling interval in ms
  updateInterval?: number; // profit simulation interval in ms
  investmentId?: string;
}

// ------------------------------
// Normalize unknown errors
// ------------------------------
function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error(err);
  return new Error("Unknown error occurred");
}

export function useMiningStatusStream({
  initialData = [],
  apiInterval = 5 * 60_000, // 5 minutes
  updateInterval = 1_000, // 1 second
  investmentId,
}: UseMiningStatusStreamProps) {
  // ------------------------------
  // STATE
  // ------------------------------
  const [data, setData] = useState<MiningStatusStream | null>(
    investmentId
      ? initialData?.find((i) => i.id === investmentId) || null
      : initialData?.[0] || null
  );

  // ------------------------------
  // Times
  // ------------------------------
  const [startTime, setStartTime] = useState<Dayjs>(dayjs().utc().local());
  const [endTime, setEndTime] = useState<Dayjs | null>(
    data?.nextHourData?.hourTimestamp
      ? dayjs.utc(data.nextHourData.hourTimestamp).local()
      : null
  );

  // ------------------------------
  // Profits
  // ------------------------------
  const [startProfit, setStartProfit] = useState<number>(0);
  const [endProfit, setEndProfit] = useState<number>(
    data ? Number(data.nextHourData?.profit ?? 0) : 0
  );
  const [currentProfit, setCurrentProfit] = useState<number>(0);

  // ------------------------------
  // Meta
  // ------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [history, setHistory] = useState<
    { timestamp: string; profit: number }[]
  >([]);

  // ------------------------------
  // FETCH FUNCTION
  // ------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/mining-status`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const updated = await res.json();
      const raw = updated?.data?.data as MiningStatusStream[] | undefined;

      if (!raw || !Array.isArray(raw)) {
        throw new Error("Invalid API response format");
      }

      const item: MiningStatusStream | undefined = investmentId
        ? raw.find((i) => i.id === investmentId)
        : raw[0];

      setData(item || null);

      // use local "now"
      const now = dayjs().local();

      const hourEnd = item?.nextHourData?.hourTimestamp
        ? dayjs.utc(item.nextHourData.hourTimestamp).local()
        : null;

      const hourStart = hourEnd ? hourEnd.subtract(1, "hour") : null;

      const totalMs = hourEnd && hourStart ? hourEnd.diff(hourStart) : 0;
      const elapsedMs = hourStart && now ? now.diff(hourEnd) : 0;

      // always a fraction between 0 and 1
      const prog =
        totalMs > 0
          ? Math.min(Math.max(elapsedMs / totalMs, 0.000001), 0.999999)
          : 1;

      const profitTarget = item ? Number(item.nextHourData?.profit ?? 0) : 0;

      let profitNow = 0 + (profitTarget - 0) * prog;
      if (profitNow > profitTarget) profitNow = profitTarget;
      setCurrentProfit(profitNow);
      setStartProfit(0);
      setEndProfit(profitTarget);
      setEndTime(hourEnd || null);

      setError(null);
    } catch (err) {
      const normalized = toError(err);
      setError(normalized);
      console.error("❌ Error fetching mining status:", normalized);
    } finally {
      setLoading(false);
    }
  }, [investmentId]);

  // ------------------------------
  // PROFIT SIMULATION
  // ------------------------------
  useEffect(() => {
    if (!startTime || !endTime) return;

    const interval = setInterval(() => {
      // use local "now"
      const now = dayjs().local();

      const hourEnd = data?.nextHourData?.hourTimestamp
        ? dayjs.utc(data.nextHourData.hourTimestamp).local()
        : null;

      const hourStart = hourEnd ? hourEnd.subtract(1, "hour") : null;

      const totalMs = hourEnd && hourStart ? hourEnd.diff(hourStart) : 0;
      const elapsedMs = hourStart && now ? now.diff(hourEnd) : 0;

      // always a fraction between 0 and 1
      const prog =
        totalMs > 0
          ? Math.min(Math.max(elapsedMs*1.0000 / totalMs, 0.000000001), 0.999999999)
          : 1;

      const startVal = Number(startProfit);
      const endVal = Number(endProfit);

      let profitNow = startVal + (endVal - startVal) * prog;
      if (profitNow > endVal) profitNow = endVal;

      // Append history
      setHistory((old) => {
        const updated = [
          {
            timestamp: now.format("YYYY-MM-DD HH:mm:ss"),
            profit: profitNow,
          },
          ...old,
        ];
        return updated.slice(0, 7); // keep last 7 entries
      });

      setCurrentProfit(profitNow);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [startTime, endTime, startProfit, endProfit, updateInterval, data?.nextHourData?.hourTimestamp]);

  // ------------------------------
  // API FETCH INTERVAL
  // ------------------------------
  useEffect(() => {
    setStartTime(dayjs().utc().local());
    fetchStatus(); // initial fetch

    const interval = setInterval(fetchStatus, apiInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, apiInterval]);

  return {
    data,
    loading,
    error,
    profit: currentProfit,
    history,
    setCurrentProfit,
    retry: fetchStatus,
  };
}
