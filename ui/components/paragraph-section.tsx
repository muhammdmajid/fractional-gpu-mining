"use client";

import { motion } from "framer-motion";
import { Separator } from "@/ui/primitives/separator";

type ParagraphSectionProps = {
  id: string;
  title: string;
  paragraphs?: string[];
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ParagraphSection({ id, title, paragraphs }: ParagraphSectionProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <motion.section
      id={id}
      className="scroll-mt-24 mb-10 sm:mb-14 lg:mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <motion.h2
        className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
        variants={fadeInUp}
      >
        {title}
      </motion.h2>
      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 lg:space-y-5">
        {paragraphs.map((text, idx) => (
          <motion.p
            key={idx}
            className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            variants={fadeInUp}
          >
            {text}
          </motion.p>
        ))}
      </div>
      <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />
    </motion.section>
  );
}

export default ParagraphSection;
