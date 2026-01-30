import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Bitcoin, Wallet, Clock, Cpu, DollarSign } from "lucide-react";
import { MiningStatusStream } from "@/types/fractional-mining-profit";
import { calculateTotalHashRateMHs } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MiningOverviewCard({ current }: { current: MiningStatusStream | null }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <Bitcoin className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            Mining Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Deposit Amount */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl
                       bg-white dark:bg-gray-800
                       shadow-md hover:shadow-xl
                       border border-gray-200 dark:border-gray-700
                       transition-all"
          >
            <Wallet className="h-6 w-6 mb-2 text-red-600 dark:text-red-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Deposit Amount
            </p>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">
              {current?.depositAmount}
            </p>
          </motion.div>

          {/* Mining Cycle Duration */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl
                       bg-white dark:bg-gray-800
                       shadow-md hover:shadow-xl
                       border border-gray-200 dark:border-gray-700
                       transition-all"
          >
            <Clock className="h-6 w-6 mb-2 text-indigo-600 dark:text-indigo-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Mining Cycle Duration
            </p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              {current?.option?.miningCycle} Months
            </p>
          </motion.div>

          {/* Current Hash Rate */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl
                       bg-white dark:bg-gray-800
                       shadow-md hover:shadow-xl
                       border border-gray-200 dark:border-gray-700
                       transition-all"
          >
            <Cpu className="h-6 w-6 mb-2 text-yellow-600 dark:text-yellow-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current Hash Rate
            </p>
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
              {calculateTotalHashRateMHs(current?.gpus)} MH/s
            </p>
          </motion.div>

          {/* Current Profit */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl
                       bg-white dark:bg-gray-800
                       shadow-md hover:shadow-xl
                       border border-gray-200 dark:border-gray-700
                       transition-all"
          >
            <DollarSign className="h-6 w-6 mb-2 text-green-600 dark:text-green-400" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current Profit
            </p>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {current?.totalProfit !== undefined
                ? Number(current.totalProfit).toFixed(4)
                : "0.0000"}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
