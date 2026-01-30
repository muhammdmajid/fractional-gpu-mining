"use client";

import { ToggleMobileSidebar } from "../toggle-mobile-sidebar";
import { SidebarTrigger } from "@/ui/primitives/sidebar";
import { FullscreenToggle } from "../full-screen-toggle";
import { ModeToggle } from "../../../mode-toggle";
import { HeaderUserDropdown } from "@/ui/components/header-user";
// import { LanguageDropdown } from "@/components/language-dropdown"
// import { NotificationDropdown } from "@/components/layout/notification-dropdown"
// import { UserDropdown } from "@/components/layout/user-dropdown"
// import { ModeDropdown } from "@/components/mode-dropdown"

export function VerticalLayoutHeader() {
  return (
      <header className="sticky top-0 z-50 w-full bg-background border-b border-sidebar-border">
      <div className="container flex h-14 justify-between items-center gap-4">
        <ToggleMobileSidebar />
        <div className="grow flex justify-end gap-2">
          <SidebarTrigger className="hidden lg:flex lg:me-auto" />
          {/* <NotificationDropdown  /> */}
          <FullscreenToggle />
       <ModeToggle />
              {/*<LanguageDropdown dictionary={dictionary} />
          <UserDropdown dictionary={dictionary} locale={locale} /> */}
          <HeaderUserDropdown/>
        </div>
      </div>
    </header>
  );
}
