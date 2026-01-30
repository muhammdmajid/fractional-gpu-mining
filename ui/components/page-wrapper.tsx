"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface PageWrapperProps {
  title: ReactNode;
  children?: ReactNode; // use children instead of `content` for flexibility
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  if (!title) {
    console.error("⚠️ PageWrapper requires a `title` prop.");
  }

  return (
    <main
      className="
        w-full
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16    
        py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 
        space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 
      "
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {title ?? "⚠️ Missing Title"}
        </h1>
      </motion.div>

      {/* Page Content */}
      <div>
        {children ?? (
          <p className="text-red-500">⚠️ No content provided</p>
        )}
      </div>
    </main>
  );
};

export default PageWrapper;
