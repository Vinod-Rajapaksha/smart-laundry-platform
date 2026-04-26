import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Order } from "../types";
import { format } from "date-fns";
import { Eye } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  loading?: boolean;
}

export default function OrderTable({ orders, onViewDetails, loading }: OrderTableProps) {
  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "order_placed" || s === "pending") return "bg-amber-100 text-amber-700";
    if (s.includes("pickup") || s === "picked_up") return "bg-blue-100 text-blue-700";
    if (s === "processing" || s === "washing" || s === "drying" || s === "handed_over") return "bg-indigo-100 text-indigo-700";
    if (s.includes("delivery") || s === "delivered" || s === "completed") return "bg-emerald-100 text-emerald-700";
    if (s === "cancelled") return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700";
  };

  const columns: TableColumn<Order>[] = [
    {
      header: "Order No",
      cell: (order) => (
        <span className="font-bold text-slate-900 tracking-tight">#{order.orderNo}</span>
      ),
    },
    {
      header: "Customer Name",
      cell: (order) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-sm">
            {typeof order.userId === 'object' ? order.userId?.name : 'Member'}
          </span>
          <span className="text-slate-400 font-mono text-[9px] uppercase tracking-tighter">
            ID: {(typeof order.userId === 'string' ? order.userId : order.userId?._id || '').slice(-8)}
          </span>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (order) => (
        <span className="text-slate-600 text-sm">
          {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
            ? format(new Date(order.createdAt), "MMM dd, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Grand Total",
      cell: (order) => (
        <span className="font-black text-slate-900">
          LKR {order.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Payment",
      cell: (order) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ring-1 ring-inset ${order.paymentStatus === "PAID"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : "bg-amber-50 text-amber-700 ring-amber-600/20"
          }`}>
          {order.paymentStatus}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (order) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
          {formatStatus(order.status)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (order) => (
        <button
          onClick={() => onViewDetails(order)}
          className="p-2 hover:bg-blue-50 rounded-xl transition-all text-slate-400 hover:text-blue-600 group"
          title="View Details"
        >
          <Eye size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      ),
    },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-12 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Streaming order ledger...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-4">
          <Eye size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-500 font-semibold text-lg">No orders matched</span>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={orders}
    />
  );
}
