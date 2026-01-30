"use client"

import { Button } from "@/ui/primitives/button"
import { useSidebar } from "@/ui/primitives/sidebar"
import { PanelLeft } from "lucide-react"


export function ToggleMobileSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        onClick={() => setOpenMobile(!openMobile)}
        aria-label="Toggle Sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
    )
  }
}