"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Send } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

import { ButtonLoading } from "@/ui/primitives/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ui/primitives/form"
import { Input } from "@/ui/primitives/input"
import { Editor } from "../editor"
import ErrorMessage from "../default/error-message"
import SuccessMessage from "../default/success-message"
import { ServerResponse } from "@/types"
import { getErrorMessage } from "@/lib/handle-error"
import { toast } from "sonner"
import { fakeSendEmailAPI } from "@/lib/fake-api"

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------
const EmailComposerSchema = z.object({
  from: z.email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
})

type EmailFormType = z.infer<typeof EmailComposerSchema>

interface EmailFormProps<TData = unknown> {
  from?: string // optional "from" prop
  sendEmail?: (data: {
    from: string
    subject: string
    content: string
  }) => Promise<ServerResponse<TData>>
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function EmailForm<TData = unknown>({
  from,
  sendEmail=fakeSendEmailAPI,
}: EmailFormProps<TData>) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<EmailFormType>({
    resolver: zodResolver(EmailComposerSchema),
    defaultValues: {
      from: from ?? "",
      subject: "",
      content: "",
    },
  })

  const { isSubmitting } = form.formState

  // ---------------------------------------------------------------------------
  // Side Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null)
      setSuccessMessage(null)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // ---------------------------------------------------------------------------
  // Handle form submission
  // ---------------------------------------------------------------------------
const onSubmit = useCallback(
  async (data: EmailFormType) => {
    const { from, subject, content } = data

    if (!from || !subject || !content) {
      const msg = "All fields are required."
      setErrorMessage(msg)
      setSuccessMessage(null)
      toast.error(msg)
      return
    }

    try {
      setLoading(true)

      // ✅ Type-safe API call
      const response: ServerResponse<TData> = await sendEmail({
        from: from.trim(),
        subject: subject.trim(),
        content: content.trim(),
      })

      if (!response.success) {
        const errMsg =
          response.error?.toString() ??
          response.message ??
          "Failed to send email. Please try again."
        setErrorMessage(errMsg)
        setSuccessMessage(null)
        toast.error(errMsg)
        return
      }

      const successMsg = response.message ?? "Email sent successfully!"
      setSuccessMessage(successMsg)
      setErrorMessage(null)
      toast.success(successMsg)

      form.reset({
        from: from ?? "",
        subject: "",
        content: "",
      })
    } catch (err: unknown) {
      console.error("Unexpected email send error:", err)
      const errMsg = getErrorMessage(err)
      setErrorMessage(errMsg)
      setSuccessMessage(null)
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  },
  [form, sendEmail]
)
  return (
    <>
      {errorMessage && <ErrorMessage error={errorMessage} className="my-3" />}
      {successMessage && (
        <SuccessMessage message={successMessage} className="my-3" />
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full flex flex-col justify-between gap-3"
        >
          <div className="px-3 space-y-2">
            {/* From */}
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="grow space-y-0">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="From"
                      {...field}
                      disabled={!!from} // disable if prop exists
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <Editor
                      value={field?.value ?? ""}
                      onValueChange={field.onChange}
                      className="h-[12.5rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

{/* Submit Button */}
<div className="flex justify-end items-center 
                px-2 sm:px-2 md:px-3 lg:px-4 xl:px-5 
                 pt-2 sm:pt-2 md:pt-3 lg:pt-4 xl:pt-5  border-t border-border">
  <ButtonLoading
    isLoading={isSubmitting || loading}
    size="icon"
    icon={(isSubmitting || loading)?Loader2:Send}
    iconClassName="me-0"
  
    loadingIconClassName="me-0"
  />
</div>

        </form>
      </Form>
    </>
  )
}
