/* eslint-disable @typescript-eslint/no-empty-object-type */
// app/faqs/page.client.tsx
"use client";

import FaqsWithContact from "./_components/faqs-with-contact";
import PageWrapper from "@/ui/components/page-wrapper";

interface FaqsPageClientProps {}

export default function FaqsPageClient({}: FaqsPageClientProps) {
  return (
    <PageWrapper title="Frequently Asked Questions">
      <FaqsWithContact />
    </PageWrapper>
  );
}
