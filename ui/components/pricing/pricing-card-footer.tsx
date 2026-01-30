import { CardFooter } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import {
  MiningPlanFull,
  MiningPlanSelected,
} from "@/types/mining-plans";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { cn } from "@/lib/utils";
import { BillingCycleSelect } from "./price-card-billing-cycle-select";

interface FooterProps {
  miningPlan: MiningPlanFull;
  isCart: boolean;

}

export function getPlanWithSelectedOption(
  miningPlan: MiningPlanFull,
  optionId: string
): MiningPlanSelected | null {
  const selectedOption = miningPlan?.options?.find(
    (option) => option.id === optionId
  );

  if (
    !selectedOption ||
    !selectedOption.gpus ||
    !Array.isArray(selectedOption.gpus) ||
    selectedOption.gpus.length === 0
  ) {
    return null;
  }

  // Map GPUs into lowercase 'selectedgpus' to match type
  const optionWithSelectedGpus = {
    ...selectedOption,
    selectedgpus: selectedOption.gpus.map((gpu) => gpu),
  };

  return {
    ...miningPlan,
    selectedOption: optionWithSelectedGpus,
  };
}
export default function PricingCardFooter({
  miningPlan,

  isCart,
}: FooterProps) {
  const { selectedPlan, setSelectedPlan ,setIsOpen} = useGPUPlans();



  const handlePlanSelect = (optionId: string) => {
    const select = miningPlan
      ? getPlanWithSelectedOption(miningPlan, optionId)
      : null;

    if (select) {
      setSelectedPlan(select);
    }
  };

  return (
    <CardFooter className="mt-4">
      {isCart ? (
        <>
          <div className="mt-2 w-full">
          
              <BillingCycleSelect
                miningPlan={miningPlan}
                selectedId={selectedPlan?.selectedOption?.id}
                onChange={handlePlanSelect}
                className="mb-6"
              />
           
          </div>
        </>
      ) : (
        <>
      
          <Button
            size="lg"
              onClick={() =>{
                  handlePlanSelect(
                    selectedPlan?.selectedOption?.id ?? "default"
                  );setIsOpen(true);
                }
                }
            className={cn(
              "w-full py-3 px-6 font-semibold rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
              "light:bg-gradient-to-r light:from-indigo-500 light:via-violet-500 light:to-purple-500 light:text-white",
              "dark:bg-gradient-to-r dark:from-indigo-600 dark:via-violet-500 dark:to-purple-600 dark:text-white"
            )}
          >
            {miningPlan.actionLabel || "Select Plan"}
          </Button>
        </>
      )}
    </CardFooter>
  );
}
