import { CardHeader, CardTitle } from "@/ui/primitives/card";
import { motion } from "framer-motion";
import { MiningPlanFull, MiningPlanOptionWithGpus } from "@/types/mining-plans";
import { cn } from "@/lib/utils";

// ============ Utils ============
const formatPrice = (priceStr?: string) => {
  if (!priceStr) return "Custom";
  const price = parseFloat(priceStr);
  if (isNaN(price)) return "N/A";
  return `$${price.toLocaleString()}`;
};

// ============ Sub Components ============
const DiscountBadge = ({
  discount,
  isCustom,
}: {
  discount?: number;
  isCustom?: boolean;
}) => {
  if (!discount) return null;
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute right-4 top-4 z-10"
    >
      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
        {isCustom ? "Custom" : `${discount}% OFF`}
      </span>
    </motion.div>
  );
};

const PlanTitle = ({ title }: { title?: string }) => (
  <CardTitle className="text-2xl font-bold tracking-tight light:text-gray-900 dark:text-gray-100">
    {title || "Untitled Plan"}
  </CardTitle>
);

const PlanPrice = ({
  price,
  isCustom,
  type,
}: {
  price?: string;
  isCustom?: boolean;
  type: string;
}) => (
  <div className="flex items-end gap-2">
    <h3 className="text-5xl font-extrabold light:text-gray-900 dark:text-gray-100">
      {isCustom ? "Custom" : formatPrice(price)}
    </h3>
    <span className="text-sm mb-1 light:text-gray-500 dark:text-gray-400">
      {type === "yearly" ? "/year" : "/month"}
    </span>
  </div>
);

const PlanDescription = ({ description }: { description?: string }) => (
  <p className={cn("text-sm text-start line-clamp-4")}>
    {description || "No description available."}
  </p>
);

// ============ Main Component ============
interface HeaderProps {
  miningPlan: MiningPlanFull;
  option: MiningPlanOptionWithGpus;
}

export default function PricingCardHeader({ miningPlan, option }: HeaderProps) {
  return (
    <>
      <DiscountBadge
        discount={option?.baseDiscount ?? 0}
        isCustom={miningPlan?.custom ?? false}
      />

      <CardHeader className="pb-6 pt-6 space-y-4">
        <PlanTitle title={miningPlan.title} />
        <PlanPrice
          price={option.totalPrice}
          isCustom={miningPlan?.custom ?? false}
          type={option?.type ?? "monthly"} // fallback to 'monthly' if type is missing
        />
        <PlanDescription description={miningPlan.description} />
      </CardHeader>
    </>
  );
}
