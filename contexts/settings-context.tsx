"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

import type { SettingsType } from "@/types";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Default Settings
// ---------------------------------------------------------------------------
export const defaultSettings: SettingsType = {
  theme: "zinc",
  mode: "system",
  radius: 0.5,
  layout: "vertical",
};

// ---------------------------------------------------------------------------
// Context Definition
// ---------------------------------------------------------------------------
export const SettingsContext = createContext<
  | {
      settings: SettingsType;
      updateSettings: (newSettings: SettingsType) => void;
      resetSettings: () => void;
    }
  | undefined
>(undefined);

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsType | null>(null);

  // ------------------------------
  // Initialize settings from cookies or default
  // ------------------------------
  useEffect(() => {
    try {
      const stored = getCookie("settings");
      if (stored && typeof stored === "string") {
        setSettings(JSON.parse(stored));
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error("Failed to parse stored settings:", err);
      setSettings(defaultSettings);
    }
  }, []);

  // ------------------------------
  // Update settings and persist to cookie
  // ------------------------------
  const updateSettings = useCallback((newSettings: SettingsType) => {
    try {
      setCookie("settings", JSON.stringify(newSettings), {
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      setSettings(newSettings);
    } catch (err) {
      console.error("Failed to update settings cookie:", err);
    }
  }, []);

  // ------------------------------
  // Reset settings to default
  // ------------------------------
  const resetSettings = useCallback(() => {
    try {
      deleteCookie("settings");
      setSettings(defaultSettings);
    } catch (err) {
      console.error("Failed to reset settings cookie:", err);
    }
  }, []);

  // ------------------------------
  // Render children only when settings are ready
  // ------------------------------
  if (!settings) return null;

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
