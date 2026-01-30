 
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonIssues from "./_components/common-issues";
import ContactSupportForm from "./_components/contact-support-form";
import FAQSection from "./_components/FAQ-section";
import MiningStatus from "./_components/mining-status";
import { EmailComposer } from "@/ui/components/email";
import { UserDbType } from "@/lib/auth-types";
import createTicketWithEmail from "@/actions/tickets/create-ticket";

interface SupportPageClientProps {
  user: UserDbType | null;
}

export default function SupportPageClient({ user }: SupportPageClientProps) {
  const [showAll, setShowAll] = useState(false);
  const faqRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => setShowAll((prev) => !prev);
  // Scroll to top when showAll becomes true
  useEffect(() => {
    if (showAll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (faqRef.current)
        faqRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAll]);

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 xl:px-16 xl:py-16">
      {/* Header + Common Issues & Contact Form */}
      <AnimatePresence>
        {!showAll && (
          <motion.div
            key="support-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 sm:py-6 md:space-y-5 md:px-6 md:py-8 lg:space-y-6 lg:px-8 lg:py-10 xl:space-y-7 xl:px-12 xl:py-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                GPU Mining Support Center
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light text-gray-600 dark:text-gray-400 leading-relaxed pb-2 sm:pb-3">
                Get help with your GPU mining plans, monitor your mining
                performance, and manage your investments.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <CommonIssues />
              {/* <ContactSupportForm /> */}
              <EmailComposer
                title="Contact Support"
                from={user?.email}
                sendEmail={({ from, subject, content }) =>
                  createTicketWithEmail({
                    email: from,
                    subject,
                    message: content,
                  })
                }
              />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Section */}
      <div ref={faqRef}>
        <FAQSection showAll={showAll} onToggle={handleToggle} />
      </div>

      {/* Mining Status */}
      <AnimatePresence>
        {!showAll && (
          <motion.div
            key="mining-status"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MiningStatus />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
