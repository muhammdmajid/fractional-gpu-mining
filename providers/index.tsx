import type { ReactNode } from "react";
import { SettingsProvider } from "@/contexts/settings-context";
import { ModeProvider } from "./mode-provider";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/ui/primitives/sidebar";

import { TooltipProvider } from "@/ui/primitives/tooltip";


export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
  
      <SettingsProvider>
        <ModeProvider>
          <ThemeProvider>
            <TooltipProvider>
        
                <SidebarProvider>{children}</SidebarProvider>

            </TooltipProvider>
          </ThemeProvider>
        </ModeProvider>
      </SettingsProvider>
  
  );
}
