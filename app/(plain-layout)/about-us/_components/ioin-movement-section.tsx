"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/ui/primitives/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function JoinMovementSection() {
  return (
    <motion.section
      className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.12 }}
    >
      <motion.div
        variants={fadeInUp}
        className=" mx-auto rounded-lg border border-gray-200 
                   dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                   p-4 sm:p-5 lg:p-6 shadow"
      >
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Join the Movement
        </h3>

        {/* Paragraph */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          Become part of our{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            community
          </span>
          . Own a fraction of a GPU and start mining today. Mining is no longer
          just for big players — it&apos;s open to everyone.
        </p>

        {/* Button */}
        <Link href="/auth/sign-up" passHref>
          <Button
            className="px-4 py-2 text-sm sm:text-base rounded-md shadow 
                       bg-blue-600 hover:bg-blue-700 text-white 
                       dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Become a Member
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  );
}

export default JoinMovementSection;
