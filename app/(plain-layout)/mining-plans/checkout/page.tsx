// app/checkout/page.tsx
import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@/config/index";
import { CheckoutClient } from "@/app/(plain-layout)/mining-plans/checkout/page.client";
import BackButton from "@/ui/components/default/back-button";
import ErrorMessage from "@/ui/components/default/error-message";
import { FinancialAccountsBundle } from "@/types/user-wallet-account";
import { fetchServerData } from "@/lib/fetch-utils";
import { getTransactionsByUserId } from "@/actions/transaction/get-transactions-by-userId";
import { getCurrentUserOrRedirect } from "@/lib/auth";

// ✅ Correct place for viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `Checkout | ${SEO_CONFIG.name}`,
  description:
    "Secure checkout process. Review your selected mining plan, confirm details, and complete your purchase safely.",
  robots: "index, follow",
  openGraph: {
    title: `Checkout | ${SEO_CONFIG.name}`,
    description:
      "Secure checkout process. Review your selected mining plan, confirm details, and complete your purchase safely.",
    url: SEO_CONFIG.seo.baseUrl + "/checkout",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Checkout | ${SEO_CONFIG.name}`,
    description:
      "Secure checkout process. Review your selected mining plan, confirm details, and complete your purchase safely.",
  },
};

export default async function CheckoutPage() {

    //  ✅ Protect page (redirect if not logged in)
    // Fetch current user or redirect
   await getCurrentUserOrRedirect("/auth/sign-in");
    
  const { data: financialAccounts, message: transactionsError } =
    await fetchServerData<FinancialAccountsBundle>(
      () => getTransactionsByUserId(),
      "get-transactions-by-user-id"
    );
  return (
    <>
      {transactionsError ? (
        <ErrorMessage error={transactionsError} className="my-3" />
      ) : (
        <>
          <BackButton href="/mining-plans" text="Back" />
          <CheckoutClient financialAccounts={financialAccounts} />
        </>
      )}
    </>
  );
}
