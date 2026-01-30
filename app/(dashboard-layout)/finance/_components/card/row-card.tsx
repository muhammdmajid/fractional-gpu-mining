 

import { cn } from "@/lib/utils";
import { Row, RowData } from "@tanstack/react-table";
import { RowCardContent } from "./steps";
import { DataShape } from "../table-view";

interface RowCardProps<TData extends RowData> {
  row: Row<TData>;
  isEdit?: boolean;
  setData: React.Dispatch<React.SetStateAction<DataShape | null>>;
}

export default function RowCard<TData extends RowData>({
  row,
  isEdit = false,
  setData,
}: RowCardProps<TData>) {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full overflow-hidden transition-all duration-300  p-0 m-0",
        "",
        "border-0 shadow-none"
      )}
    >
      {/* ✅ Main content */}
      <div className="flex-1 ">
        <RowCardContent transaction={row} isEdit={isEdit} setData={setData} />
      </div>
    </div>
  );
}
