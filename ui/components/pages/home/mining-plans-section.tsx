/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"
import MiningPlans from "@/ui/components/pricing";
import { Button } from "@/ui/primitives/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useGPUPlans } from "@/providers/gpu-plans-provider";

interface Props {}

export default function MiningPlansSection({}: Props) {
  const { miningPlansData } = useGPUPlans();
  if (!miningPlansData || miningPlansData.length === 0) return null;

  return (
    <section>
      <MiningPlans miningPlans={miningPlansData} />
      <div className="mt-10 flex justify-center">
        <Link href="/mining-plans">
          <Button className="group h-12 px-8" size="lg" variant="outline">
            View All Plans
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
