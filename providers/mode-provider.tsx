"use client";

import { useIsDarkMode } from "@/lib/hooks/use-mode";
import { useEffect } from "react";

import type { ReactNode } from "react";

const defaultModes = ["light", "dark"];

export function ModeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useIsDarkMode();
  const mode = isDarkMode ? "dark" : "light";

  useEffect(() => {
    const rootElement = document.documentElement;

    // Update class names in the <html> tag
    rootElement.classList.remove(...defaultModes);
    rootElement.classList.add(mode);
  }, [mode]);

  return <>{children}</>;
}
