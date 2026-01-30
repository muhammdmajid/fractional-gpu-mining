import type { FooterDashbaordLink, FooterSection, NavigationType, UserMenuItem } from "@/types";
import { BarChart, UserIcon, Settings, Upload, Shield, ChartPie, Home, CreditCard } from "lucide-react";
export const navigationsData: NavigationType[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Overview",
        href: "/dashboard/overview",
        iconName: "ChartPie", // general stats
      },
      {
        title: "Mining",
        href: "/dashboard/mining-stats",
        iconName: "Cpu", // GPU and hash rate info
      },
      {
        title: "Profit",
        href: "/dashboard/mining-profit",
        iconName: "DollarSign"

      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        title: "Wallets",
        iconName: "Wallet",
        items: [
          {
            title: "Wallets",
            href: "/finance/wallets"
          },
          {
            title: "Deposit",
            href: "/finance/deposit"

          },
          {
            title: "Withdrawal",
            href: "/finance/withdrawal"

          },
        ],
      },
      {
        title: "Mining Plan",
        iconName: "Activity",
        href: "/finance/mining-plans",

      },
    ],
  }

  ,
  {
    title: "Refer & Earn",
    items: [
      {
        title: "Earnings",
        iconName: "Wallet", // track rewards/earnings
        href: "/refer-earn/earnings",
      },
      {
        title: "Referrals",
        iconName: "UserPlus", // people you referred
        href: "/refer-earn/referrals",
      },

    ],
  },
   {
    title: "Technical Support",
    items: [

      {
        title: "Support",
        href: "/support",
        iconName: "Mail",
      },
    ],
  },




  // {
  //   title: "Management",
  //   items: [

  //     {
  //       title: "Alerts & Notifications",
  //       href: "/management/alerts",
  //       iconName: "Bell",
  //     },
  //     {
  //       title: "Settings",
  //       href: "/management/settings",
  //       iconName: "Settings",
  //     },
  //   ],
  // },
  // {
  //   title: "Support",
  //   items: [
  //     {
  //       title: "Help Center",
  //       href: "/support/help-center",
  //       iconName: "Headset",
  //     },
  //     {
  //       title: "FAQ",
  //       href: "/support/faq",
  //       iconName: "Info",
  //     },
  //     {
  //       title: "Contact",
  //       href: "/support/contact",
  //       iconName: "Mail",
  //     },
  //   ],
  // },
];

// ✅ Menu items as array of objects
export const userMenuItems: UserMenuItem[] = [
  // { href: "/", label: "Home", icon: Home },


  // { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  // { href: "/dashboard/settings", label: "Settings", icon: Settings },
  // { href: "/dashboard/uploads", label: "Uploads", icon: Upload },
  // { href: "/admin/summary", label: "Admin", icon: Shield },
];


export const mainNavigation = [
  { href: "/", name: "Home" },
    { href: "/gallery", name: "Gallery", },
  { href: "/faqs", name: "Faq's" },
  { href: "/mining-plans", name: "Mining Plans", },

  { href: "/about-us", name: "About Us", },

];

export const dashboardNavigation = [
  { href: "/", name: "Home" },
  { href: "/dashboard/overview", name: "Dashboard" },,
];



export const FOOTER_LINKS: FooterSection[] = [
  {
    name: "Company",
 links: [
      { label: "About Us", url: "/about-us" },      
      { label: "Gallery", url: "/gallery" },           
      { label: "Mining Plans", url: "/mining-plans" },  
      { label: "FAQs", url: "/faqs" },                  
      { label: "Contact Us", url: "/contact-us" },      
    ],
  },
  {
    name: "Support",
    links: [
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Terms of Service", url: "/terms-of-service" },
      { label: "Payment & Withdrawal Policy", url: "/payment-withdrawal-policy" },
    ],
  },
];



export const footerDashbaordLink: FooterDashbaordLink[] = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  // { label: "Cookies", href: "/" },
  // { label: "Sitemap", href: "/" },
]