"use client";


import { motion } from "framer-motion";
import { privacyPolicyConfig } from "@/config/privacy-policy";
import { Menu } from "lucide-react";
import { GenericDialogDrawer } from "@/ui/components/generic-dialog-drawer";
import React from "react";
import ListSection from "@/ui/components/list-section";
import ParagraphSection from "@/ui/components/paragraph-section";




export default function PrivacyPolicyClient() {
  const [viewOpen, setViewOpen] = React.useState(false);

  const effectiveDate = privacyPolicyConfig?.effectiveDate ?? "N/A";
  const sections = privacyPolicyConfig?.sections ?? {};

  const tocLinks = [
    ["introduction", "Introduction"],
    ["information", "Information We Collect"],
    ["usage", "How We Use Your Information"],
    ["sharing", "Sharing of Information"],
    ["security", "Data Security"],
    ["cookies", "Cookies & Tracking"],
    ["rights", "Your Rights"],
    ["children", "Children's Privacy"],
    ["changes", "Changes to This Policy"],
    ["contact", "Contact Us"],
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
      {/* LEFT: Table of Contents (desktop) */}
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

      {/* CENTER: Main Content */}
     <main className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 text-start">

        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Effective Date: {effectiveDate}
          </p>
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

        {/* Sections with safe fallbacks */}
        <ParagraphSection
          id="introduction"
          title="Introduction"
          paragraphs={sections.introduction}
        />
        <ListSection
          id="information"
          title="1. Information We Collect"
          items={sections.information}
        />
        <ListSection
          id="usage"
          title="2. How We Use Your Information"
          items={sections.usage}
        />
        <ListSection
          id="sharing"
          title="3. Sharing of Information"
          items={sections.sharing}
        />
        <ParagraphSection
          id="security"
          title="4. Data Security"
          paragraphs={sections.security}
        />
        <ListSection
          id="cookies"
          title="5. Cookies & Tracking"
          items={sections.cookies}
        />
        <ListSection
          id="rights"
          title="6. Your Rights"
          items={sections.rights}
        />
        <ParagraphSection
          id="children"
          title="8. Children's Privacy"
          paragraphs={sections.children}
        />
        <ParagraphSection
          id="changes"
          title="9. Changes to This Policy"
          paragraphs={sections.changes}
        />
        <ParagraphSection
          id="contact"
          title="10. Contact Us"
          paragraphs={sections.contact}
        />
      </main>

      {/* RIGHT: Extra content */}
      <aside className="hidden lg:block sticky top-24 h-fit self-start space-y-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contact us anytime at{" "}
            <a
              href={`mailto:${privacyPolicyConfig?.contactEmail ?? "support@example.com"}`}
              className="underline"
            >
              {privacyPolicyConfig?.contactEmail ?? "support@example.com"}
            </a>
          </p>
        </div>

        {/* <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/cookies" className="hover:underline">
                Cookies Policy
              </a>
            </li>
          </ul>
        </div> */}
      </aside>
    </div>
  );
}
