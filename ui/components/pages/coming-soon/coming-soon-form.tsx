"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/primitives/form";
import { Input } from "@/ui/primitives/input";
import {ButtonLoading } from "@/ui/primitives/button"; // ✅ shadcn button
import { z } from "zod";

// Zod schema
export const ComingSoonSchema = z.object({
  email: z.email("Invalid email address"),
});

export type ComingSoonFormType = z.infer<typeof ComingSoonSchema>;

const defaultValues = { email: "" };

export function ComingSoonForm() {
  const form = useForm<ComingSoonFormType>({
    resolver: zodResolver(ComingSoonSchema),
    defaultValues,
  });

  const { isSubmitting, errors } = form.formState;

  async function onSubmit(data: ComingSoonFormType) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      form.reset(defaultValues);
      toast.success(
        "Thank you for subscribing! We'll notify you when we launch."
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto py-10 w-full px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder:text-neutral-400"
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* ✅ Shadcn Button */}
            <ButtonLoading
              isLoading={isSubmitting}
              className="w-full sm:w-1/3 px-4 py-3 flex items-center justify-center min-h-[44px] shrink-0"
            >
              Notify Me
            </ButtonLoading>
          </div>
        </form>
      </Form>
    </div>
  );
}
