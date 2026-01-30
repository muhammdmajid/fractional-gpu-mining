/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { useEffect, useState, ChangeEvent, SetStateAction } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { toast } from "sonner";

// Icons
import { Eye, EyeOff } from "lucide-react";
import { HiKey } from "react-icons/hi";
import { MdAlternateEmail, MdErrorOutline } from "react-icons/md";

// UI Primitives
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ui/primitives/form";
import { Checkbox } from "@/ui/primitives/checkbox";
import { Label } from "@/ui/primitives/label";

// Custom Components
import IconInput from "../form/icon-input";
import SubmitButton from "../form/submit-button";
import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";

// Actions & Config
import { signInAndSendEmailOTP } from "@/actions/user/sign-in-and-send-email-OTP";
import { LoginCredentialsSchema } from "@/validation/user";
import { LoginCredentials } from "@/types/user";
import { EMAIL_OTP_SENT } from "@/lib/constants";
import { useAuthStep } from "@/providers/auth-steps-provider";
import { SYSTEM_CONFIG } from "@/config/index";

// Hooks
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import z from "zod";
import { getErrorMessage } from "@/lib/handle-error";
import {
  getPasswordForEmail,
  removeCredential,
  saveCredential,
} from "@/lib/remember";
import { signIn } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface SignInFormProps {}

const emailSchema = z.email();

export default function SignInForm({}: SignInFormProps) {
  const router = useRouter();
  const fontSize = useResponsiveFont();
  const { setQuery } = useAuthStep();
const [isLoading,setLoading]=useState<boolean>()
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(LoginCredentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = form;

  const email = watch("email");

  // ---------------------------------------------------------------------------
  // Side Effects
  // ---------------------------------------------------------------------------

  // Clear messages on input change
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-fill password if email was remembered
  useEffect(() => {
    if (email) {
      const savedPassword = getPasswordForEmail(email.trim());
      if (savedPassword) {
        form.setValue("password", savedPassword);
        setRememberMe(true);
      }
    }
  }, [email, form]);

// ---------------------------------------------------------------------------
// Handle Login Form Submission
// ---------------------------------------------------------------------------
const onSubmit = async (data: LoginCredentials) => {
  const { email, password } = data;

  // ------------------------------
  // Validate required fields
  // ------------------------------
  if (!email || !password) {
    const msg = "Email and password are required.";
    setErrorMessage(msg);
    setSuccessMessage(null);
    toast.error(msg);
    return;
  }

  try {
    // Start loading
    setLoading(true);

    // ------------------------------
    // Attempt to sign in and send OTP if necessary
    // ------------------------------
    const result = await signInAndSendEmailOTP(email);

    if (!result.success) {
      // --------------------------
      // Sign-in failed
      // --------------------------
      const msg =
        getErrorMessage(result.message) ?? "Sign-in failed. Please try again.";
      console.error("Sign-in error:", msg);
      setErrorMessage(msg);
      setSuccessMessage(null);
      toast.error(msg);
      setLoading(false);
      return;
    }

    // ------------------------------
    // OTP Required (Unverified email)
    // ------------------------------
    if (result.data?.requiresVerification) {
      const otpMsg =
        result.message ?? "A one-time password (OTP) has been sent to your email.";
      setSuccessMessage(otpMsg);
      setErrorMessage(null);
      toast.success(otpMsg);

      setQuery({
        step: "verifyOtp",
        email: encodeURIComponent(email.trim()),
      });
      setLoading(false);
      return;
    }

    // ------------------------------
    // If no OTP required, call signIn.email with callbacks
    // ------------------------------
    await signIn.email(
      {
        email,
        password,rememberMe
      },
      {
        onRequest: () => {
        
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => {
          // Handle remember me
          if (rememberMe) {
            saveCredential(email.trim(), password);
          } else {
            removeCredential(email.trim());
          }

          // Successful login without OTP
          const successMsg = result.message ?? "Sign-in successful";
          setSuccessMessage(successMsg);
          setErrorMessage(null);
          toast.success(successMsg);

          router.push(SYSTEM_CONFIG.redirectAfterSignIn);
        },
        onError: (ctx: { error: { message: string } }) => {
          setErrorMessage(ctx.error.message);
          setSuccessMessage(null);
          setLoading(false);
        },
      }
    );
  } catch (err: unknown) {
    // ------------------------------
    // Unexpected error
    // ------------------------------
    console.error("Unexpected sign-in error:", err);
    const errMsg =
      getErrorMessage(err) ??
      "An unexpected error occurred during sign-in. Please check your credentials and try again.";
    setErrorMessage(errMsg);
    setSuccessMessage(null);
    toast.error(errMsg);
    setLoading(false);
  }
};


  function ForgotPasswordLink({ email }: { email?: string }) {
    let emailParam = "";

    if (email) {
      const result = emailSchema.safeParse(email);
      if (result.success) {
        emailParam = `?email=${encodeURIComponent(result.data)}`;
      }
    }

    return (
      <Link
        href={`/auth/forget-password${emailParam}`}
        className="font-medium text-muted-foreground hover:opacity-75 dark:text-slate-400"
        style={{ fontSize: `${0.7 * fontSize}px` }}
      >
        Forgot Password?
      </Link>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 text-start"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(Boolean(checked))
                      }
                      className="bg-white dark:bg-slate-900
                                 text-slate-700 dark:text-white
                                 data-[state=checked]:bg-slate-900
                                 data-[state=checked]:text-white
                                 data-[state=unchecked]:bg-white
                                 data-[state=unchecked]:text-slate-700
                                 dark:data-[state=unchecked]:bg-slate-900
                                 dark:data-[state=unchecked]:text-slate-400"
                      style={{ fontSize: `${0.7 * fontSize}px` }}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="font-medium text-muted-foreground hover:opacity-75 dark:text-slate-400"
                      style={{ fontSize: `${0.7 * fontSize}px` }}
                    >
                      Remember me
                    </Label>
                  </div>
                  <ForgotPasswordLink email={email} />
                </div>

                {/* Password Input */}
                <FormControl>
                  <IconInput
                    type={showPassword ? "text" : "password"}
                    LeftIcon={HiKey}
                    RightIcon={showPassword ? Eye : EyeOff}
                    onRightIconClick={() => setShowPassword((prev) => !prev)}
                    placeholder="********"
                    errors={errors?.password}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("password");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("password");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && (
            <ErrorMessage error={errorMessage} className="my-3" />
          )}
          {successMessage && (
            <SuccessMessage message={successMessage} className="my-3" />
          )}

          {/* Submit */}
          <SubmitButton loading={isSubmitting} className="mt-4" />
        </form>
      </Form>
    </>
  );
}
