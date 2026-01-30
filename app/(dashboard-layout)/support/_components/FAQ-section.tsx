import { faqData } from '@/data/faqs';
import { Card } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FAQSection,FAQItem  } from "@/types/index";

interface FAQSectionProps {
  showAll: boolean;
  onToggle?: () => void;
}

// Ensure faqData has correct type
const safeFaqData: FAQSection[] = Array.isArray(faqData) ? faqData : [];

export default function FAQSection({ showAll, onToggle }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ------------------
  // Filter Logic (only question)
  // ------------------
  const filteredFaqs: FAQItem[] = useMemo(() => {
    const allItems = safeFaqData.flatMap(section => section.items ?? []);
    if (!searchQuery.trim()) return allItems;

    return allItems.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedFaqs = showAll
    ? filteredFaqs
    : safeFaqData.flatMap(section => section.items ?? []).filter(faq => faq.isHighlighting)?.slice(0, 4);

  if (!safeFaqData.length) {
    return (
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Unable to load FAQs at the moment. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 xl:space-y-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2 sm:gap-y-0 gap-x-0 sm:gap-x-2 md:gap-x-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight">
          Frequently Asked Questions
        </h2>
        {onToggle && (
          <button
            onClick={onToggle}
            className="flex items-center text-primary text-sm sm:text-base md:text-lg font-medium hover:underline gap-x-1 sm:gap-x-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </>
            ) : (
              <>
                View All Questions <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Search Input */}
      {showAll && (
        <div className="w-full  relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-slate-900
              text-gray-800 dark:text-gray-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-colors duration-200 py-3
            "
          />
        </div>
      )}

      {/* FAQ Cards */}
      {displayedFaqs.length ? (
        <div className="grid gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-4 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 md:grid-cols-2 lg:grid-cols-2">
          {displayedFaqs.map((faq: FAQItem) => (
            <Card
              key={faq.question}
              className="
                p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8
                rounded-lg
                border border-gray-300 dark:border-gray-700
                shadow-md dark:shadow-lg
                transition-shadow duration-300
              "
            >
              <h3 className="font-medium text-base sm:text-lg md:text-lg lg:text-xl leading-snug">
                {faq.question}
              </h3>
              <div className="mt-2 text-sm sm:text-base md:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No FAQs available at the moment.
        </p>
      )}
    </section>
  );
}
