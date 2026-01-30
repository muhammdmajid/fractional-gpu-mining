/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Row, RowData } from "@tanstack/react-table";
import { Button } from "@/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/primitives/dropdown-menu";
import { MoreVertical, Eye, Edit2 } from "lucide-react";
import { GenericDialogDrawer } from "@/ui/components/generic-dialog-drawer";
import RowCard from "./card/row-card";
import { DataShape } from "./table-view";
import { TransactionStatus } from "@/types/transaction";

// ----------------- Transaction Row Actions -----------------
export function TransactionActions<TData extends RowData>({
  row,
  setData,
}: {
  row: Row<TData>;
  setData: React.Dispatch<React.SetStateAction<DataShape | null>>;
}) {
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const status =
    ((row.original as any)?.status as TransactionStatus) ?? "pending";

  return (
    <>
      {/* Trigger Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open actions menu"
            className="
              h-8 w-8 p-0 rounded-full hover:bg-accent
              sm:h-9 sm:w-9
              active:scale-95 transition
            "
          >
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="
            w-40 sm:w-44 rounded-lg border bg-white dark:bg-slate-900 shadow-lg
            max-sm:w-[calc(100vw-2rem)] max-sm:mx-2
          "
        >
          {/* View Action */}
          <DropdownMenuItem
            onClick={() => setViewOpen(true)}
            className="flex items-center gap-2 cursor-pointer py-2 sm:py-1.5"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
            View
          </DropdownMenuItem>

          {/* Edit Action */}
          {status !== "completed" ? (
            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 cursor-pointer py-2 sm:py-1.5"
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
              Edit
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ---------- Dialogs/Drawers ---------- */}

      {/* View Transaction */}
      <GenericDialogDrawer
        title="Transaction Details"
        subtitle="Inspect transaction data"
        open={viewOpen}
        onOpenChange={setViewOpen}
        renderContent={(Close) => (
          <RowCard row={row} isEdit={false} setData={setData} />
        )}
      />

      {/* Edit Transaction */}
      <GenericDialogDrawer
        title="Edit Transaction"
        subtitle="Modify transaction details"
        open={editOpen}
        onOpenChange={setEditOpen}
        renderContent={(Close) => (
          <RowCard row={row} isEdit={true} setData={setData} />
        )}
      />
    </>
  );
}
