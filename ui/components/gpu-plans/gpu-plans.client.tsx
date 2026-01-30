/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/ui/primitives/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,

} from "@/ui/primitives/drawer";

import { PlansList } from "./plans-list";
import {  Inbox, Loader } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/primitives/tooltip";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useGPUPlans } from "@/providers/gpu-plans-provider";

export interface PlansProps {

}

export function GPUPlansClient({  }: PlansProps) {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen,miningPlansData } = useGPUPlans();

  if (!miningPlansData)
    return (
      <motion.span
        role="status"
        aria-label="Loading..."
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-flex h-6 w-6 items-center justify-center"
      >
        <Loader className="h-6 w-6 text-primary dark:text-primary" />
      </motion.span>
    );

  if (!miningPlansData || miningPlansData.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground dark:text-gray-400 cursor-pointer">
            <Inbox className="h-6 w-6" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          <p>No mining plans available</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      {!isMobile ? (
        <Sheet onOpenChange={setIsOpen} open={isOpen}>
          <SheetContent className="flex h-full w-[420px] flex-col p-0">
            <SheetHeader className=" hidden">
              <SheetTitle className="hidden"></SheetTitle>
            </SheetHeader>
            <SheetDescription className=" hidden"></SheetDescription>

            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <div className="text-xl font-semibold">Mining Plans</div>
                <div className="text-sm text-muted-foreground">
                  Choose a GPU mining plan that fits your needs.
                </div>
              </div>
            </div>
            <PlansList miningPlans={miningPlansData} />
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer onOpenChange={setIsOpen} open={isOpen}>
          <DrawerHeader className="hidden">
            <DrawerTitle className="hidden"></DrawerTitle>
            <DrawerDescription className="hidden"></DrawerDescription>
          </DrawerHeader>
          <DrawerContent className="flex h-full flex-col z-1005">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <div className="text-xl font-semibold">Mining Plans</div>
                <div className="text-sm text-muted-foreground">
                  Choose a GPU mining plan that fits your needs.
                </div>
              </div>
            </div>
            <PlansList miningPlans={miningPlansData} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
