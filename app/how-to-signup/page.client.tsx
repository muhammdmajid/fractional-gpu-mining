"use client";

import Script from "next/script";
import Link from "next/link";
import { Button } from "@/ui/primitives/button";

export default function HowToSignUpClient({
  lastUpdated,
  platformName,
}: {
  lastUpdated: string;
  platformName: string;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* JSON-LD */}
      <Script id="how-to-signup-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to Sign Up on ${platformName}`,
          datePublished: lastUpdated,
          dateModified: lastUpdated,
          step: [
            { "@type": "HowToStep", name: "Visit the Signup Page" },
            { "@type": "HowToStep", name: "Enter Your Account Details" },
            { "@type": "HowToStep", name: "Verify Your Email / Phone" },
            { "@type": "HowToStep", name: "Complete Registration" },
          ],
        })}
      </Script>

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">How to Sign Up</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {platformName} — Last updated {lastUpdated}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <a href="/app/app-release.apk" download className="w-full sm:w-auto">
            <Button
              className="h-12 px-8 text-base font-semibold w-full bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 hover:shadow-xl dark:bg-yellow-500 dark:hover:bg-yellow-400"
              size="lg"
            >
              Install Our App
            </Button>
          </a>

          <Link href="/auth/sign-up" className="w-full sm:w-auto">
            <Button
              className="h-12 px-8 text-base font-semibold w-full bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
              size="lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="mb-12">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <li><a href="#step1" className="underline-offset-2 hover:underline">Visit the Signup Page</a></li>
          <li><a href="#step2" className="underline-offset-2 hover:underline">Enter Your Details</a></li>
          <li><a href="#step3" className="underline-offset-2 hover:underline">Email / Phone Verification</a></li>
          <li><a href="#step4" className="underline-offset-2 hover:underline">Complete Registration</a></li>
          <li><a href="#faq" className="underline-offset-2 hover:underline">Frequently Asked Questions</a></li>
        </ol>
      </nav>

      {/* Content Sections */}
      <section id="step1" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">1. Visit the Signup Page</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Start by navigating to the official {platformName} signup page:
        </p>
        <p className="mt-2">
          <a href="/auth/sign-up" className="text-primary underline underline-offset-4">
            Go to Sign-Up Page
          </a>
        </p>
      </section>

      <hr className="my-8" />

      <section id="step2" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">2. Enter Your Account Details</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Enter your full name.</li>
          <li>Provide a valid email address or phone number.</li>
          <li>Create a secure password.</li>
          <li>Accept the Terms of Service & Privacy Policy.</li>
        </ul>
      </section>

      <hr className="my-8" />

      <section id="step3" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">3. Verify Your Email or Phone</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          You will receive a verification code via email or SMS. Enter this code to continue.
        </p>
      </section>

      <hr className="my-8" />

      <section id="step4" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">4. Complete Your Registration</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Your {platformName} account will now be created. You can access the dashboard, manage settings & more.
        </p>
      </section>

      <hr className="my-8" />

      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <ul className="mt-3 space-y-4 text-muted-foreground">
          <li>
            <strong>What if I don’t receive the verification code?</strong><br />
            Check your spam folder or resend the code.
          </li>
          <li>
            <strong>Can I change my email later?</strong><br />
            Yes, via account settings.
          </li>
          <li>
            <strong>Is signup free?</strong><br />
            Yes, it's completely free.
          </li>
        </ul>
      </section>
    </main>
  );
}
