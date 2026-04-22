import { Table, type TableColumn } from "../../../components/ui/Table";
import type { InventoryItem } from "../types";
import { AlertCircle, CheckCircle2, MoreVertical, Package, Trash2 } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function InventoryTable({ items, onEdit, onDelete, loading }: InventoryTableProps) {
  const columns: TableColumn<InventoryItem>[] = [
    {
      header: "Item Details",
      cell: (item) => {
        const isLowStock = item.qtyInStock <= item.reorderLevel;
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLowStock ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
              <Package size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{item.sku || "NO SKU"}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      cell: (item) => (
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
          {item.categoryName}
        </span>
      ),
    },
    {
      header: "Stock Level",
      cell: (item) => {
        const isLowStock = item.qtyInStock <= item.reorderLevel;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isLowStock ? "text-rose-600" : "text-slate-900"}`}>
                {item.qtyInStock} {item.unit}
              </span>
              {isLowStock && <AlertCircle size={14} className="text-rose-500" />}
            </div>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${isLowStock ? "bg-rose-500" : "bg-blue-500"}`}
                style={{ width: `${Math.min((item.qtyInStock / (item.reorderLevel * 2 || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Unit Price",
      cell: (item) => (
        <span className="font-semibold text-slate-900">
          LKR {(item.unitPrice || 0).toLocaleString()}
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

  if (loading && items.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-12 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Loading inventory...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <Package size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-500 font-semibold text-lg">No inventory items</span>
        <p className="text-slate-400 text-sm">Everything is clear for now.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={items}
    />
  );
}
