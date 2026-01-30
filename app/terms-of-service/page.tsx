import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config/index";

// ================================
// ⚙️ Local Constants
// ================================
const PLATFORM_NAME = SEO_CONFIG.fullName;
const SUPPORT_EMAIL = SEO_CONFIG.siteInfo.email;
const SUPPORT_PHONE = SEO_CONFIG.siteInfo.phone;
const SEO_BASE_URL = SEO_CONFIG.seo.baseUrl;
const LAST_UPDATED = "August 28, 2025";

// ================================
// 🔍 Metadata
// ================================
export const metadata: Metadata = {
  title: `${PLATFORM_NAME} | Terms of Service`,
  description: `Review the Terms of Service for ${PLATFORM_NAME}. Understand your rights, responsibilities, and platform policies.`,
  alternates: { canonical: `${SEO_BASE_URL}/terms-of-service` },
  openGraph: {
    title: `${PLATFORM_NAME} | Terms of Service`,
    description: `Official Terms of Service and user agreement for ${PLATFORM_NAME}.`,
    url: `${SEO_BASE_URL}/terms-of-service`,
    siteName: PLATFORM_NAME,
    type: "article",
    images: [{ url: SEO_CONFIG.seo.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PLATFORM_NAME} | Terms of Service`,
    description: `Official Terms of Service for ${PLATFORM_NAME}.`,
    site: SEO_CONFIG.seo.twitterSite,
    creator: SEO_CONFIG.seo.twitterCreator,
  },
};

// ================================
// 🖥️ Viewport
// ================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ================================
// 📄 Page Component
// ================================
export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* JSON-LD Structured Data */}
      <Script id="terms-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${PLATFORM_NAME} | Terms of Service`,
          datePublished: LAST_UPDATED,
          dateModified: LAST_UPDATED,
          author: { "@type": "Organization", name: PLATFORM_NAME },
          publisher: {
            "@type": "Organization",
            name: PLATFORM_NAME,
            logo: { "@type": "ImageObject", url: SEO_CONFIG.seo.ogImage },
          },
          mainEntityOfPage: `${SEO_BASE_URL}/terms-of-service`,
        })}
      </Script>

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {PLATFORM_NAME} — Last updated {LAST_UPDATED}
        </p>
      </header>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="mb-12">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <li><a href="#acceptance" className="underline-offset-2 hover:underline">Acceptance of Terms</a></li>
          <li><a href="#services" className="underline-offset-2 hover:underline">Description of Services</a></li>
          <li><a href="#responsibilities" className="underline-offset-2 hover:underline">User Responsibilities</a></li>
          <li><a href="#payments" className="underline-offset-2 hover:underline">Payments & Fees</a></li>
          <li><a href="#intellectual" className="underline-offset-2 hover:underline">Intellectual Property</a></li>
          <li><a href="#limitations" className="underline-offset-2 hover:underline">Limitations of Liability</a></li>
          <li><a href="#termination" className="underline-offset-2 hover:underline">Termination</a></li>
          <li><a href="#governing-law" className="underline-offset-2 hover:underline">Governing Law</a></li>
          <li><a href="#contact" className="underline-offset-2 hover:underline">Contact Information</a></li>
        </ol>
      </nav>

      {/* Acceptance of Terms */}
      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          By using or accessing the {PLATFORM_NAME} platform (“Platform”), you agree to these Terms of Service and all applicable laws and regulations. 
          If you do not agree, you must discontinue using the Platform immediately.
        </p>
      </section>

      <hr className="my-8" />

      {/* Description of Services */}
      <section id="services" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">2. Description of Services</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          {PLATFORM_NAME} provides a decentralized GPU-sharing ecosystem enabling users to rent or share GPU computing resources for cryptocurrency mining, AI tasks, and Web3 applications.
        </p>
      </section>

      <hr className="my-8" />

      {/* User Responsibilities */}
      <section id="responsibilities" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Use the Platform in compliance with all applicable laws and regulations.</li>
          <li>Safeguard your account credentials and wallets.</li>
          <li>Do not engage in illegal, fraudulent, or malicious activities.</li>
          <li>Ensure payment and withdrawal details are accurate and up to date.</li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Payments & Fees */}
      <section id="payments" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">4. Payments & Fees</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          All transactions are governed by our{" "}
          <a href="/payment-withdrawal-policy" className="underline text-primary underline-offset-4 hover:no-underline">
            Payment & Withdrawal Policy
          </a>. Applicable fees, minimums, and limits are defined within that document.
        </p>
      </section>

      <hr className="my-8" />

      {/* Intellectual Property */}
      <section id="intellectual" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          All intellectual property rights in {PLATFORM_NAME}’s content, trademarks, and software remain the sole property of the company or its licensors. 
          Unauthorized use, reproduction, or modification is strictly prohibited.
        </p>
      </section>

      <hr className="my-8" />

      {/* Limitation of Liability */}
      <section id="limitations" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          {PLATFORM_NAME} shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Platform, 
          including but not limited to loss of profits or data.
        </p>
      </section>

      <hr className="my-8" />

      {/* Termination */}
      <section id="termination" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">7. Termination</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          We may suspend or terminate user access to the Platform without notice if these Terms are violated or fraudulent activity is detected.
        </p>
      </section>

      <hr className="my-8" />

      {/* Governing Law */}
      <section id="governing-law" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">8. Governing Law</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          These Terms are governed by and construed under the laws of the United Arab Emirates, without regard to its conflict of law rules.
        </p>
      </section>

      <hr className="my-8" />

      {/* Contact */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">9. Contact Information</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          If you have questions about these Terms, contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-primary">{SUPPORT_EMAIL}</a>{" "}
          or call {SUPPORT_PHONE}.
        </p>
      </section>
    </main>
  );
}
