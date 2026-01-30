"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {  SEO_CONFIG } from "@/config/index"
import { FooterDashbaordLink } from "@/types"
import { footerDashbaordLink } from "@/data/navigations"


interface FooterDashbaordProps {
  className?: string
  links?: FooterDashbaordLink[]
}

export default function FooterDashboard({ className, links }: FooterDashbaordProps) {


  const footerLinks = links ?? footerDashbaordLink

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 md:flex-row py-6 border-t px-3",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {SEO_CONFIG.name}. All rights reserved.
      </p>

      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        {footerLinks.map((link,index) => (
          <Link
            key={`${link.href}-${index}-${link.label}`}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
