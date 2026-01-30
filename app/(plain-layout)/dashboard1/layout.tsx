import { getCurrentUserOrRedirect } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getCurrentUserOrRedirect();

  return (
    <div className="flex min-h-screen flex-col w-full">
  {children}
    </div>
  );
}
