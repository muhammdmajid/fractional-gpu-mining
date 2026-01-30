/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/ui/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/primitives/dialog";
import { Input } from "@/ui/primitives/input";
import { Textarea } from "@/ui/primitives/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/ui/primitives/form";
import { Investment } from "@/types/mining-plans";

// ==========================
// Validation Schema
// ==========================
const requestReviewSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type RequestReviewFormValues = z.infer<typeof requestReviewSchema>;

interface RequestReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment | null;
  userEmail?: string;
}

export const RequestReviewDialog: FC<RequestReviewDialogProps> = ({
  open,
  onOpenChange,
  investment,
  userEmail = "user@example.com",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestReviewFormValues>({
    resolver: zodResolver(requestReviewSchema),
    defaultValues: { message: "" },
    mode: "all",
  });

  // Reset form with default values whenever investment changes
  useEffect(() => {
    if (investment) {
      const capitalizedStatus = investment.status
        ? investment.status.charAt(0).toUpperCase() + investment.status.slice(1)
        : "Pending";

      form.reset({
        message: `Dear Admin,

I would like to request a review for my investment.

Plan: ${investment?.plan?.title ?? "N/A"}
Investment ID: ${investment?.id ?? "N/A"}
Status: ${capitalizedStatus}

Message:`,
      });
    }
  }, [investment, form]);

  const onSubmit = async (data: RequestReviewFormValues) => {
    if (!investment) {
      alert("Invalid investment. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const capitalizedStatus = investment.status
        ? investment.status.charAt(0).toUpperCase() + investment.status.slice(1)
        : "Pending";

      const subject = `Review Request: [ID: ${investment?.id ?? "N/A"}] ${
        investment.plan?.title ?? "Investment Plan"
      }`;

      const emailPayload = {
        to: "admin@example.com",
        from: investment.email ?? userEmail,
        subject,
        body: `Dear Admin,

I would like to request a review for my investment.

Plan: ${investment?.plan?.title ?? "N/A"}
Investment ID: ${investment?.id ?? "N/A"}
Status: ${capitalizedStatus}

Message:
${data.message}`,
      };

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Email failed to send");
      }

      alert("✅ Email sent successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(`❌ Failed to send email: ${err.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectLine = investment
    ? `Review Request: [ID: ${investment?.id ?? "N/A"}] ${
        investment.plan?.title ?? "Investment Plan"
      }`
    : "Review Request: Investment Plan";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Request Review</DialogTitle>
          <DialogDescription>
            Send an email to request a review for{" "}
            <span className="font-medium">
              {investment?.plan?.title ?? "this plan"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Pre-filled User Email */}
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input type="email" value={userEmail} disabled />
              </FormControl>
            </FormItem>

            {/* Subject Input */}
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input type="text" value={subjectLine} disabled />
              </FormControl>
            </FormItem>

            {/* Message Textarea */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message..."
                      rows={7}
                      {...field} // RHF handles value & onChange
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please provide any details or concerns for the review.
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReviewDialog;
