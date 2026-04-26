import { Table, type TableColumn } from "../../../components/ui/Table";
import type { CategoryType } from "../types";
import { CheckCircle2, MoreVertical, Layers, Trash2, PackageSearch } from "lucide-react";

interface CategoryTableProps {
  type: CategoryType;
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function CategoryTable({ type, data, onEdit, onDelete, loading }: CategoryTableProps) {
  const columns: TableColumn<any>[] = [
    {
      header: "Category Name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${type === "SERVICE" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}>
            {type === "SERVICE" ? <Layers size={18} /> : <PackageSearch size={18} />}
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{item._id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (item: any) => (
        <span className="text-sm text-slate-500 truncate max-w-[240px] block">
          {item.description || "—"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        item.isActive ? (
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
            <CheckCircle2 size={14} />
            Active
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Inactive</span>
        )
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600"
          >
            <MoreVertical size={18} />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-400 hover:text-rose-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-12 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Loading categories...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          {type === "SERVICE" ? <Layers size={32} className="text-slate-200" /> : <PackageSearch size={32} className="text-slate-200" />}
        </div>
        <span className="text-slate-500 font-semibold text-lg">No categories found</span>
        <p className="text-slate-400 text-sm">Start by adding a new {type.toLowerCase()} category.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={data}
    />
  );
}
