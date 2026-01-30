"use client";

import {
  getTransactionAmountRange,
  getTransactions,
  getTransactionStatusCounts,
} from "@/actions/transaction/get-transactions";

import * as React from "react";
import { getTransactionTableColumns } from "./transactions-table-column";
import { useDataTable } from "@/lib/hooks/use-data-table";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { cn } from "@/lib/utils";
import { DataTableSortList } from "./table/data-table-sort-list";
import { DataTablePagination } from "./table/data-table-pagination";
import { DataTable } from "./table/data-table";
import TransactionTableSkeleton from "./transaction-table-skeleton";

export type DataShape = {
  transactionsData: Awaited<ReturnType<typeof getTransactions>>["data"];
  pageCount: Awaited<ReturnType<typeof getTransactions>>["pageCount"];
  statusCounts: Awaited<ReturnType<typeof getTransactionStatusCounts>>;
  amountRange: Awaited<ReturnType<typeof getTransactionAmountRange>>;
};
interface TableViewProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTransactions>>,
      Awaited<ReturnType<typeof getTransactionStatusCounts>>,
      Awaited<ReturnType<typeof getTransactionAmountRange>>,
    ]
  >;
}

const TableView: React.FC<TableViewProps> = ({ promises }) => {
  const [data, setData] = React.useState<DataShape | null>(null);
  const [loading, setLoading] = React.useState(true);
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    async function fetchData() {
      if (
        !promises ||
        typeof (
          promises as Promise<
            [
              Awaited<ReturnType<typeof getTransactions>>,
              Awaited<ReturnType<typeof getTransactionStatusCounts>>,
              Awaited<ReturnType<typeof getTransactionAmountRange>>,
            ]
          >
        ).then !== "function"
      ) {
        setLoading(false);
        setData(null);
        return;
      }

      setLoading(true);

      try {
        // Wait for all promises in the array
        const [
          { data: transactionsData, pageCount },
          statusCounts,
          amountRange,
        ] = await promises;

        if (isMounted.current) {
          setData({
            transactionsData,
            pageCount,
            statusCounts,
            amountRange,
          });
        }
      } catch (error) {
        console.error("Failed to load course data:", error);
        if (isMounted.current) setData(null);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [promises]); // re-run when `promises` changes

  // Compute columns only if data available
  const columns = React.useMemo(() => {
    if (!data) return [];

    return getTransactionTableColumns({
      transactionsData: data.transactionsData,
      statusCounts: data.statusCounts,
      amountRange: data.amountRange,
      setData,
    });
  }, [data]);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data?.transactionsData ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    initialState: {  },
    getRowId: (row) => row.id,
    shallow: false,
    clearOnDefault: true,
    manualPagination: true,
    manualSorting: true,
  });

  if (loading || !data) {
    return <TransactionTableSkeleton />;
  }
  return (
    <div className={cn("flex w-full flex-col gap-2.5 relative")}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>

      <DataTable table={table} />

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};

export default TableView;
