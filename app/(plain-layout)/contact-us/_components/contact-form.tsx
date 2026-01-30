"use client";

import { FieldValues, Path, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/ui/primitives/label";
import { Input } from "@/ui/primitives/input";
import { Textarea } from "@/ui/primitives/textarea";
import { Button } from "@/ui/primitives/button";

import ContactInfo from "./ContactInfo";

import { useEffect, useMemo, useState } from "react";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { SEO_CONFIG } from "@/config";

// -------------------------
// Zod schema
// -------------------------
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-sm sm:text-base">{message}</p> : null;

type FormFieldProps<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  type?: string;
  register: UseFormRegister<T>;
  placeholder: string;
  error?: string;
  style: React.CSSProperties;
};

// -------------------------
// Form Field
// -------------------------
function FormField<T extends FieldValues>({
  id,
  label,
  type = "text",
  register,
  placeholder,
  error,
  style,
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="block font-medium text-gray-700 dark:text-gray-300"
        style={style}
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        {...register(id)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
                   shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                   focus:border-indigo-500 dark:focus:border-indigo-400 
                   bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
        style={style}
      />
      {error && <ErrorText message={error} />}
    </div>
  );
}

// -------------------------
// Contact Form Component
// -------------------------
export default function ContactForm() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const custom_font_size = useResponsiveFont();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const style = useMemo(
    () => ({ fontSize: `${custom_font_size}px` }),
    [custom_font_size]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    const mailto = `mailto:${SEO_CONFIG.siteInfo.email}?subject=${encodeURIComponent(
      data.subject
    )}&body=${encodeURIComponent(`Name: ${data.name}\n\n${data.message}`)}`;
    window.location.href = mailto;
    reset();
  };

  if (!isMounted) return null;

  return (
    <section className="w-full text-start">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14  
                      p-6 sm:p-8 lg:p-10">
        {/* Left Side */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1
              className="font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-tight"
              style={{ fontSize: `${2 * custom_font_size}px` }}
            >
              Get in touch
            </h1>
            <p
              className="text-gray-600 dark:text-gray-400 max-w-lg"
              style={style}
            >
              If you have any questions or feedback, feel free to contact us via
              phone or email. Alternatively, you can fill out the contact form
              below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name & Email */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id="name"
                label="Name"
                register={register}
                placeholder="Enter your name"
                error={errors.name?.message}
                style={style}
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                register={register}
                placeholder="Enter your email"
                error={errors.email?.message}
                style={style}
              />
            </div>

            {/* Subject */}
            <FormField
              id="subject"
              label="Subject"
              register={register}
              placeholder="Enter the subject"
              error={errors.subject?.message}
              style={style}
            />

            {/* Message */}
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="block font-medium text-gray-700 dark:text-gray-300"
                style={style}
              >
                Message
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Enter your message"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
                           shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                           bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 min-h-[140px]"
                style={style}
              />
              <ErrorText message={errors.message?.message} />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl shadow-md 
                         bg-indigo-600 hover:bg-indigo-700 text-white 
                         dark:bg-indigo-400 dark:hover:bg-indigo-500 dark:text-slate-900
                         transition-colors duration-200"
              style={style}
            >
              Submit
            </Button>
          </form>
        </div>

        {/* Right Side (Contact Info / Map) */}
        <ContactInfo />
      </div>
    </section>
  );
}
