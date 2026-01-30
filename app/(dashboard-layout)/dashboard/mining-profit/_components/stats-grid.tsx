"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/ui/primitives/card";
import { DollarSign, ArrowLeftRight, Wallet } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  type: "total" | "transferable" | "remaining";
}

const iconConfig = {
  total: { icon: DollarSign, bg: "bg-indigo-500 dark:bg-indigo-600" },
  transferable: { icon: ArrowLeftRight, bg: "bg-green-500 dark:bg-green-600" },
  remaining: { icon: Wallet, bg: "bg-amber-500 dark:bg-amber-600" },
};

export default function StatsGrid({
  stats,
  currency,
}: {
  stats: Stat[];
  currency: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, idx) => {
            const { icon: Icon, bg } = iconConfig[item.type];
            return (
              <div key={idx} className="flex items-center gap-4">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full ${bg} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </motion.div>

                {/* Text */}
                <div className="flex flex-col">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                    {item.value}{" "}
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 dark:text-gray-400">
                      {currency}
                    </span>
                  </CardContent>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
