import { Card } from '@/ui/primitives/card';
import Link from 'next/link';

export default function MiningStatus() {
  return (
    <section className="space-y-3  py-4 sm:space-y-4  sm:py-6 md:space-y-5  md:py-8 lg:space-y-6  lg:py-10 xl:space-y-7  xl:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 dark:text-gray-100">
          Mining System Status
        </h2>
        <Link
          href="/dashboard/mining-stats"
          className="text-primary text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"
        >
          View status page →
        </Link>
      </div>

      <Card className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 md:h-3 md:w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></span>
          </span>
          <p className="text-xs sm:text-sm md:text-base lg:text-base xl:text-lg text-gray-700 dark:text-gray-300">
            All GPU mining systems operational
          </p>
        </div>
      </Card>
    </section>
  );
}
