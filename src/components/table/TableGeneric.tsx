"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  header: string;
  key: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface TableGenericProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
}

export default function TableGeneric<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
}: TableGenericProps<T>) {
  return (
    <table className="table-auto w-full border border-[var(--secondary-foreground)]">
      <thead className="bg-[var(--secondary)]">
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className="py-1 px-2 text-left text-lg text-[var(--secondary-foreground)] border-r border-l border-[var(--secondary-foreground)]"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-[var(--primary)] text-[var(--primary-foreground)]">
        {loading
          ? Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col, j) => (
                  <td key={j} className="px-2 text-center">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          : data.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--extra)]/10">
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className="px-2 text-sm text-left border border-[var(--primary-foreground)]/50"
                  >
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
}
