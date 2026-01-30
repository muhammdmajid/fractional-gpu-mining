"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/ui/primitives/form";
import { AccountInfo } from "@/types/user-wallet-account";
import { Card, CardHeader, CardContent, CardTitle } from "@/ui/primitives/card";
import {
  SelectTransaction,
  SelectTransactionPublic,
} from "@/types/transaction";
import { WalletInfo } from "../../_components/wallet-info";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { useCurrentUser } from "@/lib/auth-client";
import { ServerResponse } from "@/types";
import { sendDepositRequest } from "@/actions/transaction/send-deposit-request";
import { toast } from "sonner";
import { Separator } from "@/ui/primitives/separator";
import { Skeleton } from "@/ui/primitives/skeleton";
import { ArrowDownToLine, Loader2, Banknote } from "lucide-react";
import { MiningPlanFull, MiningPlanOptionWithGpus } from "@/types/mining-plans";
import { PlanAndBillingCycleSelect } from "../../mining-plans/_components/plan-select-with-details";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { sendDepositRequestWithPlan } from "@/actions/transaction/send-deposit-request-with-plan";
import { useRouter } from "next/navigation";

// ----- Props & Types -----
interface DepositFormWithPlansProps {
  plans: MiningPlanFull[] | null;
  currentAccount: AccountInfo;
  transactions?: SelectTransactionPublic[];
  setTransactions?: React.Dispatch<
    React.SetStateAction<SelectTransactionPublic[]>
  >;
  // ✅ NEW optional defaults
  defaultSelectedPlanId?: string;
  defaultSelectedOptionId?: string;
}

// ----- Zod Schema -----
export const depositSchema = z.object({
  thirdpartyTransactionId: z
    .string()
    .min(5, "Transaction ID must be at least 5 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a number greater than 0",
  }),
});

export type FormValues = z.infer<typeof depositSchema>;

const DepositFormWithPlans: FC<DepositFormWithPlansProps> = ({
  currentAccount,
  transactions,
  setTransactions,
  defaultSelectedPlanId,
  defaultSelectedOptionId,
}) => {
  const { miningPlansData, selectedPlan, clearGPUPlans } = useGPUPlans();
  const { user, isPending } = useCurrentUser();
  const router = useRouter();

  // ✅ Initialize state with props if provided
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(
    defaultSelectedPlanId
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    defaultSelectedOptionId
  );
  const [usePlan, setUsePlan] = useState(true); // ✅ NEW toggle state

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      thirdpartyTransactionId: "",
      amount: "0.0",
    },
    mode: "all",
  });

  const { watch, handleSubmit, reset, formState, setValue } = methods;
  const thirdpartyTransactionId =
    watch("thirdpartyTransactionId") || "[Please specify]";

  // ✅ Get selected option
  const displayedOption: MiningPlanOptionWithGpus | null = useMemo(() => {
    const selectedPlan = miningPlansData?.find(
      (plan) => plan.id === selectedPlanId
    );
    if (!selectedPlan || !selectedPlan.options) return null;
    if (!selectedOptionId) return null;
    return (
      selectedPlan.options.find((opt) => opt.id === selectedOptionId) ?? null
    );
  }, [miningPlansData, selectedPlanId, selectedOptionId]);

  // ✅ Update amount field when plan changes
  useEffect(() => {
    if (usePlan && displayedOption?.totalPrice) {
      setValue("amount", displayedOption.totalPrice, { shouldValidate: true });
    } else if (!usePlan) {
      setValue("amount", "0.0");
    }
  }, [usePlan, displayedOption, setValue]);

  // ✅ Handle Deposit
  const handleDepositRequest = async (data: FormValues) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let response: ServerResponse<SelectTransaction>;

      if (usePlan) {
        // Deposit with GPU plan
        if (!selectedPlanId || !selectedOptionId) {
          setErrorMessage("Please select a mining plan and billing option");
          toast.error("Please select a mining plan and billing option");
          setLoading(false);
          return;
        }

        response = await sendDepositRequestWithPlan(
          currentAccount.id,
          Number(data.amount),
          thirdpartyTransactionId,
          selectedPlanId,
          selectedOptionId
        );
      } else {
        // Simple deposit
        response = await sendDepositRequest(
          currentAccount.id,
          Number(data.amount),
          thirdpartyTransactionId
        );
      }

      if (response.success && response.data) {
        if (setTransactions && transactions)
          setTransactions([...transactions, response.data]);
        reset({ thirdpartyTransactionId: "", amount: "0.0" });
        setSelectedPlanId(undefined);
        setSelectedOptionId(undefined);

        const msg = response.message ?? "Deposit request created successfully!";
        toast.success(msg);
        setSuccessMessage(msg);

        if (defaultSelectedPlanId && defaultSelectedOptionId) {
          clearGPUPlans();
          setErrorMessage(null);
          const successMsg = "Your Mining has been successfully confirmed!";
          setSuccessMessage(successMsg);
          toast.success(successMsg);

          setTimeout(() => {
            router.push("/finance/mining-plans");
          }, 8081);
        }
      } else {
        const msg = response.message ?? "Failed to create deposit request";
        toast.error(msg);
        setErrorMessage(msg);
      }
    } catch (error) {
      console.error(error);
      const msg = "Something went wrong while creating deposit request";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user || isPending) return <DepositFormWithPlansSkeleton />;

  return (
    <FormProvider {...methods}>
      <Card
        className="max-w-xl mx-auto 
             bg-gradient-to-b from-emerald-50 to-teal-50 
             dark:from-[#0B1120] dark:to-[#0E1A2B] 
             shadow-lg rounded-2xl overflow-hidden 
             transition-colors duration-500 pt-0"
      >
        {/* Header */}
        <CardHeader
          className="px-6 py-4 
               bg-gradient-to-r from-emerald-500 to-teal-500 
               dark:from-[#1E4D3E] dark:to-[#1B5B57] 
               rounded-t-2xl shadow-md"
        >
          <CardTitle
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                 text-base sm:text-lg md:text-xl font-semibold text-white gap-2"
          >
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span>New Deposit</span>
            </div>
            <div className="text-sm sm:text-base text-emerald-50 dark:text-[#C3D9D2]">
              Current Balance:{" "}
              <span className="font-semibold text-white">
                {currentAccount.balance.toLocaleString()}{" "}
                {currentAccount.currency ?? "USDT"}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6 px-6 py-6 w-full">
          <WalletInfo />

          <Separator className="my-4 bg-emerald-200 dark:bg-[#244E4A]" />

          {/* ✅ Checkbox toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePlan"
              checked={usePlan}
              onChange={(e) => setUsePlan(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 
                   border-gray-300 dark:border-[#2E3A4B] 
                   rounded dark:bg-[#162032]"
            />
            <label
              htmlFor="usePlan"
              className="text-gray-800 dark:text-[#D1D6E0] select-none"
            >
              Use GPU Mining Plan
            </label>
          </div>

          {/* ✅ Conditional Plan Selection */}
          {usePlan && (
            <div
              className="max-w-lg mx-auto p-6 space-y-6 
                   bg-gradient-to-b from-emerald-100 to-teal-100 
                   dark:from-[#141C2A] dark:to-[#182335] 
                   rounded-lg border border-emerald-300 dark:border-[#244E4A] 
                   shadow-inner"
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-[#E6EAF0]">
                Choose Your Mining Plan
              </h1>
              <PlanAndBillingCycleSelect
                plans={miningPlansData}
                selectedPlanId={selectedPlanId}
                selectedOptionId={selectedOptionId}
                onPlanChange={(id) => {
                  setSelectedPlanId(id);
                  setSelectedOptionId(undefined);
                  setValue("amount", "0.0");
                }}
                onOptionChange={setSelectedOptionId}
              />
            </div>
          )}

          <Separator className="my-4 bg-emerald-200 dark:bg-[#244E4A]" />

          {/* ✅ Transaction Fields */}
          <div className="space-y-5">
            <FormField
              control={methods.control}
              name="thirdpartyTransactionId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-[#E6EAF0]">
                    Transaction ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter blockchain transaction ID"
                      className="bg-white dark:bg-[#162032] 
                           text-gray-900 dark:text-[#E6EAF0] 
                           border border-emerald-300 dark:border-[#244E4A] 
                           rounded-lg focus:ring-2 focus:ring-[#178C7E] 
                           focus:border-[#178C7E] shadow-sm transition-all"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-[#E6EAF0]">
                    Amount ({currentAccount.currency ?? "USDT"})
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={usePlan}
                      value={field.value || ""}
                      placeholder={
                        usePlan ? "Auto-filled by plan" : "Enter deposit amount"
                      }
                      className="bg-white dark:bg-[#162032] 
                           text-gray-900 dark:text-[#E6EAF0] 
                           border border-emerald-300 dark:border-[#244E4A] 
                           rounded-lg focus:ring-2 focus:ring-[#178C7E] 
                           focus:border-[#178C7E] shadow-sm disabled:opacity-70 transition-all"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          {errorMessage && <ErrorMessage error={errorMessage} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          {/* ✅ Submit Button */}
          <div className="pt-4">
            <Button
              type="button"
              onClick={handleSubmit(handleDepositRequest)}
              disabled={formState.isSubmitting || loading}
              className="flex items-center gap-2 rounded-lg 
                   bg-gradient-to-r from-emerald-500 to-teal-500 
                   hover:from-emerald-600 hover:to-teal-600 
                   dark:from-[#1C5444] dark:to-[#178C7E] 
                   dark:hover:from-[#178C7E] dark:hover:to-[#1A9B8B] 
                   text-white px-4 py-2 w-full justify-center 
                   transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formState.isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Deposit</span>
                  <Banknote className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

// ✅ Skeleton Loader
export function DepositFormWithPlansSkeleton() {
  return (
    <Card className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden animate-pulse">
      {/* Header */}
      <CardHeader className="px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-600" />
          </div>
          <Skeleton className="h-5 w-40 rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6 px-6 py-4 w-full">
        {/* Wallet Info */}
        <Skeleton className="h-16 w-full rounded-md bg-gray-200 dark:bg-gray-600" />

        {/* Separator */}
        <Skeleton className="h-[1px] w-full bg-gray-200 dark:bg-gray-700" />

        {/* Checkbox toggle */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-5 w-40 rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* GPU Plan Selection (collapsed area) */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-9 w-32 rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* Separator */}
        <Skeleton className="h-[1px] w-full bg-gray-200 dark:bg-gray-700" />

        {/* Transaction ID input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* Amount input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-md bg-gray-200 dark:bg-gray-600" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
      </CardContent>
    </Card>
  );
}
export default DepositFormWithPlans;
