 
"use client";

import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Icons
import { Eye, EyeOff, Info } from "lucide-react";
import { HiKey } from "react-icons/hi";
import { MdAlternateEmail, MdErrorOutline, MdPerson } from "react-icons/md";

// UI Primitives
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/primitives/form";

// Custom Components
import IconInput from "../form/icon-input";
import SubmitButton from "../form/submit-button";
import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { signUpCredentialsSchema } from "@/validation/user";
import { SignUpCredentialsInput } from "@/types/user";
import { signUpUser } from "@/actions/user/sign-up-and-send-email-OTP";
import { ReferrerInfo } from "@/types/referrals";
import ReferrerCard from "./referrer-card";
import { GenericDialogDrawer } from "../generic-dialog-drawer";
import { Button } from "@/ui/primitives/button";
import { getReferrerByReferralCode } from "@/actions/referral/get-referrer-by-referral-code";
import { ServerResponse } from "@/types";
import { authClient } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// SignUpForm Component
// ---------------------------------------------------------------------------
interface SignUpFormProps {
  referrerInfo: ReferrerInfo | null;
}

export default function SignUpForm({ referrerInfo: referrerInfoInitial }: SignUpFormProps) {
  const router = useRouter();
  const fontSize = useResponsiveFont();

  const [isOpen, setIsOpen] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(referrerInfoInitial);

  // Form state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form with validation
  const form = useForm<SignUpCredentialsInput>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: {
      email: "",
      name: "",
      newPassword: "",
      confirmPassword: "",
      referral_code: referrerInfo ? referrerInfo?.referralCode : "",
    },
  });

  const { formState: { errors }, watch,  } = form;

  // ---------------------------------------------------------------------------
  // Side Effects
  // ---------------------------------------------------------------------------
  // Clear error/success messages when form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

// ---------------------------------------------------------------------------
// Handle form submission for Sign-Up
// ---------------------------------------------------------------------------
const onSubmit = useCallback(
  async (formData: SignUpCredentialsInput) => {
    const { email, name, newPassword, referral_code } = formData;

    // ------------------------------
    // Validate required fields
    // ------------------------------
    if (!email || !newPassword) {
      const msg = "Email and password are required.";
      setErrorMessage(msg);
      setSuccessMessage(null);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);

      // ------------------------------
      // Clean referral code
      // ------------------------------
      const referralValue = referral_code
        ? referral_code.replace(/\D+/g, "") || undefined
        : undefined;

      // ------------------------------
      // Attempt to sign up the user
      // ------------------------------
      const response = await signUpUser({
        email: email.trim(),
        password: newPassword,
        name: name ?? "",
        ...(referralValue ? { referral_code: referralValue } : {}),
      });

      if (!response.success) {
        const errMsg =
          response.error?.toString() ??
          response.message ??
          "Sign-up failed. Please try again.";

        console.error("Sign-up error:", errMsg);
        setErrorMessage(errMsg);
        setSuccessMessage(null);
        toast.error(errMsg);
        return;
      }

      // ------------------------------
      // Send Email Verification OTP
      // ------------------------------
      const otpResult = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: "email-verification",
      });

      if (otpResult.data?.success) {
        const msg =
          "A one-time password (OTP) has been sent to your email address for verification.";

        setSuccessMessage(msg);
        setErrorMessage(null);
        toast.success(msg);
      } 

      // ------------------------------
      // Redirect to OTP verification
      // ------------------------------
      router.push(
        `/auth/sign-up?step=verifyOtp&email=${encodeURIComponent(
          email.trim()
        )}&registered=true`
      );
    } catch (err) {
      console.error("Unexpected sign-up error:", err);

      const errMsg =
        "An unexpected error occurred during sign-up. Please try again.";

      setErrorMessage(errMsg);
      setSuccessMessage(null);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  },
  [router]
);


  useEffect(() => {
    if (referrerInfoInitial?.referralCode) {
      form.setValue("referral_code", referrerInfoInitial?.referralCode);
    }
  }, [referrerInfoInitial?.referralCode, form]);

   // ---------------------------------------------------------------------------
  // Fetch Referrer Info When Referral Code Changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const subscription = watch(async (value) => {
      const code = value?.referral_code?.trim();
      if (!code) {
        setReferrerInfo(null);
        return;
      }

      try {
        const response:ServerResponse<{ referrerInfo: ReferrerInfo | null }> = await getReferrerByReferralCode(code);
        if (response.success&&response?.data?.referrerInfo) {
          setReferrerInfo(response.data.referrerInfo);
        } else {
          setReferrerInfo(null);
        }
      } catch (err) {
        console.error("Error fetching referrer:", err);
        setReferrerInfo(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // ---------------------------------------------------------------------------
  // Render Form
  // ---------------------------------------------------------------------------
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 text-start"
        >
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="py-1">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  Name
                </FormLabel>
                <FormControl>
                  <IconInput
                    LeftIcon={MdPerson}
                    RightIcon={MdErrorOutline}
                    placeholder="Your full name"
                    errors={errors?.name}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("name");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("name");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="py-1">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  Email
                </FormLabel>

                <FormControl>
                  <IconInput
                    LeftIcon={MdAlternateEmail}
                    RightIcon={MdErrorOutline}
                    placeholder="name@example.com"
                    errors={errors?.email}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("email");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("email");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="py-1">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  New Password
                </FormLabel>

                <FormControl>
                  <IconInput
                    type={showPassword ? "text" : "password"}
                    LeftIcon={HiKey}
                    RightIcon={showPassword ? Eye : EyeOff}
                    onRightIconClick={() => setShowPassword((prev) => !prev)}
                    placeholder="********"
                    errors={errors?.newPassword}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("newPassword");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("newPassword");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="py-1">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  Confirm Password
                </FormLabel>

                <FormControl>
                  <IconInput
                    type={showConfirmPassword ? "text" : "password"}
                    LeftIcon={HiKey}
                    RightIcon={showConfirmPassword ? Eye : EyeOff}
                    onRightIconClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    placeholder="********"
                    errors={errors?.confirmPassword}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("confirmPassword");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("confirmPassword");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Referral Code Field (Optional) */}
          <FormField
            control={form.control}
            name="referral_code"
            render={({ field }) => (
              <FormItem className="py-1">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  Referral Code (Optional)
                </FormLabel>
                <FormControl>
                  <IconInput
                    as="input"
                    LeftIcon={MdPerson}
                    RightIcon={MdErrorOutline}
                    placeholder="Enter referral code"
                    disabled={!!referrerInfoInitial?.referralCode}
                    errors={errors?.referral_code}
                    // ✅ destructure manually so no duplicate value
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("referral_code");
                    }}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trigger Button for Referrer */}
          {referrerInfo && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsOpen(!isOpen)}
              className="
      flex items-center justify-center gap-2 w-full py-2 px-4 
      rounded-lg font-medium text-white
      bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500
      dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-400
      text-sm sm:text-base transition-colors duration-200
    "
            >
              <Info className="w-5 h-5 text-white dark:text-white" />
              View Referrer
            </Button>
          )}

          {/* Error / Success Messages */}
          {errorMessage && (
            <ErrorMessage error={errorMessage} className="my-3" />
          )}
          {successMessage && (
            <SuccessMessage message={successMessage} className="my-3" />
          )}
          {/* Submit Button */}
          <SubmitButton loading={loading} className="mt-4" />
        </form>
      </Form>

      {/* Drawer */}
      {referrerInfo ? (
        <GenericDialogDrawer
          title={
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Referrer Details</span>
            </div>
          }
          open={isOpen}
          onOpenChange={setIsOpen}
          renderContent={() => (
            <div className="w-full">
              <ReferrerCard referrerInfo={referrerInfo} />
            </div>
          )}
        />
      ) : null}
    </>
  );
}
