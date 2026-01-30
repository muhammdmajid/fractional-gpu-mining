"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table"
import { Skeleton } from "@/ui/primitives/skeleton"

interface CourseTableSkeletonProps {
  columnCount?: number
  rowCount?: number
  filterCount?: number
  cellWidths?: string[]
  withPagination?: boolean
}

export default function TransactionTableSkeleton({
  columnCount = 8,
  rowCount = 5,
  filterCount = 5,
  cellWidths = [
    "w-10",  // View icon
    "w-40",  // Course Name
    "w-24",  // Thumbnail
    "w-24",  // Level
    "w-24",  // Package
    "w-24",  // Language
    "w-20",  // Price
    "w-32",  // Category Name
  ],
  withPagination = true,
}: CourseTableSkeletonProps) {
  const headers = Array.from({ length: columnCount })
  const rows = Array.from({ length: rowCount })
  const filters = Array.from({ length: filterCount })

  return (
    <div className="space-y-6">
      {/* Top bar: Search and filter buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-60 rounded-md animate-pulse" />

        {/* Filter buttons skeletons */}
        {filters.map((_, index) => (
          <Skeleton
            key={index}
            className="h-10 w-24 rounded-md animate-pulse"
          />
        ))}

        <div className="ml-auto" />

        {/* Sort button skeleton */}
        <Skeleton className="h-10 w-20 rounded-md animate-pulse" />

        {/* View button skeleton */}
        <Skeleton className="h-10 w-20 rounded-md animate-pulse" />
      </div>

      {/* Table */}
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((_, i) => (
                <TableHead key={i} className="px-2">
                  <Skeleton
                    className={`h-4 ${cellWidths[i] || "w-24"} rounded-md animate-pulse`}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {headers.map((_, colIdx) => (
                  <TableCell key={colIdx} className="px-2">
                    <Skeleton
                      className={`h-6 ${cellWidths[colIdx] || "w-full"} rounded-md animate-pulse`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {withPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded-md animate-pulse" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-md animate-pulse" />
            <Skeleton className="h-10 w-28 rounded-md animate-pulse" />
            <Skeleton className="h-10 w-8 rounded-md animate-pulse" />
            <Skeleton className="h-10 w-8 rounded-md animate-pulse" />
            <Skeleton className="h-10 w-8 rounded-md animate-pulse" />
            <Skeleton className="h-10 w-8 rounded-md animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}
