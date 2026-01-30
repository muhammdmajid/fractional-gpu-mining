"use client";

import { Button } from "@/ui/primitives/button";
import { motion } from "framer-motion";
import { GenericDialogDrawer } from "@/ui/components/generic-dialog-drawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import ParagraphSection from "@/ui/components/paragraph-section";
import ListSection from "@/ui/components/list-section";
import { aboutConfig } from "@/config/about-config";
import JoinMovementSection from "./_components/ioin-movement-section";

export default function AboutPageClient() {
  const [viewOpen, setViewOpen] = React.useState(false);

  const tocLinks = [
    ["introduction", "Introduction"],
    ["whoWeAre", "Who We Are"],
    ["mission", "Our Mission"],
    ["whatWeDo", "What We Do"],
    ["whyTrustUs", "Why Trust Us"],
    ["community", "Our Community"],
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
      {/* LEFT TOC */}
      <aside className="hidden lg:block sticky top-24 h-fit self-start">
        <nav className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 tracking-wide">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-start">
            {tocLinks.map(([href, label]) => (
              <li key={href}>
                <a
                  href={`#${href}`}
                  className="block px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <main className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 text-start">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            About Us
          </h1>
        </motion.div>

        {/* Mobile TOC */}
        <div className="block lg:hidden">
          <GenericDialogDrawer
            title="Table of Contents"
            open={viewOpen}
            onOpenChange={setViewOpen}
            renderContent={(Close) => (
              <div className="p-4">
                <ol className="space-y-3 text-base">
                  {tocLinks.map(([href, label]) => (
                    <li key={href}>
                      <a
                        href={`#${href}`}
                        className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          >
            <Menu className="h-4 w-4" />
            Table of Contents
          </GenericDialogDrawer>
        </div>

        {/* Sections */}
        <ParagraphSection
          id="introduction"
          title="Introduction"
          paragraphs={aboutConfig.sections.introduction}
        />
        <ParagraphSection
          id="whoWeAre"
          title="Who We Are"
          paragraphs={aboutConfig.sections.whoWeAre}
        />
        <ParagraphSection
          id="mission"
          title="Our Mission"
          paragraphs={aboutConfig.sections.mission}
        />

        <ListSection
          id="whatWeDo"
          title="What We Do"
          items={aboutConfig.sections.whatWeDo?.items}
        />
        <ListSection
          id="whyTrustUs"
          title="Why Trust Us"
          items={aboutConfig.sections.whyTrustUs?.items}
        />

        <ParagraphSection
          id="community"
          title="Our Community"
          paragraphs={aboutConfig.sections.community}
        />

  
                   {/* Call to Action */}
    <JoinMovementSection />
      </main>

      {/* RIGHT EXTRA INFO */}
      <aside className="hidden lg:block sticky top-24 h-fit self-start space-y-6">

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contact us anytime at{" "}
            <a href={`mailto:${aboutConfig.contactEmail}`} className="underline">
              {aboutConfig.contactEmail}
            </a>
          </p>
        </div>
  

 
      </aside>
    </div>
  );
}
