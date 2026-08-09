'use client';

import React from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = 'No data available' }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-mono text-[#66707D] bg-[#15181D] rounded-lg border border-[#252A31]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#252A31] rounded-lg bg-[#111419]">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-[#252A31] text-[#66707D] uppercase tracking-wider bg-[#15181D]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#252A31]/60">
          {data.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[#15181D] transition-colors">
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className={`py-3 px-4 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
