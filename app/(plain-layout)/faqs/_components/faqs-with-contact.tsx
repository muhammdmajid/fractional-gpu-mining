"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui/primitives/accordion";
import { Input } from "@/ui/primitives/input";
import { Search } from "lucide-react";
import ContactUsSection from "./contact-us-section";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { faqData } from "@/data/faqs";
import type { FAQSection } from "@/types/index";

// Ensure faqData has correct type
const safeFaqData: FAQSection[] = Array.isArray(faqData) ? faqData : [];

export default function FaqsWithContact() {
  const customFontSize = useResponsiveFont();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ------------------
  // Filter Logic (only question)
  // ------------------
  const filteredFaqs: FAQSection[] = useMemo(() => {
    if (!searchQuery.trim()) return safeFaqData;

    try {
      return safeFaqData
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.items.length > 0);
    } catch (err) {
      console.error("Error filtering FAQs:", err);
      return [];
    }
  }, [searchQuery]);

  // ------------------
  // Render
  // ------------------
  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-stretch space-y-10 md:space-y-0 md:space-x-10 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left Section: FAQs */}
      <div
        className="
    w-full md:w-[60%]
    flex flex-col items-center justify-start relative
    space-y-2 sm:space-y-2 md:space-y-4 lg:space-y-5 xl:space-y-6
  "
      >
        {/* Search Input */}
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-slate-900 
                       text-gray-800 dark:text-gray-200
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       transition-colors duration-200 py-3"
          />
        </div>

        {/* FAQs or Empty State */}
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((section, sectionIndex) => (
            <motion.div
              key={`${section.category}-${sectionIndex}`}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              {/* Category Heading */}
              <div className="flex items-center justify-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 via-slate-400 to-blue-300 dark:from-blue-900 dark:via-slate-700 dark:to-blue-900" />
                <h2
                  className="px-6 text-center font-extrabold text-slate-800 dark:text-gray-100 tracking-wide uppercase"
                  style={{
                    fontSize: `${1.8 * customFontSize}px`,
                    fontFamily: "'Poppins', 'Inter', sans-serif",
                    letterSpacing: "0.05em",
                    lineHeight: 1.3,
                  }}
                >
                  {section.category}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 via-slate-400 to-blue-300 dark:from-blue-900 dark:via-slate-700 dark:to-blue-900" />
              </div>

              {/* Accordion */}
              <Accordion type="single" collapsible className="">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={`${item.question}-${itemIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                    className="mb-5"
                  >
                    <AccordionItem
                      value={`item-${sectionIndex}-${itemIndex}`}
                      className="
    border-b border-gray-300 dark:border-gray-700 
    shadow-sm dark:shadow-slate-800/40
    rounded-lg
    transition-all duration-300
    hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500
    focus-within:shadow-lg focus-within:border-indigo-500 dark:focus-within:border-indigo-400
  "
                    >
                      <AccordionTrigger
                        className="font-semibold text-gray-800 dark:text-gray-200 
                                   hover:text-indigo-600 dark:hover:text-indigo-400 
                                   transition-colors duration-300 
                                   hover:underline underline-offset-4 
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 
                                   px-4 py-4 rounded-md"
                        style={{
                          fontFamily:
                            "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
                          fontSize: `${customFontSize * 1.05}px`,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.question}
                      </AccordionTrigger>

                      <AccordionContent
                        className="
    text-gray-900 dark:text-gray-300 leading-relaxed 
    bg-gray-50 dark:bg-slate-900 
    rounded-lg px-6 py-5 
    font-light shadow-sm dark:shadow-none text-start 
    border border-gray-200 dark:border-slate-800
    mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10
    mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10
  "
                        style={{
                          fontSize: `${customFontSize * 1.05}px`,
                          fontFamily: "'Roboto Slab', 'Inter', serif",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10 italic">
            {searchQuery
              ? `No questions found for "${searchQuery}"`
              : "No FAQs available at the moment."}
          </p>
        )}
      </div>

      {/* Right Section: Contact */}
      <div className="w-full md:w-[40%] ">
        <ContactUsSection />
      </div>
    </div>
  );
}
