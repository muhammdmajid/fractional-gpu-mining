/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import {
  LogOut,
  UserIcon,
} from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/primitives/avatar"
import { Button } from "@/ui/primitives/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu"
import { UserMenu } from "./user-menu"
import { useCurrentUser } from "@/lib/auth-client"
import { Skeleton } from "../primitives/skeleton"

// Props (placeholder for now)
interface HeaderUserDropdownProps {}

export function HeaderUserDropdown({}: HeaderUserDropdownProps) {
  const { isPending, user,  } = useCurrentUser()

  // 1. Handle loading state
  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  }

  // 2. Handle no user state (unauthenticated)
  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    )
  }

  // ✅ Safe destructuring
  const { email = "", image = "", name = "User" } = user

  // Utility: render initials if no image
  const getInitials = (fullName: string): string =>
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  return (
    <DropdownMenu  >
      <DropdownMenuTrigger asChild>
        <Button
          className="relative overflow-hidden rounded-full"
          size="icon"
          variant="ghost"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage alt={name} src={image || undefined} />
            <AvatarFallback>
              {image ? null : getInitials(name) || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 z-10089">
        {/* User header */}
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarImage alt={name} src={image || undefined} />
            <AvatarFallback>
              {image ? null : getInitials(name) || <UserIcon className="h-4 w-4 text-primary" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{name}</p>
            {email && (
              <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </div>

        

        {/* ✅ User navigation menu */}
        <UserMenu />

        {/* ✅ Log out */}
        <DropdownMenuItem asChild className={cn("cursor-pointer text-red-600")}>
          <Link href="/auth/sign-out">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
