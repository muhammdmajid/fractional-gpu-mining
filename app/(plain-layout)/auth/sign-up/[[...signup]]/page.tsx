// app/auth/sign-up/page.tsx
import { SYSTEM_CONFIG, SEO_CONFIG } from "@/config/index";
import { getCurrentUser } from "@/lib/auth";
import { SignUpPageClient } from "./page.client";
import type { Metadata, Viewport } from "next";
import type { JSX } from "react";
import type { ReferrerInfo } from "@/types/referrals";
import { getReferrerByReferralCode } from "@/actions/referral/get-referrer-by-referral-code";
import { redirect } from "next/navigation";


// ✅ Metadata for Next.js 13+ app router
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Sign Up`,
  description: "Sign up to create a new account and access your dashboard.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Sign Up`,
    description: "Sign up to create a new account and access your dashboard.",
    url: SEO_CONFIG.seo.baseUrl + "/auth/sign-up",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Sign Up`,
    description: "Sign up to create a new account and access your dashboard.",
  },
};

// ✅ Viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Props interface
interface SignUpPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SignUpPage = async (props: SignUpPageProps): Promise<JSX.Element> => {

  const user = await getCurrentUser();

  if (user) {
    // User is already signed in → redirect to dashboard
    redirect(SYSTEM_CONFIG.redirectAfterSignIn);
  }


  try {
    const searchParams = props.searchParams ? await props.searchParams : {};

    // Extract referral code
    const referralCode =
      typeof searchParams?.ref === "string" ? searchParams.ref : null;

    // ✅ Fetch referrer info using server action
    let referrerInfo: ReferrerInfo | null = null;
    if (referralCode) {
      const response = await getReferrerByReferralCode(referralCode);
      if (response.success && response.data?.referrerInfo) {
        referrerInfo = response.data.referrerInfo;
      }
    }



    // Render client component
    return <SignUpPageClient referrerInfo={referrerInfo} />;
  } catch (error) {
    console.error("Error rendering SignUpPage:", error);

    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p>We could not load the sign-up page. Please try again later.</p>
      </div>
    );
  }
};

export default SignUpPage;
