"use client";

import { FC, useCallback, useMemo } from "react";
import { Button } from "@/ui/primitives/button";
import {
  MiningPlanFull,
  MiningPlanOptionWithGpus,
  SelectedGpu,
} from "@/types/mining-plans";
import { CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Separator } from "@/ui/primitives/separator";
import { GpuInfo } from "./gpu-info";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { getPlanWithSelectedOption } from "./pricing-card-footer";
import { useRouter } from "next/navigation";

interface InvoiceSummaryProps {
  selectedPlan?: MiningPlanFull | null;
  selectedOptionId?: string | null;
  gpusList?: SelectedGpu[];
  isDashboard?: boolean;
}

const InvoiceSummary: FC<InvoiceSummaryProps> = ({
  selectedPlan,
  selectedOptionId,
  gpusList = [],
  isDashboard = false,
}) => {
  const { setSelectedPlan, selectedPlan: oldSelectedPlan } = useGPUPlans();
  const router = useRouter();

  // ✅ Find selected option only if needed in UI
  const selectedOption: MiningPlanOptionWithGpus | undefined = useMemo(
    () => selectedPlan?.options?.find((opt) => opt.id === selectedOptionId),
    [selectedPlan, selectedOptionId]
  );

  // ✅ Checkout logic
  const handleCheckout = useCallback(() => {
    const select =
      selectedPlan && selectedOptionId
        ? getPlanWithSelectedOption(selectedPlan, selectedOptionId)
        : null;

    if ((select && JSON.stringify(select) !== JSON.stringify(oldSelectedPlan))) {
      setSelectedPlan(select);
    }
    router.push(
      isDashboard
        ? "/finance/mining-plans/checkout"
        : "/mining-plans/checkout"
    );
  }, [
    isDashboard,
    oldSelectedPlan,
    router,
    selectedOptionId,
    selectedPlan,
    setSelectedPlan,
  ]);

  // ✅ Price calculations
  const {
    gpuTotal,
    basePrice,
    discount,
    grandTotal,
    finalTotal,
    discountAmount,
  } = useMemo(() => {
    const optionGpus =
      selectedOption?.gpus?.map((gpu) => ({
        ...gpu,
        fraction: gpu.fraction.toString(),
        pricePerGpu: gpu.pricePerGpu.toString(),
      })) ?? [];

    const gpuTotal = optionGpus.reduce(
      (sum, gpu) => sum + Number(gpu.pricePerGpu || 0),
      0
    );

    const basePrice = Number(selectedOption?.basePrice || 0);
    const discount = Number(selectedOption?.baseDiscount || 0);

    const monthlyTotal = basePrice + gpuTotal;
    const grandTotal =
      selectedOption?.type === "monthly"
        ? monthlyTotal
        : monthlyTotal * 12;

    const discountAmount =
      selectedOption?.type === "monthly"
        ? 0
        : (monthlyTotal * 12 * discount) / 100;

    const finalTotal = grandTotal - discountAmount;

    return {
      gpuTotal:selectedOption?.type === "monthly"?gpuTotal:12*gpuTotal,
      basePrice,
      discount,
      grandTotal,
      finalTotal,
      discountAmount,
    };
  }, [selectedOption]);

  // ✅ Error handling messages
  const errorMessages = useMemo(() => {
    const errors: string[] = [];
    if (!selectedPlan) errors.push("No plan selected.");
    if (!selectedOptionId) errors.push("No option selected.");
    if (!gpusList.length) errors.push("GPU list is empty.");
    return errors;
  }, [selectedPlan, selectedOptionId, gpusList]);

  if (errorMessages.length) {
    return (
      <section className="pt-8 border-t border-red-300 dark:border-red-600">
        <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400">
          Invoice Errors
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-red-600 dark:text-red-400">
          {errorMessages.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="pt-8 space-y-6 ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Invoice Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-start">
        {/* Plan Info */}
        <div className="space-y-3 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center font-medium text-gray-800 dark:text-gray-200 ">
            <span>Plan:</span>
            <span className="text-end sm:text-start">
              {selectedPlan?.title}
            </span>
          </div>
          {selectedOption && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Option Type:</span>
                <span className="text-end sm:text-start">
                  {selectedOption.type.charAt(0).toUpperCase() +
                    selectedOption.type.slice(1)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Mining cycle :</span>
                <span className="text-end sm:text-start">
                  {selectedOption.miningCycle} months
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between font-semibold text-gray-800 dark:text-gray-200">
                <span>Investment Amount:</span>
                <span className="text-end sm:text-start">
                      {finalTotal.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* GPU List */}
        <div className="space-y-2">
          {gpusList.map((gpu) => (
            <div
              key={gpu.gpuId}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-700 dark:text-gray-300"
            >
              <GpuInfo gpu={gpu} />
              <span className="mt-1 sm:mt-0 text-end sm:text-start">
          
                {isNaN(+gpu.pricePerGpu)
                  ? "0.00"
                  : (+(Number(gpu.pricePerGpu) *Number(gpu.quantity))*(selectedOption?.type === "monthly"?1:12)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 dark:text-gray-300">
            <span>GPUs Price:</span>
            <span className="text-end sm:text-start">
              {gpuTotal.toFixed(2)}
            </span>
          </div>
          {selectedOption && (
            <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 dark:text-gray-300">
              <span>Base Price:</span>
              <span className="text-end sm:text-start">
                {basePrice.toFixed(2)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 dark:text-gray-300">
            <span>Subtotal:</span>
            <span className="text-end sm:text-start">
              {grandTotal.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 dark:text-gray-300">
              <span>
                Discount ({discount}%):
              </span>
              <span className="text-end sm:text-start">
                -{discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex flex-col sm:flex-row sm:justify-between font-semibold text-lg text-gray-900 dark:text-gray-100">
            <span>Final Total:</span>
            <span className="text-end sm:text-start">
              {finalTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        {gpusList.length > 0 && (
          <div className="pt-4 flex justify-center sm:justify-end">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </section>
  );
};

export default InvoiceSummary;
