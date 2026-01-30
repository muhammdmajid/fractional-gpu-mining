import { Card } from '@/ui/primitives/card';
import Link from 'next/link';

export default function CommonIssues() {
  return (
    <Card className="space-y-4 p-6">
      <h2 className="text-2xl font-semibold">Common Issues</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Mining Plan Setup</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Troubleshoot your mining plan subscriptions, GPU allocations, and activation issues.
          </p>
          <Link href="/finance/mining-plans" className="text-primary text-sm">Read guide →</Link>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">GPU Performance & Monitoring</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Learn how to monitor your GPUs&apos; hashrates, power usage, and mining rewards in real time.
          </p>
          <Link href="/dashboard/overview" className="text-primary text-sm">View dashboard →</Link>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Billing & Wallets</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions about deposits, withdrawals, and account balances.
          </p>
          <Link href="/faqs" className="text-primary text-sm">View FAQ →</Link>
        </div>
      </div>
    </Card>
  );
}
