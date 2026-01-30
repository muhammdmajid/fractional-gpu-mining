"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import {
  MiningPlanFull,
  MiningPlanOptionWithGpus,
  SelectedGpu,
} from "@/types/mining-plans";
import { GpuSelect } from "./gpu-select";
import { GpuCard } from "./gpu-card";

type GpuConfiguratorProps = {
  gpusList: SelectedGpu[];
  setGpusList: React.Dispatch<React.SetStateAction<SelectedGpu[]>>;
  isCustom?: boolean;
  selectedPlan?: MiningPlanFull | null;
  selectedOptionId?: string | null;
};

export default function GpuConfigurator({
  gpusList,
  setGpusList,
  isCustom = false,
  selectedPlan,
  selectedOptionId,
}: GpuConfiguratorProps) {
  const { gpus: availableGpus } = useGPUPlans();
  const [selectedGpuId, setSelectedGpuId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // ✅ Memoize selected option
  const selectedOption: MiningPlanOptionWithGpus | undefined = useMemo(
    () => selectedPlan?.options?.find((opt) => opt.id === selectedOptionId),
    [selectedPlan, selectedOptionId]
  );

  // ✅ Handle change in GPU selection
  const handleChange = (gpuId: string, qty: number) => {
    setSelectedGpuId(gpuId);
    setQuantity(qty);
  };

  // ✅ Add selected GPU to list
  const handleAdd = () => {
    if (!selectedGpuId) return;

    const gpu = availableGpus.find((g) => g.id === selectedGpuId);
    if (!gpu) return;

    setGpusList((prev) => {
      const existing = prev.find((item) => item.gpuId === selectedGpuId);
      if (existing) {
        return prev.map((item) =>
          item.gpuId === selectedGpuId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          gpuId: selectedGpuId,
          fraction: gpu.fraction,
          pricePerGpu: gpu.pricePerGpu,
          quantity,
        },
      ];
    });

    setSelectedGpuId("");
    setQuantity(1);
  };

  // ✅ Remove GPU from list
  const handleRemove = (gpuId: string) => {
    setGpusList((prev) => prev.filter((item) => item.gpuId !== gpuId));
  };

  // ✅ Total Cost (auto-adjust based on monthly/yearly plan)
  const totalCost = useMemo(
    () =>
      gpusList.reduce(
        (sum, item) => sum + Number(item.pricePerGpu) * item.quantity,
        0
      ),
    [gpusList]
  );

  const displayTotal =
    selectedOption?.type === "monthly" ? totalCost : totalCost * 12;

  return (
    <div className="w-full max-w-full mx-auto space-y-6 overflow-x-hidden">
      {/* GPU Selection */}
      {isCustom && (
        <Card className="w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Select GPU & Quantity
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a GPU model and set the quantity you’d like to add.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <GpuSelect
              gpus={availableGpus}
              selectedId={selectedGpuId}
              quantity={quantity}
              onChange={handleChange}
            />

            <Button
              onClick={handleAdd}
              disabled={!selectedGpuId}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to List
            </Button>
          </CardContent>
        </Card>
      )}

      {/* GPU List */}
      {gpusList.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gpusList.map((item) => (
              <GpuCard
                key={item.gpuId}
                item={item}
                setGpusList={setGpusList}
                handleRemove={handleRemove}
                isCustom={isCustom}
              />
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-8 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-inner text-right">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Total: {displayTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
