"use client";

import { Gpu, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SEO_CONFIG } from "@/config/index";
import { useCurrentUser } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import { Button } from "@/ui/primitives/button";
import { Skeleton } from "@/ui/primitives/skeleton";
import { HeaderUserDropdown } from "../header-user";
import { ModeToggle } from "../mode-toggle";
import { Badge } from "@/ui/primitives/badge";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { motion } from "framer-motion";
import { dashboardNavigation, mainNavigation } from "@/data/navigations";

interface HeaderProps {
  children?: React.ReactNode;
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const { isPending, user } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setIsOpen, selectedPlan, isOpen } = useGPUPlans();

  const isDashboard = Boolean(user);

  const navigation = isPending
    ? []
    : isDashboard
      ? dashboardNavigation
      : mainNavigation;

  const renderContent = () => (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: !isOpen ? 0 : -100, // top → bottom when open
        opacity: !isOpen ? 1 : 0,
      }}
      exit={{ y: 100, opacity: 0 }} // bottom → top when closing
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        !isOpen ? "sticky top-0 z-1000" : "relative"
      )}
    >
      <div
        className={`
          container mx-auto  px-4
          sm:px-6
          lg:px-8
        `}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2" href="/">
              <span
                className={cn(
                  "text-xl font-bold",
                  !isDashboard &&
                    `
                      bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                      tracking-tight text-transparent
                    `
                )}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <nav
              className={`
                hidden
                md:flex
              `}
            >
              <ul className="flex items-center gap-6">
                {isPending
                  ? Array.from({ length: navigation.length }).map((_, i) => (
                      <li key={i}>
                        <Skeleton className="h-6 w-20" />
                      </li>
                    ))
                  : navigation
                      .filter(
                        (item): item is { href: string; name: string } => !!item
                      ) // filter out undefined
                      .map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/" &&
                            pathname?.startsWith(item.href));

                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isActive
                                  ? "font-semibold text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isPending ? (
              <Skeleton className={`h-9 w-9 rounded-full`} />
            ) : (
              <Button
                aria-label="Open plans"
                className="relative h-8 w-8 rounded-full"
                size="icon"
                variant="outline"
                onClick={() => setIsOpen(true)}
              >
                <Gpu />
                {selectedPlan && (
                  <Badge
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] leading-none"
                    variant="default"
                  >
                    1
                  </Badge>
                )}
              </Button>
            )}
            {/* 
            {isPending ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <NotificationsWidget />
            )} */}

            {showAuth && (
              <div
                className={`
                  hidden
                  md:block
                `}
              >
                {user ? (
                  <HeaderUserDropdown />
                ) : isPending ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/sign-in">
                      <Button size="sm" variant="ghost">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isPending ? (
              <Skeleton className={`h-9 w-9 rounded-full`} />
            ) : (
              <ModeToggle />
            )}

            {/* Mobile menu button */}
            <Button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="icon"
              variant="ghost"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-b px-4 py-3">
            {isPending
              ? Array.from({ length: navigation.length }).map((_, i) => (
                  <div className="py-2" key={i}>
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))
              : navigation
                  .filter(
                    (item): item is { href: string; name: string } => !!item
                  ) // filter out undefined
                  .map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href));

                    return (
                      <Link
                        href={item.href}
                        key={item.name}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-base font-medium",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted/50 hover:text-primary"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
          </div>

          {showAuth && !user && (
            <div className="space-y-1 border-b px-4 py-3">
              <Link
                className={`
                  block rounded-md px-3 py-2 text-base font-medium
                  hover:bg-muted/50
                `}
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                className={`
                  block rounded-md bg-primary px-3 py-2 text-base font-medium
                  text-primary-foreground
                  hover:bg-primary/90
                `}
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </motion.header>
  );

  return renderContent();
}
