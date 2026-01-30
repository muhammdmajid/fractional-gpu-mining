/* eslint-disable @typescript-eslint/no-empty-object-type */

"use client";

import ContactForm from "./_components/contact-form";
import PageWrapper from "@/ui/components/page-wrapper";

interface ContactUsPageClientProps {}

export default function ContactUsPageClient({}: ContactUsPageClientProps) {
  return (
    <PageWrapper title="Contact Us">
      <ContactForm />
    </PageWrapper>
  );
}
