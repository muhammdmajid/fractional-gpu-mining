"use client"
import { SEO_CONFIG } from "@/config/index";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// Create and export the auth client
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect: () => {
        // Redirect to the two-factor page
        window.location.href = "/auth/two-factor";
      },
    }),
    emailOTPClient()
   
  ],
});

// Auth methods
export const { signIn, signOut, signUp, useSession } = authClient;



// Two-factor methods
export const twoFactor = authClient.twoFactor;

// Hook to get current user data and loading state
// !! Returns only raw (static) data, use getCurrentUserOrRedirect for data from db
export const useCurrentUser = () => {
  const { data, isPending } = useSession();
  return {
    isPending,
    session: data?.session,
    user: data?.user,
  };
};

// Hook similar to getCurrentUserOrRedirect for client-side use
// !! Returns only raw (static) data, use getCurrentUserOrRedirect for data from db
export const useCurrentUserOrRedirect = (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
) => {
  const { data, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // only perform redirects after loading is complete and router is ready
    if (!isPending && router) {
      // if no user is found
      if (!data?.user) {
        // redirect to forbidden url unless explicitly ignored
        if (!ignoreForbidden) {
          router.push(forbiddenUrl);
        }
        // if ignoreforbidden is true, we do nothing and let the hook return the null user
      } else if (okUrl) {
        // if user is found and an okurl is provided, redirect there
        router.push(okUrl);
      }
    }
    // depend on loading state, user data, router instance, and redirect urls
  }, [isPending, data?.user, router, forbiddenUrl, okUrl, ignoreForbidden]);

  return {
    isPending,
    session: data?.session,
    user: data?.user,
  };
};






