"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // utility for conditional classNames
import useResponsiveFont from "@/lib/hooks/use-responsive-font";

interface ErrorMessageProps {
  error?: string | Error | string[] | null;
  className?: string;
}

export default function ErrorMessage({ error, className = "" }: ErrorMessageProps) {
  const fontSize = useResponsiveFont();

  if (!error) return null;

  // Convert different error types into a readable string
  const errorMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : Array.isArray(error)
      ? error.join(", ")
      : "An unexpected error occurred";

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-md my-auto",
        className
      )}
      style={{ fontSize: `${0.8 * fontSize}px` }}
    >
      <AlertCircle
        className="flex-shrink-0 m-0 p-0"
        style={{ width: `${fontSize}px`, height: `${fontSize}px` }}
      />
      <div className="m-0 p-0  w-full">{errorMessage}</div>
    </div>
  );
}
