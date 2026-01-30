"use client";

import {
  MiningPlanFull,
  MiningPlanGpu,
  MiningPlanSelected,
} from "@/types/mining-plans";
import * as React from "react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface GPUPlansContextType {
  setSelectedPlan: (item: MiningPlanSelected) => void;
  clearGPUPlans: () => void;
  selectedPlan: MiningPlanSelected | null;
  removeItem: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  miningPlansData: MiningPlanFull[];
  gpus: MiningPlanGpu[];
}

interface GPUPlansProviderProps {
  children: React.ReactNode;
  plans?: MiningPlanFull[];
  gpus?: MiningPlanGpu[];
}

/* -------------------------------------------------------------------------- */
/*                                Context                                     */
/* -------------------------------------------------------------------------- */

const GPUPlansContext = React.createContext<GPUPlansContextType | undefined>(
  undefined
);

const STORAGE_KEY = "GPUPlan";
const DEBOUNCE_MS = 500;

const loadGPUPlanFromStorage = (): MiningPlanSelected | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MiningPlanSelected;
  } catch (err) {
    console.error("Failed to load GPUPlan:", err);
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                               Provider                                     */
/* -------------------------------------------------------------------------- */

export function GPUPlansProvider({
  children,
  plans = [],
  gpus: initialGpus = [],
}: GPUPlansProviderProps) {
  const [item, setItem] = React.useState<MiningPlanSelected | null>(
    loadGPUPlanFromStorage
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const [miningPlansData, setMiningPlansData] = React.useState<
    MiningPlanFull[]
  >(() => (plans.length > 0 ? plans : []));

  const [gpus, setGpus] = React.useState<MiningPlanGpu[]>(() =>
    initialGpus.length > 0 ? initialGpus : []
  );

  /* -------------------- Persist to localStorage (debounced) ------------- */
  const saveTimeout = React.useRef<null | ReturnType<typeof setTimeout>>(null);

  const memoizedGpus = React.useMemo(() => initialGpus, [initialGpus]);
  const memoizedPlans = React.useMemo(() => plans, [plans]);

  React.useEffect(() => {
    setGpus(memoizedGpus);
    setMiningPlansData(memoizedPlans);
  }, [memoizedGpus, memoizedPlans]);

  React.useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        if (item) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.error("Failed to save GPU data:", err);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [item, miningPlansData, gpus]);

  /* ----------------------------- Actions -------------------------------- */
  const setSelectedPlan = React.useCallback((newItem: MiningPlanSelected) => {
    setItem(newItem);
  }, []);

  const removeItem = React.useCallback(() => {
    setItem(null);
  }, []);

  const clearGPUPlans = React.useCallback(() => setItem(null), []);

  /* ----------------------------- Context value -------------------------- */
  const value = React.useMemo<GPUPlansContextType>(
    () => ({
      setSelectedPlan,
      clearGPUPlans,
      selectedPlan: item,
      removeItem,
      isOpen,
      setIsOpen,
      miningPlansData,
      gpus,
    }),
    [
      setSelectedPlan,
      clearGPUPlans,
      item,
      removeItem,
      isOpen,
      miningPlansData,
      gpus,
    ]
  );

  return (
    <GPUPlansContext.Provider value={value}>
      {children}
    </GPUPlansContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Hook                                      */
/* -------------------------------------------------------------------------- */

export function useGPUPlans(): GPUPlansContextType {
  const ctx = React.useContext(GPUPlansContext);
  if (!ctx)
    throw new Error("useGPUPlans must be used within a GPUPlansProvider");
  return ctx;
}
