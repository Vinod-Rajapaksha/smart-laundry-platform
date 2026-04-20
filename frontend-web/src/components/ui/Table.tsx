import { type ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: PaginationProps;
}

export const Table = <T,>({ columns, data, pagination }: TableProps<T>) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-white border-b border-slate-100">
            <tr>
              {columns?.map((col, index) => (
                <th key={index} className={`px-6 py-5 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data?.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#f8fafc] transition-colors group">
                {columns?.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-5 ${col.className || ""}`}>
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                        ? (row[col.accessorKey] as ReactNode)
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
          <span className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{pagination.startItem}</span> to{" "}
            <span className="font-semibold text-slate-700">{pagination.endItem}</span> of{" "}
            <span className="font-semibold text-slate-700">{pagination.totalItems}</span> results
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-600 text-[13px] font-medium hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === pagination.currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-[13px] font-semibold shadow-sm ${isActive
                      ? "bg-[#3b82f6] text-white"
                      : "bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-600 text-[13px] font-medium hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};