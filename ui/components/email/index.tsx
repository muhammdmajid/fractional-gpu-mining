"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card"
import EmailForm from "./email-form"
import { ServerResponse } from "@/types"
import { fakeSendEmailAPI } from "@/lib/fake-api"


interface EmailComposerProps<TData = unknown> {
  title?: string
  from?: string
  sendEmail?: (data: {
    from: string
    subject: string
    content: string
  }) => Promise<ServerResponse<TData>>
}

export function EmailComposer<TData = unknown>({
  title = "Send Mail",
  from,
  sendEmail,
}: EmailComposerProps<TData>) {
  // Use default API if sendEmail prop not provided
  const sendEmailFn =
    sendEmail ??
    ((data: { from: string; subject: string; content: string }) =>
      fakeSendEmailAPI<TData>(data))

  return (
    <Card className="w-full flex flex-col flex-1">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 h-full p-0 m-0">
        <EmailForm<TData> from={from} sendEmail={sendEmailFn} />
      </CardContent>
    </Card>
  )
}

