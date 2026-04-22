import { useState, useMemo, type ReactNode, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

export interface PaginationProps {
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
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export const Table = <T,>({ 
  columns, 
  data, 
  pagination, 
  enablePagination = true, 
  itemsPerPage = 10 
}: TableProps<T>) => {
  const [internalPage, setInternalPage] = useState(1);

  // Reset internal page if data length changes drastically (e.g. search filter applied)
  useEffect(() => {
    setInternalPage(1);
  }, [data?.length]);

  const internalPaginationData = useMemo(() => {
    if (!enablePagination || !data || pagination) return null;
    
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const safePage = Math.min(internalPage, totalPages);
    
    const startItem = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
    const endItem = Math.min(safePage * itemsPerPage, totalItems);

    return {
      currentPage: safePage,
      totalPages,
      startItem,
      endItem,
      totalItems,
      onPageChange: setInternalPage,
    };
  }, [data, internalPage, itemsPerPage, enablePagination, pagination]);

  const activePagination = pagination || internalPaginationData;
  
  const displayData = useMemo(() => {
    if (pagination) return data; // External pagination slices its own data usually, or backend does
    if (activePagination && enablePagination) {
      const startIndex = (activePagination.currentPage - 1) * itemsPerPage;
      return data?.slice(startIndex, startIndex + itemsPerPage) || [];
    }
    return data;
  }, [data, activePagination, enablePagination, itemsPerPage, pagination]);

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
            {displayData?.map((row, rowIndex) => (
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
            {(!displayData || displayData.length === 0) && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {activePagination && activePagination.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-[#f8fafc] gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Showing <span className="text-slate-800">{activePagination.startItem}</span> to{" "}
            <span className="text-slate-800">{activePagination.endItem}</span> of{" "}
            <span className="text-slate-800">{activePagination.totalItems}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => activePagination.onPageChange(activePagination.currentPage - 1)}
              disabled={activePagination.currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: activePagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === activePagination.currentPage;
              
              // Only show a few pages around the current page to prevent overflow
              if (
                activePagination.totalPages > 5 &&
                Math.abs(pageNum - activePagination.currentPage) > 1 &&
                pageNum !== 1 &&
                pageNum !== activePagination.totalPages
              ) {
                if (pageNum === 2 || pageNum === activePagination.totalPages - 1) {
                  return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => activePagination.onPageChange(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black transition-all ${isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-transparent text-slate-500 hover:bg-slate-200"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => activePagination.onPageChange(activePagination.currentPage + 1)}
              disabled={activePagination.currentPage === activePagination.totalPages}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};