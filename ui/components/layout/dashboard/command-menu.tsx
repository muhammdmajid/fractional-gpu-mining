"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import type { NavigationType,} from "@/types";
import type {
  NavigationNestedItem,
  NavigationRootItem,
} from "@/types"
import type { DialogProps } from "@radix-ui/react-dialog"

import { cn, isActivePathname, titleCaseToCamelCase } from "@/lib/utils"
import { navigationsData } from "@/data/navigations"

import { Badge } from "@/ui/primitives/badge"
import { Button } from "@/ui/primitives/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/primitives/collapsible"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/primitives/command"
import { DialogTitle } from "@/ui/primitives/dialog"
import { ScrollArea } from "@/ui/primitives/scroll-area"
import { DynamicIcon } from "../../dynamic-icon"
import { Keyboard } from "@/ui/primitives/keyboard"
import { UserDbType } from "@/lib/auth-types";

// Props for the CommandMenu
interface CommandMenuProps extends DialogProps {
  buttonClassName?: string;
    currentUser: UserDbType | null;
}

/**
 * 🔎 CommandMenu
 * - Global search + navigation menu
 * - Opens via Cmd+K / Ctrl+K / "/" or button
 * - Supports nested navigation items
 */
export function CommandMenu({ buttonClassName,currentUser, ...props }: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()


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
  // ================================
  // 🎹 Keyboard Shortcut Handling
  // ================================
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Run command and close dialog
  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // ================================
  // 📌 Render Navigation Items
  // ================================
  const renderMenuItem = (item: NavigationRootItem | NavigationNestedItem) => {
    const { title, label } = item

    // Nested group with collapsible
    if (item.items) {
      return (
        <Collapsible key={item.title} className="group/collapsible">
          <CommandItem asChild>
            <CollapsibleTrigger className="w-full flex justify-between items-center gap-2 px-2 py-1.5 [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center gap-2">
                {"iconName" in item && (
                  <DynamicIcon name={item.iconName} className="h-4 w-4" />
                )}
                <span>{title}</span>
                {"label" in item && <Badge variant="secondary">{label}</Badge>}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
            </CollapsibleTrigger>
          </CommandItem>
          <CollapsibleContent className="space-y-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            {item.items.map((subItem: NavigationNestedItem) =>
              renderMenuItem(subItem)
            )}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    // Simple link item
    if ("href" in item) {
      const isActive = isActivePathname(item.href, pathname)

      return (
        <CommandItem
          key={item.title}
          onSelect={() => runCommand(() => router.push(item.href))}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 capitalize",
            isActive && "bg-accent"
          )}
        >
          {"iconName" in item ? (
            <DynamicIcon name={item.iconName} />
          ) : (
            <DynamicIcon name="Circle" />
          )}
          <span>{title}</span>
          {label && <Badge variant="secondary" className="capitalize">{label}</Badge>}
        </CommandItem>
      )
    }
  }

  // ================================
  // 🎨 Render Component
  // ================================
  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "max-w-64 w-full justify-start px-3 rounded-md bg-muted/50 text-muted-foreground",
          buttonClassName
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search className="me-2 h-4 w-4" />
        <span>Search...</span>
        <Keyboard className="ms-auto">K</Keyboard>
      </Button>

      {/* Command Menu Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTitle className="sr-only">Search Menu</DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <ScrollArea className="h-[300px] max-h-[300px]">
            {navs.map((nav) => {
              const title = titleCaseToCamelCase(nav.title)

              return (
                <CommandGroup
                  key={nav.title}
                  heading={title}
                  className="[&_[cmdk-group-items]]:space-y-1 capitalize"
                >
                  {nav.items.map((item) => (
                    <Fragment key={item.title}>{renderMenuItem(item)}</Fragment>
                  ))}
                </CommandGroup>
              )
            })}
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  )
}
