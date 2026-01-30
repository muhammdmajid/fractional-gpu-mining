"use client";

import React, { MouseEventHandler, useEffect, useMemo } from "react";
import { Loader, ChevronRight, XCircle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { Button, buttonVariants } from "@/ui/primitives/button";
import { Variant } from "../default/icon-text-button";

// 🔹 Variants with error styles
function getVariantStyles(variant: Variant, error?: boolean): string {
  if (!error) return "";
  const errorStyles: Record<Variant, string> = {
    link: "text-primary underline-offset-4 hover:underline",
    default: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
    destructive: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
    outline: "border border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950",
    secondary: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-200",
    ghost: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950",
  };
  return errorStyles[variant];
}

export type SubmitButtonProps = {
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  text?: string;
  BtnIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ErrorIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  LoadingIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  DisabledIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  loadingText?: string;
  errorText?: string;
  disabledText?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  isLeft?: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  error = false,
  disabled = false,
  text = "Continue",
  loadingText = "Signing...",
  errorText = "Try Again",
  disabledText = "Continue",
  BtnIcon = ChevronRight,
  ErrorIcon = XCircle,
  LoadingIcon = Loader,
  DisabledIcon = Ban,
  className,
  type = "submit",
  variant = "default",
  onClick,
  isLeft = false,
}) => {
  const fontSize = useResponsiveFont();
  const methods = useFormContext();

   // 🔹 Trigger validation only once on mount (no infinite loop)
  useEffect(() => {
    if (methods?.trigger) {
      methods.trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // 🔹 Centralized error state
  const hasError = Boolean(methods?.formState?.errors && Object.keys(methods.formState.errors).length);

  // 🔹 Decide final state
  const currentState = useMemo(() => {
    if (loading) return "loading";
    if (disabled || (type === "submit" && (loading || hasError))) return "disabled";
    if (error || (type === "submit" && hasError)) return "error";
    return "default";
  }, [loading, disabled, error, hasError, type]);

  // 🔹 Config for each state
  const stateConfig = {
    loading: {
      text: loadingText,
      icon: <LoadingIcon className="animate-spin" style={{ width: fontSize, height: fontSize }} />,
      disabled: true,
    },
    disabled: {
      text: disabledText,
      icon: <DisabledIcon style={{ width: fontSize, height: fontSize }} />,
      disabled: true,
    },
    error: {
      text: errorText,
      icon: <ErrorIcon style={{ width: fontSize, height: fontSize }} />,
      disabled: false,
    },
    default: {
      text,
      icon: <BtnIcon style={{ width: fontSize, height: fontSize }} />,
      disabled: false,
    },
  } as const;

  const { text: btnText, icon, disabled: isDisabled } = stateConfig[currentState];

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    methods?.trigger?.();
    onClick?.(e);
  };

  return (
    <Button
      type={type}
      name="submit"
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant }),
        "w-full cursor-pointer flex items-center justify-center gap-2",
        isLeft ? "flex-row-reverse" : "flex-row",
        className,
        getVariantStyles(variant, currentState === "error")
      )}
      style={{
        fontSize: `${fontSize}px`,
        height: `${2.5 * fontSize}px`,
        paddingLeft: `calc(${fontSize}px * 2 + ${fontSize}px)`,
        paddingRight: `calc(${fontSize}px * 2 + ${fontSize}px)`,
      }}
      {...(type !== "submit" && onClick ? { onClick: handleClick } : {})}
    >
      <span>{btnText}</span>
      {icon}
    </Button>
  );
};

export default SubmitButton;
