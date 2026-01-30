"use client";

import { cn } from "@/lib/utils";
import { ComponentType, SVGProps } from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/ui/primitives/button";

export type Variant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";
// Define buttonVariants
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-800 hover:text-white shadow-xs dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900",

        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:text-white shadow-xs focus-visible:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white dark:hover:text-white dark:focus-visible:ring-red-800",

        outline:
          "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 shadow-xs dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-100",

        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-slate-100",

        ghost:
          "text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900",

        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary dark:text-sky-400 dark:hover:text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);



// Props interface
interface IconTextButtonProps {
  text: string;
  className?: string;
  classNameIcn?: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  fontSize: number;
  iconProps?: SVGProps<SVGSVGElement>;
  variant?: Variant;

}

// Component
export default function IconTextButton({
  text,
  Icon,
  fontSize,
  className,
  classNameIcn,
  iconProps,
  variant = "default",

  ...props
}: IconTextButtonProps) {
  return (
    <Button
variant={"ghost"}
      className={cn(
        buttonVariants({ variant }),
        className
      )}
      style={{
        fontSize: `${fontSize}px`,
        padding: `${0.8 * fontSize}px`,
      }}
      {...props}
    >
      <Icon
        className={cn("mr-1", classNameIcn)}
        style={{ width: `${fontSize}px`, height: `${fontSize}px` }}
        {...iconProps}
      />
      {text}
    </Button>
  );
}
