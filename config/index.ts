// ================================
// 🌐 SEO + System Configuration
// ================================


export const SEO_CONFIG = {
  // 🔖 Brand & Identity
  fullName: "Fractional GPU Mining Platform", // Full platform name
  name: "Fractional GPU",                // Short brand name
  slogan: "Mining power made affordable and accessible.", // Catchy tagline
  logoSrc: `${process.env.NEXT_PUBLIC_APP_URL!}/logo.png`,   // Path to primary logo
  logobgSrc: `${process.env.NEXT_PUBLIC_APP_URL!}/logo.png`, // Optional background/alt logo

  // 📝 General Description
  description:
    "Fractional GPU Mining is a next-generation platform that allows users to rent or share GPU power for crypto mining, AI workloads, and Web3 applications. Affordable, scalable, and decentralized GPU resources without owning expensive hardware.",

  // 👤 Author / Organization Info
  author: {
    name: "Fractional GPU Team",
    facebookLink: "https://facebook.com/",
    authorUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/about`,
  },

  // 📇 Contact & Social Information
  siteInfo: {
    email: "admin@fgpumining.site",
    phone: "+971-50-123-4567",
    address: "123 Sheikh Zayed Road, Dubai, United Arab Emirates",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d925149.3304236719!2d54.04430157928438!3d25.072578887162763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1759466972770!5m2!1sen!2s",
    socialMediaLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com/in",
    },
  },

  // ================================
  // 🔍 SEO Metadata Configuration
  // ================================
  seo: {
    // 🌐 Basic Info
    siteName: "Fractional GPU Mining Platform",
    title: "Fractional GPU Mining Platform – Affordable & Scalable GPU Power",
    description:
      "Fractional GPU Mining is a next-generation platform for renting and sharing GPU power for crypto mining, AI workloads, and Web3 applications. Affordable, scalable, and decentralized GPU resources at your fingertips.",

    // 🏷️ Expanded Keywords (30+ optimized for crypto, AI, Web3)
    keywords: [
      "Fractional GPU",
      "GPU Mining Platform",
      "Shared GPU Power",
      "Rent GPU for Mining",
      "Bitcoin Mining",
      "Cryptocurrency Mining",
      "Ethereum Mining",
      "Altcoin Mining",
      "Decentralized GPU Resources",
      "Cloud GPU Rentals",
      "AI GPU Workloads",
      "Blockchain Computing",
      "Crypto Mining Platform",
      "Cost-Efficient GPU Computing",
      "Web3 GPU Mining",
      "Mining as a Service",
      "GPU Cloud for Crypto",
      "Scalable Crypto Mining",
      "Affordable GPU Mining",
      "Crypto GPU Sharing",
      "GPU for Deep Learning",
      "AI Cloud GPUs",
      "Blockchain Infrastructure",
      "Decentralized Cloud Platform",
      "Crypto Web3 Cloud",
      "DeFi GPU Mining",
      "Metaverse GPU Cloud",
      "NFT GPU Computing",
      "GPU Acceleration for AI",
      "Sustainable Crypto Mining",
      "High Performance GPU Cloud",
      "Crypto Mining with AI"
    ],

    // 🖼️ Open Graph (Facebook, LinkedIn previews)
    ogImage: `${process.env.NEXT_PUBLIC_APP_URL!}/og.jpg`,
    ogType: "website",
    ogLocale: "en_US",
    ogUrl: process.env.NEXT_PUBLIC_APP_URL!,

    // 🐦 Twitter Card (Twitter/X SEO)

    twitterSite: "@fractionalgpu", // Replace with your Twitter handle
    twitterCreator: "@fractionalgpu",

    // 📜 Schema.org Structured Data (Google Rich Snippets)
    schema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Fractional GPU Mining Platform",
      url: process.env.NEXT_PUBLIC_APP_URL!,
      logo: `${process.env.NEXT_PUBLIC_APP_URL!}/logo.png`,
      sameAs: [
        "https://facebook.com/",
        "https://twitter.com/",
        "https://linkedin.com/",
        "https://instagram.com/"
      ],
      description:
        "Fractional GPU Mining Platform allows users to rent or share GPU power for mining and AI workloads. Decentralized, affordable, and scalable cloud GPU resources.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "",
        phone: "",
        url: `${process.env.NEXT_PUBLIC_APP_URL!}/contact`
      }
    },

    // 🌐 Canonical Base URL
    baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
  },
};

export const PAYMENT_WITHDRAWAL_POLICY = {
  ADMIN_USER_NAME: "Admin",
  ADMIN_USER_EMAIL: "admin@fgpumining.site",
  ADMIN_WALLET_NAME: "ADMIN_WALLET",
  ADMIN_WALLET_CURRENCY: "USDT",
  ROUTE: "/payment-withdrawal-policy" as const,
  LAST_UPDATED: "August 28, 2025" as const,
  WITHDRAWAL_CHARGE: 0.02 as const, // 02%
  MINING_USAGE_FEE: 0.20 as const,  // 20%
  MIN_DEPOSIT: 1 as const,         // in USD/USDT equivalent
  MAX_DEPOSIT: 100000 as const,
  MIN_WITHDRAWAL: 1 as const,
  MAX_WITHDRAWAL: 50000 as const,
   // ✅ Constants for referral rewards
   DEFAULT_REWARD_AMOUNT : "1.0",
   DEFAULT_REWARD_CURRENCY :"USDT",
  // ---------------------- CONSTANT ACCOUNT INFO ----------------------
  FINANCE_ACCOUNT_NAME: "BNB Smart Chain(BEP20)",
  FINANCE_ACCOUNT_NUMBER: "0xa359b4db7bc68e05ff3329806aa48ebd69276b8f",
  CURRENCIES: ["USDT"]
} as const;


// ================================
// ⚙️ System Configuration
// ================================
export const SYSTEM_CONFIG = {
  redirectBeforeSignIn: "/auth/sign-in",
  redirectAfterSignIn: "/dashboard/overview",
  redirectAfterSignUp: "/dashboard/overview",

};

// ================================
// 👨‍💻 Admin Configuration
// ================================
export const ADMIN_CONFIG = {
  displayEmails: false,
};

// ================================
// 🐞 Database Debug Logger
// ================================
export const DB_DEV_LOGGER = false;







