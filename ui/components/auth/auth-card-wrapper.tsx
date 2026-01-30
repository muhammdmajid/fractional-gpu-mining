"use client";
import { Card } from "@/ui/primitives/card";
import { ReactNode } from "react";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";

interface SignInCardWrapperProps {
  children: ReactNode;
}

export default function AuthCardWrapper({ children }: SignInCardWrapperProps) {
  const customFontSize = useResponsiveFont();

  return (
    <div
      className="w-full m-2 sm:m-4 md:m-6 lg:m-8 xl:m-10 2xl:m-12 3xl:m-16 flex justify-center items-center flex-col"
      style={{
        fontSize: `${0.8 * customFontSize}px`,
        maxWidth: `${30 * customFontSize}px`,
      }}
    >
      <Card
        className="
    w-full 
    rounded-none sm:rounded-none md:rounded-md lg:rounded-lg xl:rounded-xl
    shadow-lg shadow-gray-400/40 dark:shadow-gray-900/40
    bg-gradient-to-br from-gray-50 via-white to-gray-100 
    dark:from-gray-900 dark:via-gray-950 dark:to-gray-800
  "
      >
        {children}
      </Card>

      <div
        className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 xl:mt-7 2xl:mt-8 3xl:mt-10 text-balance text-center text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
        style={{ fontSize: `${0.8 * customFontSize}px` }}
      >
        By clicking continue, you agree to our{" "}
        <a href="/terms-of-service">Terms of Service</a> and{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </div>
    </div>
  );
}
