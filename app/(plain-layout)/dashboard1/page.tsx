import { redirect } from "next/navigation";

import { SYSTEM_CONFIG } from "@/config/index";

export default function DashboardPage() {
  return redirect(SYSTEM_CONFIG.redirectAfterSignIn);
}
