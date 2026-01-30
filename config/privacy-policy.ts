import { SEO_CONFIG } from ".";

export const privacyPolicyConfig = {
  companyName: "Fractional GPU Mining",
  effectiveDate: "2025-01-01", // YYYY-MM-DD
  contactEmail: `${SEO_CONFIG.siteInfo.email}`,
  sections: {
    introduction: [
      `Welcome to Fractional GPU Mining ("we," "our," "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.`,
    ],
    information: [
      "Name and email address (if you create an account).",
      "Wallet addresses for crypto transactions.",
      "Usage data, including pages visited, clicks, and time spent.",
      "Mining performance and allocation data linked to your fractional GPU share.",
    ],
    usage: [
      "Providing and managing fractional GPU mining services.",
      "Processing payments and payouts.",
      "Improving website performance and user experience.",
      "Communicating with you about updates, support, and security.",
      "Complying with legal and regulatory requirements.",
    ],
    sharing: [
      "We do not sell your personal data. However, we may share your information with:",
      "Service providers (payment processors, hosting providers, analytics tools).",
      "Legal authorities when required by law.",
      "Business partners if necessary for delivering mining-related services.",
    ],
    security: [
      "We use industry-standard security measures to protect your data, including encryption, secure servers, and access controls.",
      "However, no system is 100% secure, and we cannot guarantee absolute security.",
    ],
    cookies: [
      "Track website performance.",
      "Store user preferences.",
      "Analyze traffic and improve services.",
      "You can manage cookies through your browser settings.",
    ],
    rights: [
      "Access, update, or delete your personal information.",
      "Opt-out of marketing communications.",
      "Request a copy of your stored data.",
      "Withdraw consent where applicable.",
      `To exercise these rights, contact us at: ${SEO_CONFIG.siteInfo.email}.`,
    ],
    children: [
      "Our services are not intended for children under 18. We do not knowingly collect information from minors.",
    ],
    changes: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date."',
    ],
    contact: [
      `If you have questions about this Privacy Policy, contact us at: ${SEO_CONFIG.siteInfo.email}.`,
    ],
  },
};
