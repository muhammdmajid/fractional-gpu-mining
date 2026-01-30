"use client";

import { CheckCircle } from "lucide-react";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  message: string | null;
  className?: string;
}

export default function SuccessMessage({
  message,
  className = "",
}: SuccessMessageProps) {
  const fontSize = useResponsiveFont();
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-md my-auto",
        className
      )}
      style={{ fontSize: `${0.8 * fontSize}px` }}
    >
      <CheckCircle
        className="flex-shrink-0 m-0 p-0"
        style={{ width: `${fontSize}px`, height: `${fontSize}px` }}
      />
      <p className="m-0 p-0 w-full">{message}</p>
    </div>
  );
}
