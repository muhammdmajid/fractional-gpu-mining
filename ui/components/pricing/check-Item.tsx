import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckItemProps = {
  text: string;
};

const CheckItem: React.FC<CheckItemProps> = ({ text }) => {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0"
        aria-hidden="true"
      />
      <p
        className={cn(
          "text-sm leading-snug text-start" // base text style
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default CheckItem;
