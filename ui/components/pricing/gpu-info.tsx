// GpuInfo.tsx
import React, { useMemo } from "react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/primitives/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/ui/primitives/popover";
import { Separator } from "@/ui/primitives/separator";
import { SelectedGpu } from "@/types/mining-plans";
import useIsTouchDevice from "@/lib/hooks/use-touch-device";
import { useGPUPlans } from "@/providers/gpu-plans-provider";

interface GpuInfoProps {
  gpu: SelectedGpu;
}

export function GpuInfo({ gpu }: GpuInfoProps) {
  const isMobile = useIsTouchDevice();
  const { gpus } = useGPUPlans();
   const gpuDetails = useMemo(
          () => gpus.find((g) => g.id === gpu.gpuId) || null,
          [gpus, gpu.gpuId]
        )

   
  if (!gpuDetails) {
    return (
      <span>
        {gpu.quantity} × GPU{gpu.quantity > 1 ? "s" : ""} ({gpu.gpuId})
      </span>
    );
  }

  const Content = (
    <div className="grid gap-2 text-sm text-gray-700 dark:text-gray-300">
      <div className="flex justify-between">
        <span className="font-medium">Model:</span>
        <span>{gpuDetails.model}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Memory:</span>
        <span>{gpuDetails.memory}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Hash Rate:</span>
        <span>{gpuDetails.hashRate}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Power:</span>
        <span>{gpuDetails.powerConsumption}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Fraction:</span>
        <span>{gpuDetails.fraction}</span>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100">
        <span>Price per GPU:</span>
        <span>${gpuDetails.pricePerGpu}</span>
      </div>
    </div>
  );

  return isMobile ? (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer">
          {gpu.quantity} × GPU{gpu.quantity > 1 ? "s" : ""} ({gpuDetails.model})
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {Content}
      </PopoverContent>
    </Popover>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer">
          {gpu.quantity} × GPU{gpu.quantity > 1 ? "s" : ""} ({gpuDetails.model})
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="w-72 p-4 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        {Content}
      </TooltipContent>
    </Tooltip>
  );
}
