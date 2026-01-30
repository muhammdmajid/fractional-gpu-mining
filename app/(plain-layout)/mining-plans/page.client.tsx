"use client";

import { useState, useEffect } from "react";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { MiningPlanFull, SelectedGpu } from "@/types/mining-plans";
import { BillingCycleSelect } from "@/ui/components/pricing/price-card-billing-cycle-select";
import GpuConfigurator from "@/ui/components/pricing/gpu-configurator";
import InvoiceSummary from "@/ui/components/pricing/invoice-summary";
import { getPlanWithSelectedOption } from "@/ui/components/pricing/pricing-card-footer";

interface GPUMiningPlanClientProps {
  isDashboard?: boolean; // optional prop to adjust layout for dashboard
}

export function GPUMiningPlanClient({
  isDashboard = false,
}: GPUMiningPlanClientProps) {
  const { miningPlansData, selectedPlan, clearGPUPlans } = useGPUPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string | "">();
  const [selectedOptionId, setSelectedOptionId] = useState<string | "">();
  const [selectionPlan, setSelectionPlan] = useState<MiningPlanFull | null>(
    null
  );
 
  const [gpusList, setGpusList] = useState<SelectedGpu[]>([]);

  // Reset selection when miningPlansData changes
  useEffect(() => {
    setSelectedPlanId("");
    setSelectedOptionId("");
    setGpusList([]);
    setSelectionPlan(null);
  }, [miningPlansData]);

  // Handle plan change
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    clearGPUPlans();
    setSelectedOptionId("");
    setGpusList([]);
    setSelectionPlan(miningPlansData.find((p) => p.id === planId) || null);
  };

  // Handle billing cycle option change
  const handleOptionChange = (optionId: string) => {
    setSelectedOptionId(optionId);

    const selectedOption = selectionPlan?.options?.find(
      (opt) => opt.id === optionId
    );
    if (
      !selectedOption ||
      !Array.isArray(selectedOption.gpus) ||
      selectedOption.gpus.length === 0
    )
      return;
    const gpus = selectedOption.gpus;
    const updatedList: SelectedGpu[] = [];
    gpus.forEach((gpu) => {
      const existing = updatedList.find((item) => item.gpuId === gpu.id);
      if (existing) {
        existing.quantity += 1; // Increase quantity if already exists
      } else {
        updatedList.push({
          gpuId: gpu.id,
          fraction: gpu.fraction,
          pricePerGpu: gpu.pricePerGpu,
          quantity: 1,
        });
      }
    });
    setGpusList(updatedList);
  };

  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.id);
      setSelectedOptionId(selectedPlan.selectedOption.id);
      setSelectionPlan(
        getPlanWithSelectedOption(selectedPlan, selectedPlan.selectedOption.id)
      );
      if (selectedPlan.selectedOption?.selectedgpus) {
        const updatedList: SelectedGpu[] = [];

        selectedPlan.selectedOption.selectedgpus.forEach((gpu) => {
          const existing = updatedList.find((item) => item.gpuId === gpu.id);
          if (existing) {
            existing.quantity += 1; // Increase quantity if already exists
          } else {
            updatedList.push({
              gpuId: gpu.id,
              fraction: gpu.fraction,
              pricePerGpu: gpu.pricePerGpu,
              quantity: 1,
            });
          }
        });

        setGpusList(updatedList);
      }
    }
  }, [selectedPlan]);
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 text-center">
      {/* Hero Section */}
      {!isDashboard ? (
        <header className="mx-auto text-center mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Flexible GPU Mining Plans
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            High-performance GPU hosting tailored for cryptocurrency mining —
            optimized for efficiency, scalability, and cost, with dedicated
            support for your mining operations.
          </p>
        </header>
      ) : null}

      {/* Custom Plans Selection */}
      {miningPlansData.length > 0 && (
        <section className="w-full mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Select Your Mining Plan
          </h2>
          <div className="space-y-4">
            {miningPlansData
              .slice() // create a copy so original array is not mutated
              .sort((a, b) => a.priority - b.priority) // descending: highest priority first
              .map((plan) => (
                <button
                  key={plan.id}
                  className={`w-full text-left px-6 py-4 border rounded-xl hover:shadow-lg transition ${
                    selectedPlanId === plan.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                  onClick={() => handlePlanChange(plan.id)}
                >
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Selected Plan Details */}
      {selectionPlan && (
        <div className="w-full py-5 px-0 space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {selectionPlan.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {selectionPlan.description}
            </p>

            {/* Plan Options (Billing Cycle) */}
            {selectionPlan?.options && selectionPlan?.options?.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Available Options</h3>
                <BillingCycleSelect
                  miningPlan={selectionPlan}
                  selectedId={selectedOptionId}
                  onChange={handleOptionChange}
                  className="mb-6"
                />
              </div>
            )}
          </section>

          {/* GPU Configurator */}
          {selectedOptionId && (
            <GpuConfigurator
                selectedPlan={selectionPlan}
              selectedOptionId={selectedOptionId}
              gpusList={gpusList}
              setGpusList={setGpusList}
              isCustom={Boolean(selectionPlan?.custom)}
            />
          )}

          {/* Invoice Summary */}
          {selectedOptionId && gpusList.length > 0 && (
            <InvoiceSummary
              selectedPlan={selectionPlan}
              selectedOptionId={selectedOptionId}
              gpusList={gpusList}
              isDashboard={isDashboard}
            />
          )}
        </div>
      )}
    </section>
  );
}
