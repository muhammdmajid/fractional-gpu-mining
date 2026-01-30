"use client";

import TypeBadgeTransaction from "@/app/(dashboard-layout)/finance/_components/type-badge-transaction";
import { StatusSelect } from "../status-select";
import { CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { FileBadge } from "lucide-react";

interface StepStatusTypeProps {
  status: string;
  type: string;
}

export default function StepStatusType({ status, type }: StepStatusTypeProps) {
  return (
    <div className="w-full">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileBadge className="w-5 h-5 text-primary" />
          Status & Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <StatusSelect name="status" defaultStatus={status} />
          </div>
          <TypeBadgeTransaction type={type} />
        </div>
      </CardContent>
    </div>
  );
}
