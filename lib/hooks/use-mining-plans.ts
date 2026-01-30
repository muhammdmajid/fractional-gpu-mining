"use client";

import { useEffect, useState } from "react";
import { MiningPlanFull } from "@/types/mining-plans";
import { ServerResponse } from "@/types";


export function useMiningPlans(): ServerResponse<MiningPlanFull[]> {
  const [response, setResponse] = useState<ServerResponse<MiningPlanFull[]>>({
    success: false,
    status: "idle",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans(): Promise<void> {
      setResponse((prev) => ({ ...prev, status: "loading" }));

      try {
        const res = await fetch("/api/mining-plans");
        const json: ServerResponse<MiningPlanFull[]> = await res.json();

        if (!isMounted) return;

        setResponse({
          ...json,
          status: json.success ? "success" : "error",
        });
      } catch (err) {
        if (!isMounted) return;

        setResponse({
          success: false,
          error: err instanceof Error ? err.message : "Unexpected error occurred",
          status: "error",
        });
      }
    }

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  return response;
}
