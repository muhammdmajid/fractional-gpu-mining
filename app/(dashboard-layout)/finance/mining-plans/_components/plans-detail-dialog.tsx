"use client";

import { FC, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Separator } from "@/ui/primitives/separator";

import { MiningPlanFull } from "@/types/mining-plans";

interface PlansDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: MiningPlanFull | null;
  optionId?: string;
}

const PlansDetailDialog: FC<PlansDetailDialogProps> = ({
  open,
  onOpenChange,
  plan,
  optionId,
}) => {
  const displayedOptions = useMemo(() => {
    if (!Array.isArray(plan?.options)) return [];

    if (optionId) {
      const match = plan?.options?.find((opt) => opt.id === optionId);
      return match ? [match] : [];
    }

    return plan?.options ?? [];
  }, [plan, optionId]);

  // ✅ Pick selected option for calculations
  const selectedOption = useMemo(() => {
    if (!Array.isArray(plan?.options)) return null;
    if (optionId) {
      return plan.options.find((opt) => opt.id === optionId) ?? null;
    }
    return plan.options[0] ?? null;
  }, [plan, optionId]);

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
        fraction: gpu.fraction?.toString(),
        pricePerGpu: gpu.pricePerGpu?.toString(),
      })) ?? [];

    const gpuTotal = optionGpus.reduce(
      (sum, gpu) => sum + Number(gpu.pricePerGpu || 0),
      0
    );

    const basePrice = Number(selectedOption?.basePrice || 0);
    const discount = Number(selectedOption?.baseDiscount || 0);

    const monthlyTotal = basePrice + gpuTotal;
    const grandTotal =
      selectedOption?.type === "monthly" ? monthlyTotal : monthlyTotal * 12;

    const discountAmount =
      selectedOption?.type === "monthly"
        ? 0
        : (monthlyTotal * 12 * discount) / 100;

    const finalTotal = grandTotal - discountAmount;

    return {
      gpuTotal: selectedOption?.type === "monthly" ? gpuTotal : 12 * gpuTotal,
      basePrice,
      discount,
      grandTotal,
      finalTotal,
      discountAmount,
    };
  }, [selectedOption]);

  if (!plan) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
              ⚠️ Plan not found
            </DialogTitle>
            <DialogDescription>
              Unable to load details for this mining plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            {plan.title ?? `Plan #${plan.id ?? "N/A"}`}
          </DialogTitle>
          <DialogDescription>
            Full details of this mining plan.
          </DialogDescription>
        </DialogHeader>

        {/* Plan Details */}
        <section className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-sm sm:text-base">
            <span className="font-medium">Plan ID:</span>
            <span className="col-span-2">{plan.id ?? "N/A"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm sm:text-base">
            <span className="font-medium">Description:</span>
            <span className="col-span-2 break-words">
              {plan.description || "No description available."}
            </span>
          </div>

          {Array.isArray(plan?.features) && plan.features.length > 0 ? (
            <div className="text-sm sm:text-base">
              <span className="block font-medium mb-1">Features:</span>
              <ul className="list-disc list-inside space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No features listed.
            </p>
          )}
        </section>

        <Separator className="my-4" />

        {/* Billing Cycles */}
        {selectedOption && displayedOptions.length > 0 ? (
          <div className="mt-4 p-4 rounded-lg bg-muted text-sm space-y-2">
            <h4 className="font-semibold">Price Breakdown</h4>
            <div className="grid grid-cols-2 gap-2">
              <span>GPU Total:</span>
              <span className="text-right">
                {gpuTotal} {selectedOption.currency ?? ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span>Base Price:</span>
              <span className="text-right">
                {basePrice} {selectedOption.currency ?? ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span>Discount:</span>
              <span className="text-right">{discount}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span>Grand Total:</span>
              <span className="text-right">
                {grandTotal} {selectedOption.currency ?? ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span>Discount Amount:</span>
              <span className="text-right">
                {discountAmount} {selectedOption.currency ?? ""}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-semibold">
              <span>Final Total:</span>
              <span className="text-right">
                {finalTotal} {selectedOption.currency ?? ""}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600 dark:text-red-400 mt-4">
            {optionId
              ? "⚠️ Selected billing option not found."
              : "No billing options available."}
          </p>
        )}

        <DialogFooter className="mt-6">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlansDetailDialog;
