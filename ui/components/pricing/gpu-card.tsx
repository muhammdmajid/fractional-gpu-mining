import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { SelectedGpu } from "@/types/mining-plans";
import { Button } from "@/ui/primitives/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/ui/primitives/card";
import { useCallback } from "react";

interface GpuCardProps {
  item: SelectedGpu;
  setGpusList: React.Dispatch<React.SetStateAction<SelectedGpu[]>>;
  handleRemove: (id: string) => void;
  isCustom?:boolean;
}

export const GpuCard: React.FC<GpuCardProps> = ({
  item,
  setGpusList,
  handleRemove,
  isCustom=false
}) => {
  const { gpus: availableGpus,} = useGPUPlans();

  // Safe getter with fallback values
  const getGpuDetails = useCallback(
    (id: string) => {
      if (!id) {
        console.error("Invalid GPU ID provided:", id);
        return null;
      }

      const gpu = availableGpus.find((g) => g.id === id);
      if (!gpu) {
        console.warn(`GPU with ID ${id} not found in available plans.`);
      }

      return (
        gpu ?? {
          model: "Unknown GPU",
          memory: "N/A",
          hashRate: "N/A",
          powerConsumption: "N/A",
          fraction: "N/A",
          pricePerGpu: "0",
        }
      );
    },
    [availableGpus]
  );

  const gpu = getGpuDetails(item.gpuId);

  // Quantity decrement with guard
  const handleDecrement = () => {
    try {
      setGpusList((prev) =>
        prev.map((it) =>
          it.gpuId === item.gpuId
            ? { ...it, quantity: Math.max(1, it.quantity - 1) } // Never go below 1
            : it
        )
      );
    } catch (error) {
      console.error("Failed to decrement quantity:", error);
    }
  };

  // Quantity increment with guard
  const handleIncrement = () => {
    try {
      setGpusList((prev) =>
        prev.map((it) =>
          it.gpuId === item.gpuId ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
    } catch (error) {
      console.error("Failed to increment quantity:", error);
    }
  };

  // Safe price calculation
  const pricePerUnit = Number(item.pricePerGpu);
  const totalPrice =
    isNaN(pricePerUnit) || pricePerUnit < 0
      ? 0
      : pricePerUnit * Math.max(1, item.quantity);

  return (
    <Card className="flex flex-col justify-between p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <CardHeader className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {gpu?.model}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          High-performance GPU
        </p>
      </CardHeader>

      {/* Specs */}
      <CardContent className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-start">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-medium">Memory:</span> {gpu?.memory}
          </li>
          <li>
            <span className="font-medium">Hash Rate:</span> {gpu?.hashRate}
          </li>
          <li>
            <span className="font-medium">Power:</span> {gpu?.powerConsumption}
          </li>
          {/* <li>
            <span className="font-medium">Fraction:</span>{" "}
            {item.fraction ?? "N/A"}
          </li>
          <li>
            <span className="font-medium">Price:</span> $
            {isNaN(pricePerUnit) ? "0" : pricePerUnit.toFixed(2)}
          </li> */}
        </ul>
      </CardContent>

      {isCustom?<CardFooter className="flex flex-col gap-4">
        {/* Quantity + Total */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              −
            </Button>

            <span className="min-w-[28px] text-center font-medium">
              {item.quantity}
            </span>

            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleIncrement}
            >
              +
            </Button>
          </div>

          <p className="font-semibold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          onClick={() => {
            try {
              handleRemove(item.gpuId);
            } catch (error) {
              console.error("Failed to remove GPU:", error);
            }
          }}
          variant="destructive"
          size="sm"
          className="w-full rounded-xl font-medium"
        >
          Remove
        </Button>
      </CardFooter>:null}
    </Card>
  );
};
