// app/checkout/page.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import Checkout from "./_component/checkout";
import { useCurrentUser } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/primitives/card";
import { Skeleton } from "@/ui/primitives/skeleton";
import { Separator } from "@/ui/primitives/separator";
import {
  AccountInfo,
  FinancialAccountsBundle,
} from "@/types/user-wallet-account";
import AccountSelector from "@/app/(dashboard-layout)/finance/wallets/_component/account-selector";
import CreateFinanceAccount from "@/app/(dashboard-layout)/finance/wallets/_component/create-finance-account";
import { Button } from "@/ui/primitives/button";
import DepositFormWithPlans from "@/app/(dashboard-layout)/finance/deposit/_components/deposit-form-with-plan";
import { calculatePlansTotals } from "@/lib/utils";

// ✅ Loading/Pending component
function CheckoutSkeleton() {
  return (
    <Card className="w-full mt-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Details Skeleton */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex justify-between text-sm items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>

        {/* Financial Summary Skeleton */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 space-y-3">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>

          <Separator className="my-2 dark:bg-gray-700" />

          <div className="flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-11 w-full rounded-xl mt-4" />
      </CardContent>
    </Card>
  );
}

interface CheckoutClientProps {
  financialAccounts: FinancialAccountsBundle | null;
}

export function CheckoutClient({ financialAccounts }: CheckoutClientProps) {
  const router = useRouter();

  const { selectedPlan, miningPlansData } = useGPUPlans();
  const { user, isPending } = useCurrentUser();
  const accounts = financialAccounts?.accounts ?? [];

  // 🔹 Current selected account (default to the first one if available)
  const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(
    accounts.length > 0 ? accounts[0] : null
  );

    const { grandTotal } = useMemo(
      () => calculatePlansTotals(selectedPlan),
      [selectedPlan]
    );
  

  // 🚀 redirect to /mining-plans if nothing is selected
  useEffect(() => {
    if (!selectedPlan) {
      router.push(user ? "/finance/mining-plans" : "/mining-plans");
    }
  }, [selectedPlan, router, user]);

  if (!selectedPlan) {
    return null; // already redirecting
  }

  // 🚀 Show pending state while loading user
  if (isPending) {
    return <CheckoutSkeleton />;
  }

  // 🚀 If user not signed in, show Sign In button
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-3">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Please Sign In
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              You need to sign in before checking out.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full rounded-xl font-semibold text-base sm:text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              size="lg"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-6 w-full">
        <CreateFinanceAccount />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 text-start">
      {/* Hero Section */}
      <header className="mx-auto text-center mb-12 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Checkout
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
          Review your selected GPU mining plan, confirm details, and complete
          your purchase securely. Start mining with powerful, optimized hardware
          backed by dedicated support.
        </p>
      </header>

      {/* Account Selector */}
      <AccountSelector
        accountInfo={accounts}
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
      />

      {currentAccount &&
        (!isNaN(Number(currentAccount.balance)) &&
        Number(currentAccount.balance) >= grandTotal? (
          <Checkout currentAccount={currentAccount} />
        ) : (<div className="my-3">
          <DepositFormWithPlans
            plans={miningPlansData ?? []}
            currentAccount={currentAccount}
              defaultSelectedPlanId={selectedPlan.id}
              defaultSelectedOptionId={selectedPlan.selectedOption.id}
          /></div>
        ))}
    </section>
  );
}
