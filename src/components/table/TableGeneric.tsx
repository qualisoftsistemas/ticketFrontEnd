import React from "react";

export type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

type TableGenericProps<T> = {
  columns: Column<T>[];
  data: T[];
};

function TableGeneric<T extends Record<string, any>>({
  columns,
  data,
}: TableGenericProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border">
        <thead className="bg-[var(--secondary)] text-white">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left font-medium border-b border-gray-200"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--primary)] text-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-[var(--primary)]/80 transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 border-b border-gray-200"
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableGeneric;
