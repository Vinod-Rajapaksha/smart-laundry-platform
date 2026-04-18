import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Voucher } from "../types";
import { format } from "date-fns";
import { Ticket, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface VoucherTableProps {
  vouchers: Voucher[];
  onDelete: (id: string) => void;
}

export default function VoucherTable({ vouchers, onDelete }: VoucherTableProps) {
  const columns: TableColumn<Voucher>[] = [
    {
      header: "Voucher Code",
      cell: (voucher) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
            <Ticket size={18} />
          </div>
          <span className="font-black tracking-widest text-slate-900 uppercase">{voucher.code}</span>
        </div>
      ),
    },
    {
      header: "Discount",
      cell: (voucher) => (
        <span className="font-bold text-slate-700">
          {voucher.discountType === "PERCENTAGE"
            ? `${voucher.discountValue}% Off`
            : `LKR ${voucher.discountValue.toLocaleString()} Off`}
        </span>
      ),
    },
    {
      header: "Validity",
      cell: (voucher) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration</span>
          <span className="text-sm font-bold text-slate-600">
            {format(new Date(voucher.expiryDate), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Usage Capacity",
      cell: (voucher) => (
        <div className="flex flex-col gap-1.5 w-28">
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            <span>Redeemed: {voucher.usedCount}</span>
            <span>Limit: {voucher.usageLimit}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-700 ${
                (voucher.usedCount / voucher.usageLimit) > 0.8 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (voucher) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
          voucher.isActive 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
            : "bg-slate-50 text-slate-400 border-slate-100"
        }`}>
          {voucher.isActive ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (voucher) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(voucher._id)}
          className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden font-poppins mt-6">
      <Table 
        columns={columns} 
        data={vouchers} 
      />
    </div>
  );
}
