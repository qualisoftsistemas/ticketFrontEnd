// TableGeneric.tsx
import React from "react";

export interface Column<T> {
  header: string;
  key: keyof T;
  render?: (row: T) => React.ReactNode; 
}

interface TableGenericProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function TableGeneric<T>({
  columns,
  data,
}: TableGenericProps<T>) {
  return (
    <table className="table-auto w-full border-collapse">
      <thead className="bg-[var(--secondary)]">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="py-1 px-2 text-center">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-[var(--primary)]">
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={String(col.key)} className="py-1 px-2 text-center">
                {col.render ? col.render(row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
