import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { PAYMENT_WITHDRAWAL_POLICY, SEO_CONFIG } from "@/config/index";

// =====================
// Config constants
// =====================
const PLATFORM_NAME = SEO_CONFIG.fullName ?? "Fractional GPU Mining";
const SUPPORT_EMAIL = SEO_CONFIG.seo?.schema?.contactPoint?.email ?? "support@example.com";
const SUPPORT_PHONE = SEO_CONFIG.seo?.schema?.contactPoint?.phone ?? "N/A";
const SEO_BASE_URL = SEO_CONFIG.seo?.baseUrl ?? "";

// Helper
const pct = (n: number) => `${Math.round(n * 100)}%`;

// =====================
// SEO metadata
// =====================
export const metadata: Metadata = {
  title: `${PLATFORM_NAME} | Payment & Withdrawal Policy`,
  description: `${PLATFORM_NAME} payment, withdrawal and mining fee policy. Includes deposits, lock periods, withdrawal fees, mining fees, KYC and dispute processes.`,
  alternates: { canonical: `${SEO_BASE_URL}${PAYMENT_WITHDRAWAL_POLICY.ROUTE}` },
  openGraph: {
    title: `${PLATFORM_NAME} | Payment & Withdrawal Policy`,
    description: `${PLATFORM_NAME} payment, withdrawal and mining fee policy.`,
    url: `${SEO_BASE_URL}${PAYMENT_WITHDRAWAL_POLICY.ROUTE}`,
    siteName: PLATFORM_NAME,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PLATFORM_NAME} | Payment & Withdrawal Policy`,
    description: `${PLATFORM_NAME} payment, withdrawal and mining fee policy.`,
  },
};

// =====================
// Viewport
// =====================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// =====================
// Page
// =====================
export default function FullPolicyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* JSON-LD Structured Data */}
      <Script id="policy-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${PLATFORM_NAME} | Payment & Withdrawal Policy`,
          datePublished: PAYMENT_WITHDRAWAL_POLICY.LAST_UPDATED,
          dateModified: PAYMENT_WITHDRAWAL_POLICY.LAST_UPDATED,
          author: { "@type": "Organization", name: PLATFORM_NAME },
          publisher: { "@type": "Organization", name: PLATFORM_NAME },
          mainEntityOfPage: `${SEO_BASE_URL}${PAYMENT_WITHDRAWAL_POLICY.ROUTE}`,
        })}
      </Script>

      {/* Page Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Payment & Withdrawal Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {PLATFORM_NAME} — Last updated {PAYMENT_WITHDRAWAL_POLICY.LAST_UPDATED}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">

          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5">Withdrawal fee: {pct(PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE)}</span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5">Mining usage fee: {pct(PAYMENT_WITHDRAWAL_POLICY.MINING_USAGE_FEE)}</span>
        </div>
      </header>

      {/* Local Table of Contents */}
      <nav aria-label="Table of contents" className="mb-12">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <li><a href="#introduction" className="underline-offset-2 hover:underline">Introduction</a></li>
          <li><a href="#platform-overview" className="underline-offset-2 hover:underline">Platform Overview</a></li>
          <li><a href="#payment-policy" className="underline-offset-2 hover:underline">Payment Policy</a></li>
          <li><a href="#withdrawal-policy" className="underline-offset-2 hover:underline">Withdrawal Policy</a></li>
          <li><a href="#fee-structure" className="underline-offset-2 hover:underline">Fee Structure</a></li>
          <li><a href="#responsibilities" className="underline-offset-2 hover:underline">User Responsibilities & Compliance</a></li>
          <li><a href="#platform-rights" className="underline-offset-2 hover:underline">Platform Rights</a></li>
          <li><a href="#support-dispute" className="underline-offset-2 hover:underline">Support & Dispute Resolution</a></li>
          <li><a href="#amendments" className="underline-offset-2 hover:underline">Amendments & Effective Date</a></li>
        </ol>
      </nav>

      {/* Introduction */}
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          This Payment & Withdrawal Policy explains how deposits, withdrawals, mining rewards and fees are handled on <strong>{PLATFORM_NAME}</strong>.
          It applies to all users of the platform. By using {PLATFORM_NAME}, you agree to the terms described in this policy.
        </p>
      </section>

      <hr className="my-8" />

      {/* Platform Overview */}
      <section id="platform-overview" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Platform Overview</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          {PLATFORM_NAME} provides fractional access to GPU resources for cryptocurrency mining (for example: Bitcoin, Ethereum-compatible workloads).
          Users can deposit funds, allocate them to mining contracts, receive mining rewards, and withdraw unlocked funds under the rules below.
        </p>
      </section>

      <hr className="my-8" />

      {/* Payment Policy */}
      <section id="payment-policy" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Payment Policy</h2>

        <h3 className="mt-5 text-lg font-medium">Accepted currencies & methods</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Supported cryptocurrencies (BTC, ETH, USDT) where applicable.</li>
          <li>Fiat via supported payment gateways (if enabled).</li>
        </ul>

        <div className="my-6 h-px w-full bg-border" />

        <h3 className="text-lg font-medium">Deposit process</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>
            Deposits must meet minimum ({PAYMENT_WITHDRAWAL_POLICY.MIN_DEPOSIT}) and maximum ({"MAX_DEPOSIT" in PAYMENT_WITHDRAWAL_POLICY ? PAYMENT_WITHDRAWAL_POLICY.MAX_DEPOSIT : "Defined by plan"}) limits.
          </li>
          <li>Deposits are reflected as <strong>Pending</strong> until confirmed on-chain or by gateway.</li>
          <li>Once approved by the platform, the full deposit amount is credited to your account balance.</li>
          <li>Deposited funds allocated to mining may be subject to a lock period of n days.</li>
        </ul>

        <div className="my-6 h-px w-full bg-border" />

        <h3 className="text-lg font-medium">Confirmation times & reversals</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Confirmation times depend on the underlying blockchain or payment gateway.</li>
          <li>Deposits completed on-chain are typically irreversible. Contact support for issues.</li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Withdrawal Policy */}
      <section id="withdrawal-policy" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Withdrawal Policy</h2>

        <h3 className="mt-5 text-lg font-medium">Eligibility</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>
            Only <strong>unlocked</strong> funds can be withdrawn. Locked funds become available after n days.
          </li>
          <li>Withdrawals require identity verification where applicable (KYC/AML).</li>
          <li>
            Minimum withdrawal: {"MIN_WITHDRAWAL" in PAYMENT_WITHDRAWAL_POLICY ? PAYMENT_WITHDRAWAL_POLICY.MIN_WITHDRAWAL : "Per plan"}. Maximum per
            transaction: {"MAX_WITHDRAWAL" in PAYMENT_WITHDRAWAL_POLICY ? PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL : "Per plan"}.
          </li>
        </ul>

        <div className="my-6 h-px w-full bg-border" />

        <h3 className="text-lg font-medium">Fees & processing</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Admin withdrawal fee: {pct(PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE)} of the withdrawal amount.</li>
          <li>Mining usage fee: {pct(PAYMENT_WITHDRAWAL_POLICY.MINING_USAGE_FEE)} deducted from mining rewards per cycle.</li>
          <li>Network fees (blockchain gas/tx fees) are additionally applied where relevant.</li>
          <li>Processing time is typically 24–72 hours pending security checks.</li>
        </ul>

        {/* Early withdrawal / special cases (alert style without component) */}
        <div
          role="alert"
          className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <h4 className="font-semibold">Early withdrawal / special cases</h4>
          <p className="mt-2 text-sm leading-6">
            If you withdraw mining-related earnings before the lock period ends, an early withdrawal penalty of
            {" "}
            {pct(PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE)} applies in addition to any standard fees. The platform may permit or
            disallow early withdrawals depending on contract terms.
          </p>
        </div>

        <div className="my-6 h-px w-full bg-border" />

        <h3 className="text-lg font-medium">Processing & split</h3>
        <p className="mt-3 leading-7 text-muted-foreground">
          Upon approval, the withdrawal amount is deducted from the user&apos;s account balance. The platform will credit the admin
          share (the fee) to its operational account and release the remaining funds to the user via the chosen payout method.
        </p>
      </section>

      <hr className="my-8" />

      {/* Fee Structure */}
      <section id="fee-structure" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Fee Structure</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Deposit fees: None (except network/gateway fees charged externally).</li>
          <li>Withdrawal fee: {pct(PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE)} of amount (platform fee).</li>
          <li>Mining service fee: {pct(PAYMENT_WITHDRAWAL_POLICY.MINING_USAGE_FEE)} of mining rewards per payout cycle.</li>
          <li>Network/transaction fees: Variable, charged by blockchain/gateways.</li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* User Responsibilities & Compliance */}
      <section id="responsibilities" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">User Responsibilities & Compliance</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Keep wallet credentials and account access secure.</li>
          <li>Comply with applicable laws for crypto usage in your jurisdiction.</li>
          <li>Provide truthful information for verification requests.</li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Platform Rights */}
      <section id="platform-rights" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Platform Rights</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>
            {PLATFORM_NAME} reserves the right to hold, delay or reject transactions suspected of fraud or money laundering.
          </li>
          <li>We may require additional documentation or KYC for large or suspicious transactions.</li>
          <li>We may change fee rates and terms; changes will be posted and notified to users.</li>
        </ul>
      </section>

      <hr className="my-8" />

      {/* Support & Dispute Resolution */}
      <section id="support-dispute" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Support & Dispute Resolution</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          For payment and withdrawal disputes, contact support at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-primary">{SUPPORT_EMAIL}</a> or call {SUPPORT_PHONE}. We aim to
          respond to support tickets within 48 hours.
        </p>
      </section>

      <hr className="my-8" />

      {/* Amendments & Effective Date */}
      <section id="amendments" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Amendments & Effective Date</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          This policy is effective as of {PAYMENT_WITHDRAWAL_POLICY.LAST_UPDATED}. {PLATFORM_NAME} may update this policy at any time. Users will be
          notified of material changes via the platform dashboard or email. Continued use of the platform after such notifications
          constitutes acceptance of the revised policy.
        </p>
      </section>
    </main>
  );
}


