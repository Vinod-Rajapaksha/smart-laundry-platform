import { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Voucher } from "../types";
import { format } from "date-fns";
import { Ticket, Trash2, Pencil, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

interface VoucherTableProps {
  vouchers: Voucher[];
  onDelete: (id: string) => void;
  onEdit: (voucher: Voucher) => void;
}

export default function VoucherTable({ vouchers, onDelete, onEdit }: VoucherTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetId) onDelete(targetId);
    setConfirmOpen(false);
    setTargetId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTargetId(null);
  };

  const columns: TableColumn<Voucher>[] = [
    {
      header: "Voucher Code",
      cell: (voucher) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
            <Ticket size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-widest text-slate-900 uppercase">
              {voucher.code}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {voucher.voucherType}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Discount",
      cell: (voucher) => (
        <span className="font-bold text-slate-700">
          {voucher.discountType === "PERCENTAGE"
            ? `${voucher.discountValue || 0}% Off`
            : `LKR ${(voucher.discountValue || 0).toLocaleString()} Off`}
        </span>
      ),
    },
    {
      header: "Validity",
      cell: (voucher) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Ends
          </span>
          <span className="text-sm font-bold text-slate-600">
            {voucher.endDate && !isNaN(new Date(voucher.endDate).getTime())
              ? format(new Date(voucher.endDate), "MMM dd, yyyy")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Usage",
      cell: (voucher) => (
        <div className="flex flex-col gap-1.5 w-28">
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            <span>Used: {voucher.usedCount ?? 0}</span>
            <span>Max: {voucher.usageLimitTotal ?? "∞"}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-700 ${
                ((voucher.usedCount || 0) / (voucher.usageLimitTotal || 100)) > 0.8
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: voucher.usageLimitTotal
                  ? `${Math.min(
                      ((voucher.usedCount || 0) / voucher.usageLimitTotal) * 100,
                      100
                    )}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (voucher) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
            voucher.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-400 border-slate-100"
          }`}
        >
          {voucher.isActive ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (voucher) => (
        <div className="flex items-center justify-end gap-2">
          {/* Edit */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(voucher)}
            className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Pencil size={15} />
          </Button>

          {/* Delete */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => requestDelete(voucher._id)}
            className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden font-poppins mt-6">
        <Table columns={columns} data={vouchers} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Voucher?"
        description="This voucher will be permanently deleted. Any customers with this code will no longer be able to use it."
        confirmText="Yes, Delete"
        cancelText="Keep it"
        icon={<AlertTriangle size={32} />}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
