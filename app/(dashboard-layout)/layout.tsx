import { SYSTEM_CONFIG } from "@/config/index";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { UserDbType } from "@/lib/auth-types";
import {getUserByEmail} from "@/actions/user/get-user-by-email";
import { Layout } from "@/ui/components/layout/dashboard";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
   // ✅ Protect page (redirect if not logged in)
  const currentUser: UserDbType | null = await getCurrentUserOrRedirect("/auth/sign-in");

  // ✅ Fetch full user from DB (by email)
  const user: UserDbType | null = currentUser?.email
    ? await getUserByEmail(currentUser.email)
    : null;

  try {
    // If Layout has async data fetching or props, handle them here
    return <Layout currentUser={user}>{children}</Layout>;
  } catch (error) {
    console.error("Dashboard layout error:", error);

    // Fallback UI in case of error
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground mt-2">
            Please try refreshing the page or come back later.
          </p>
        </div>
      </div>
    );
  }
}
