"use client"

import type { ReactNode } from "react"

// import { Customizer } from "./customizer"
// import { HorizontalLayout } from "./horizontal-layout"
import { VerticalLayout } from "./vertical-layout"

import { UserDbType } from "@/lib/auth-types"

export function Layout({
  children,currentUser
}: {
  children: ReactNode,
  currentUser: UserDbType | null
}) {
  // const isVertical = useIsVertical()
 const isVertical = true
  return (
    <>
      {/* <Customizer /> */}
      {/* If the layout is vertical, render a vertical layout; otherwise, render a horizontal layout */}
      {isVertical ? (
        <VerticalLayout currentUser={currentUser} >{children}</VerticalLayout>
      ) : (<></>
        // <HorizontalLayout >{children}</HorizontalLayout>
      )}
    </>
  )
}