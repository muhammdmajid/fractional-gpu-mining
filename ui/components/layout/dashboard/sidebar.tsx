"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import type { NavigationType,} from "@/types";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  Sidebar as SidebarWrapper,
  useSidebar,
} from "@/ui/primitives/sidebar"
import { useSettings } from "@/lib/hooks/use-settings"
import { ScrollArea } from "@/ui/primitives/scroll-area"
import { NavigationNestedItem, NavigationRootItem } from "@/types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/primitives/collapsible"
import { DynamicIcon } from "../../dynamic-icon"
import { Badge } from "@/ui/primitives/badge"
import { isActivePathname } from "@/lib/utils"
import { CommandMenu } from "./command-menu"
import { navigationsData } from "@/data/navigations"
import { SEO_CONFIG } from "@/config/index"
import { UserDbType } from "@/lib/auth-types"

interface SidebarProps {
  currentUser: UserDbType | null;
}

export function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname()
  const { openMobile, setOpenMobile, isMobile } = useSidebar()
  const { settings } = useSettings();

const navs: NavigationType[] = [];
// Only add Dashboard if role is register
if (currentUser?.role === "register") {
  const dashboardMenu = navigationsData.find(
    (n): n is NavigationType => n.title.toLowerCase() === ("Dashboards").toLowerCase()
  );
  if (dashboardMenu) navs.push(dashboardMenu);
}

// Add Finance menu
const financeMenu = navigationsData.find(
  (n): n is NavigationType => n.title.toLowerCase()=== ("Finance").toLowerCase()
);
if (financeMenu) navs.push(financeMenu);

  

// Only add Dashboard if role is register
if (currentUser?.role === "register") {
  const referAndEarn = navigationsData.find(
    (n): n is NavigationType => n.title.toLowerCase() === ("Refer & Earn").toLowerCase()
  );
  if (referAndEarn) navs.push(referAndEarn);
}


if (currentUser?.role === "register") {
  const technicalSupport = navigationsData.find(
    (n): n is NavigationType => n.title.toLowerCase() === ("Technical Support").toLowerCase()
  );
  if (technicalSupport) navs.push(technicalSupport);
}
  // Hide sidebar if layout is horizontal and user is on desktop (we use a menubar in that case).
  const isHorizontalAndDesktop = settings.layout === "horizontal" && !isMobile
  if (isHorizontalAndDesktop) return null

  /**
   * Renders a single navigation item.
   * Handles both nested menus (collapsible) and direct links.
   */
  const renderMenuItem = (item: NavigationRootItem | NavigationNestedItem) => {
    const { title, label } = item

    // Case 1: Item has sub-items → render collapsible dropdown
    if ("items" in item && item.items) {
      return (
        <Collapsible className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center">
                {"iconName" in item && (
                  <DynamicIcon name={item.iconName} className="me-2 h-4 w-4" />
                )}
                <span>{title}</span>
                {"label" in item && (
                  <Badge variant="secondary" className="me-2">
                    {label}
                  </Badge>
                )}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuItem key={subItem.title}>
                  {renderMenuItem(subItem)}
                </SidebarMenuItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    // Case 2: Item is a direct link
    if ("href" in item) {
      const isActive = isActivePathname(item.href, pathname)

      return (
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setOpenMobile(!openMobile)}
          asChild
        >
          <Link href={item.href}>
            {"iconName" in item && (
              <DynamicIcon name={item.iconName} className="h-4 w-4" />
            )}
            <span>{title}</span>
            {"label" in item && <Badge variant="secondary">{label}</Badge>}
          </Link>
        </SidebarMenuButton>
      )
    }

    return null
  }

  return (
    <SidebarWrapper side="left">
      {/* Sidebar header with logo + command menu */}
      <SidebarHeader>
        <Link
          href="/"
          className="w-fit flex items-center gap-2 text-foreground font-black p-2 pb-0 mb-2"
          onClick={() => isMobile && setOpenMobile(!openMobile)}
        >
          <Image
            src="/logo.png"
            alt={`${SEO_CONFIG.name} Logo`}
            height={24}
            width={24}
            className="dark:invert"
          />
          <span>{SEO_CONFIG.name}</span>
        </Link>
        <CommandMenu buttonClassName="max-w-full"  currentUser={currentUser}/>
      </SidebarHeader>

      {/* Sidebar content with navigation */}
      <ScrollArea>
        <SidebarContent className="gap-0">
          {navs.map((nav) => (
            <SidebarGroup key={nav.title}>
              <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {renderMenuItem(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>
    </SidebarWrapper>
  )
}
