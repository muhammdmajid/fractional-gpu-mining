import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table";
import { getCommonPinningStyles } from "@/lib/data-table";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
}

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <div className="p-0 m-0  rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <Table className="p-0 m-0 ">
        <TableHeader className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-slate-100 dark:bg-slate-800 "
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    ...getCommonPinningStyles({ column: header.column }),
                  }}
                  className="text-slate-700 dark:text-slate-200 items-center  "
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="p-0 m-0">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  row.getIsSelected() ? "bg-blue-100 dark:bg-blue-900" : ""
                }`}
                onClick={() => {
                  // Only select one row
                  table.setRowSelection({ [row.id]: true });
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      ...getCommonPinningStyles({ column: cell.column }),
                    }}
                    className="text-slate-900 dark:text-slate-100 items-center "
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-slate-600 dark:text-slate-400  items-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
