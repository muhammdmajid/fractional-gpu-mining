"use client";

import Link from "next/link";

import { DropdownMenuItem, DropdownMenuSeparator } from "@/ui/primitives/dropdown-menu";
import { userMenuItems } from "@/data/navigations";

export function UserMenu() {
  try {
    if (!userMenuItems || userMenuItems.length === 0) {
      <></>
    }

    return (
      <><DropdownMenuSeparator />
        {userMenuItems.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link className="cursor-pointer" href={href}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
         <DropdownMenuSeparator />
      </>
    );
  } catch (error) {
    console.error("❌ UserMenu rendering error:", error);
    return (
      <DropdownMenuItem disabled>
        <span className="text-red-500">Error loading menu</span>
      </DropdownMenuItem>
    );
  }
}
