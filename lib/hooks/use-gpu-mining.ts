"use client";

import { useEffect, useRef, useState } from "react";
import type { MiningStatusStream } from "@/types/fractional-mining-profit";
import type { ServerResponse } from "@/types";

export function useGPUMining(investmentId: string) {
  const [data, setData] = useState<MiningStatusStream | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(false);

  // track retries to avoid infinite loop
  const retryRef = useRef<number>(0);
  const maxRetries = 5;

  useEffect(() => {
    if (!investmentId) {
      setError("Invalid investmentId");
      setStatus("error");
      return;
    }

    let ev: EventSource | null = null;
    setStatus("loading");
    setError(null);
    setData(null);
    setMuted(false);
    retryRef.current = 0;

    const connect = () => {
      ev = new EventSource(`/api/mining/${investmentId}`);

      ev.onmessage = (e: MessageEvent) => {
        try {
          const res: ServerResponse<MiningStatusStream> = JSON.parse(e.data);

          if (res.success && res.data) {
            setData(res.data);
            setStatus("success");
            setError(null);
          } else {
            setError(
              typeof res.error === "string"
                ? res.error
                : JSON.stringify(res.error) || "Unknown error"
            );
            setStatus("error");
          }
        } catch (err) {
          console.error("❌ Failed to parse SSE message:", err);
          setError("Failed to process server message");
          setStatus("error");
        } finally {
          setMuted(true);
        }
      };

      ev.onerror = () => {
        console.error("❌ EventSource connection error");

        if (retryRef.current < maxRetries) {
          retryRef.current++;
          setError(`Connection lost. Retrying... (${retryRef.current})`);
          setStatus("loading");

          ev?.close();
          setTimeout(connect, 2000 * retryRef.current); // exponential backoff
        } else {
          setError("Connection failed after multiple retries.");
          setStatus("error");
          ev?.close();
        }
      };
    };

    connect();

    return () => {
      ev?.close();
    };
  }, [investmentId]);

  return { data, status, error, muted };
}
