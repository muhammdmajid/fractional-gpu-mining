"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/primitives/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/ui/primitives/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/ui/primitives/drawer";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";

// ---------------------- Error Boundary ----------------------
class ContentErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("GenericDialogDrawer content error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 dark:text-red-400 text-sm">
          <p className="font-semibold">
            Something went wrong while rendering content.
          </p>
          {this.state.error && <p className="mt-1">{this.state.error}</p>}
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------- Generic Header ----------------------
interface GenericHeaderProps {
  title: React.ReactNode;     // ✅ ReactNode instead of string
  subtitle?: React.ReactNode; // ✅ ReactNode instead of string
}

export const GenericHeader = ({ title, subtitle }: GenericHeaderProps) => {
  return (
    <DialogHeader className="border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-900">
      <DialogTitle
        className={cn(
          "font-semibold tracking-tight",
          "text-slate-800 dark:text-slate-100",
          "text-sm sm:text-md md:text-lg lg:text-xl"
        )}
      >
        {title || "Untitled"}
      </DialogTitle>

      <DialogDescription
        className={cn(
          "mt-1",
          "text-xs sm:text-sm md:text-md",
          "text-slate-600 dark:text-slate-400",
          subtitle ? "block" : "hidden" // ✅ conditionally show/hide
        )}
      >
        {subtitle}
      </DialogDescription>

    </DialogHeader>
  );
};

// ---------------------- Main Generic Component ----------------------
interface GenericDialogDrawerProps {
  title?: React.ReactNode;     // ✅ updated
  subtitle?: React.ReactNode;  // ✅ updated
  tooltip?: string;
  size?: "default" | "icon" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggerClick?: () => void;

  /** 👇 Custom content renderer */
  renderContent?: (close: React.ElementType) => React.ReactNode;
}

export function GenericDialogDrawer({
  title = "Dialog",
  subtitle,
  tooltip,
  size = "default",
  className,
  disabled = false,
  children,
  open,
  onOpenChange,
  onTriggerClick,
  renderContent,
}: GenericDialogDrawerProps) {
  const isMobile = useIsMobile();
  const fontSize = useResponsiveFont();
  const lineHeight = fontSize * 1.5;

  // ---------------------- Trigger Button ----------------------
  const TriggerButton = (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "gap-1.5 border-0 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent dark:text-slate-100 shadow-none cursor-pointer [&>svg]:w-3.5 [&>svg]:h-3.5",
        size === "icon" ? "w-7 h-7" : "h-7",
        `text-[${fontSize}px] leading-[${lineHeight}px] p-[${fontSize}px]`,
        className
      )}
      disabled={disabled}
      onClick={onTriggerClick}
    >
      {children}
    </Button>
  );

  const TriggerWithTooltip = tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{TriggerButton}</TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="border bg-accent font-semibold text-foreground dark:bg-zinc-900 dark:text-slate-100 dark:border-slate-700 [&>span]:hidden"
      >
        <p style={{ fontSize, lineHeight: `${lineHeight}px` }}>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    TriggerButton
  );

  // ---------------------- Default Content ----------------------
  const DefaultContent = ({
    CloseComponent,
  }: {
    CloseComponent: typeof DialogClose | typeof DrawerClose;
  }) => (
    <>
      <p className="mb-4 text-muted-foreground dark:text-gray-400 text-start text-sm">
        No content provided.
      </p>

      <CloseComponent asChild>
        <Button variant="secondary" className="mt-4">
          Close
        </Button>
      </CloseComponent>
    </>
  );

  // ---------------------- Return UI ----------------------
  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{TriggerWithTooltip}</DrawerTrigger>
      <DrawerContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <GenericHeader title={title} subtitle={subtitle} />
        <ContentErrorBoundary>
          <div
            className="
              p-2 sm:p-3 md:p-3 lg:p-4 2xl:p-5
              flex-1 min-h-0
              overflow-y-auto
              bg-white dark:bg-slate-900 space-y-2
            "
            style={{ maxHeight: "80vh" }}
          >
            {renderContent ? (
              renderContent(DrawerClose)
            ) : (
              <DefaultContent CloseComponent={DrawerClose} />
            )}
          </div>
        </ContentErrorBoundary>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{TriggerWithTooltip}</DialogTrigger>
      <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 p-0 m-0 flex flex-col z-1000">
        <GenericHeader title={title} subtitle={subtitle} />
        <ContentErrorBoundary>
          <div
            className="
              p-2 sm:p-3 md:p-3 lg:p-4 2xl:p-5
              flex-1 min-h-0
              overflow-y-auto
              bg-white dark:bg-slate-900 space-y-2 z-10
            "
            style={{ maxHeight: "80vh" }}
          >
            {renderContent ? (
              renderContent(DrawerClose)
            ) : (
              <DefaultContent CloseComponent={DrawerClose} />
            )}
          </div>
        </ContentErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
