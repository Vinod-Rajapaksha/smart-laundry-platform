import { Table, type TableColumn } from "../../../../components/ui/Table";
import type { Payment } from "../../types";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

interface ConsolidatedLedgerTableProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
}

export const ConsolidatedLedgerTable = ({ payments, onView }: ConsolidatedLedgerTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-700";
      case "PENDING": return "bg-amber-100 text-amber-700";
      case "FAILED": return "bg-rose-100 text-rose-700";
      case "VERIFYING": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const columns: TableColumn<Payment>[] = [
    {
      header: "Transaction",
      cell: (payment) => (
        <div>
          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">#{payment._id.substring(0, 8)}</p>
          <p className="text-[10px] text-slate-400 font-medium">
            {payment.paidAt && !isNaN(new Date(payment.paidAt).getTime())
              ? format(new Date(payment.paidAt), "MMM dd, HH:mm")
              : "Awaiting..."}
          </p>
        </div>
      ),
    },
    {
      header: "Order",
      cell: (payment) => {
        const displayId = typeof payment.orderId === 'object'
          ? (payment.orderId as any).orderNo
          : payment.orderId.substring(0, 4);
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
            ORD-{displayId}
          </span>
        );
      },
    },
    {
      header: "Method",
      cell: (payment) => (
        <div className="p-1 px-2 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200 uppercase w-fit">
          {payment.method}
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (payment) => (
        <span className="font-black text-slate-900">
          LKR {payment.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status & Actions",
      className: "text-right",
      cell: (payment) => (
        <div className="flex items-center justify-end gap-3 text-right">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(payment.status)}`}>
            {payment.status}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(payment)}
            className="rounded-xl border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm bg-white"
          >
            <Eye size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={payments}
    />
  );
};
