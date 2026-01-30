"use client"

import { useCallback } from "react"
import { MoonStar, Sun } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"
import { ModeType } from "@/types"
import { Toggle } from "@/ui/primitives/toggle"

export function ModeToggle() {
  const { settings, updateSettings } = useSettings()
  const mode = (settings.mode as "light" | "dark") ?? "dark" // 👈 fallback to dark

  const toggleMode = useCallback(() => {
    const nextMode: ModeType = mode === "light" ? "dark" : "light"
    updateSettings({ ...settings, mode: nextMode })
  }, [mode, settings, updateSettings])

  return (
    <Toggle
      pressed={mode === "dark"}
      onPressedChange={toggleMode}
      aria-label="Toggle theme mode"
      className="rounded-full p-2"
    >
      {mode === "light" ? (
        <Sun className="size-4" />
      ) : (
        <MoonStar className="size-4" />
      )}
    </Toggle>
  )
}
