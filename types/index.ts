/* eslint-disable @typescript-eslint/no-explicit-any */

import { radii, themes } from "@/themes";
import type { LucideIcon } from "lucide-react"
import { icons } from "lucide-react";
import { ComponentType, JSX, SVGAttributes } from "react";

import type { SQL } from "drizzle-orm";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type EmptyProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  keyof React.ComponentProps<T>
>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface QueryBuilderOpts {
  where?: SQL;
  orderBy?: SQL;
  distinct?: boolean;
  nullish?: boolean;
}

// Type for individual links in a footer section
type FooterLink = {
  label: string; // Display text for the link
  url: string;   // URL or href the link points to
};

// Type for a footer section containing a title and optional links
export type FooterSection = {
  name: string;        // Section title, e.g., "Shop", "Company"
  links?: FooterLink[]; // Array of links; optional
};

export type Feature= {
  title: string;
  description: string;
  icon: React.ReactNode;
}




// Type for field-level validation errors

export type FieldErrors = {
  [key: string]: {
    message?: string; // optional error message for the field
  };
};

// Generic server response structure for consistent API responses
export type ServerResponse<
  TData = any,                                  // Data returned from the server (default: any)
  TError = string | FieldErrors,                // Error type (string for general errors or FieldErrors for field-specific)
  TMessage = string,                            // Optional descriptive message (default: string)
  TStatus = string | "idle" | "success" | "loading" | "error", // Response status (typed + custom)
> = {
  error?: TError;       // Holds error details if request failed
  message?: TMessage;   // Human-readable message for client
  data?: TData;         // Payload/data when request is successful
  status?: TStatus;     // Current status of request (e.g., "loading", "success", "error")
  success: boolean;     // Indicates if operation succeeded (true/false)
  statusCode?: number;  // Optional HTTP status code (e.g., 200, 400, 500)
}


export type ThemeType = keyof typeof themes
export type ModeType = "light" | "dark" | "system"
export type RadiusType = (typeof radii)[number]

export type LayoutType = "vertical" | "horizontal"

export type SettingsType = {
  theme: ThemeType
  mode: ModeType
  radius: RadiusType
  layout: LayoutType
}


export type FooterDashbaordLink = {
  label: string
  href: string
}

export type DynamicIconNameType = keyof typeof icons
export interface NavigationType {
  title: string
  items: NavigationRootItem[]
}

export type NavigationRootItem =
  | NavigationRootItemWithHrefType
  | NavigationRootItemWithItemsType

export interface NavigationRootItemBasicType {
  title: string
  label?: string
  iconName: DynamicIconNameType
}

export interface NavigationRootItemWithHrefType
  extends NavigationRootItemBasicType {
  href: string
  items?: never
}

export interface NavigationRootItemWithItemsType
  extends NavigationRootItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
}

export interface NavigationNestedItemBasicType {
  title: string
  label?: string
}

export interface NavigationNestedItemWithHrefType
  extends NavigationNestedItemBasicType {
  href: string
  items?: never
}

export interface NavigationNestedItemWithItemsType
  extends NavigationNestedItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
}

export type NavigationNestedItem =
  | NavigationNestedItemWithHrefType
  | NavigationNestedItemWithItemsType


// ✅ Define type for user menu items
export type UserMenuItem = {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  color?: string
}
export type IconType = ComponentType<IconProps> | LucideIcon;

// types/index.ts

export type ActivityTimelineType = {
  period: string
  activities: ActivityItem[]
}

// Status types
export type ActivityStatus =
  | "Idle"
  | "Request_Sent"
  | "Request_Received"
  | "In_Process"
  | "Pending"
  | "Completed"
  | "Failed"

// Activity types
export type ActivityType = "send" | "withdraw"

// Icon types
export type ActivityIcon = "ArrowUpRight" | "ArrowDownRight"
export type ActivityItem = {
  title: string
  description: string
  date: string // ISO date string
  type: ActivityType
  iconName: ActivityIcon
  fill?: string // optional custom dot background color
  status?: ActivityStatus
  assignedMembers?: Array<AssignedMember>
}

export type AssignedMember = {
  name: string
  avatar: string
  href: string
}



// Types for FAQ data
export interface FAQItem {
  question: string;
  answer: JSX.Element;
  isHighlighting?: boolean; // optional property to mark highlighted FAQs
}

export interface FAQSection {
  category: string;
  items: FAQItem[];
}
