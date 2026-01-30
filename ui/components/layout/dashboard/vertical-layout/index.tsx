
import type { ReactNode } from "react"
import { VerticalLayoutHeader } from "./vertical-layout-header"
import FooterDashboard from "../../../footer/footer-dahboard"
import { Sidebar } from "../sidebar"
import { UserDbType } from "@/lib/auth-types";


export function VerticalLayout({
  children,currentUser
}: {
  children: ReactNode;
    currentUser: UserDbType | null

}) {
  return (
        <>
      <Sidebar  currentUser={currentUser} />
      <div className="w-full">
        <VerticalLayoutHeader  />
        <div className="min-h-[calc(100svh-6.82rem)] bg-muted/40">
          {children}
        </div>
           <footer className="">
        <FooterDashboard />
        </footer>
      </div>
    </>

  )
}