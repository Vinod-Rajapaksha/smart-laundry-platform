import { Table, type TableColumn } from "../../../components/ui/Table";
import { type StatusUpdateOrder, MANUAL_TRANSITIONS, ORDER_STATUS } from "../types";
import { ArrowRightCircle, CheckCircle2, History } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface StatusUpdateTableProps {
  orders: StatusUpdateOrder[];
  onUpdateStatus: (order: StatusUpdateOrder, nextStatus: any) => void;
}

export const StatusUpdateTable = ({ orders, onUpdateStatus }: StatusUpdateTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.READY: return "bg-emerald-100 text-emerald-700";
      case ORDER_STATUS.PROCESSING: return "bg-blue-100 text-blue-700";
      case ORDER_STATUS.DRYING: return "bg-sky-100 text-sky-700";
      case ORDER_STATUS.WASHING: return "bg-indigo-100 text-indigo-700";
      case ORDER_STATUS.HANDED_OVER: return "bg-purple-100 text-purple-700";
      case ORDER_STATUS.PICKED_UP: return "bg-amber-100 text-amber-700";
      case ORDER_STATUS.PICKUP_ARRIVED:
      case ORDER_STATUS.DELIVERY_ARRIVED: return "bg-teal-100 text-teal-700";
      case ORDER_STATUS.DELIVERED: return "bg-slate-100 text-slate-500";
      case ORDER_STATUS.CANCELLED: return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const columns: TableColumn<StatusUpdateOrder>[] = [
    {
      header: "Order Details",
      cell: (order) => (
        <div className="group">
          <div className="flex items-center gap-2">
            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">#{order.orderNo}</p>
            {order.status === ORDER_STATUS.READY && (
              <CheckCircle2 size={14} className="text-emerald-500" />
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            {order.userId?.name || "Quick Customer"}
          </p>
        </div>
      ),
    },
    {
      header: "Items & Amount",
      cell: (order) => (
        <div className="flex flex-col">
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">
              {order.serviceId?.name || "Laundry"}
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-900 mt-1">LKR {order.totalAmount.toLocaleString()}</p>
        </div>
      ),
    },
    {
      header: "Current Status",
      cell: (order) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: "Next Step",
      className: "text-right",
      cell: (order) => {
        const nextStatus = MANUAL_TRANSITIONS[order.status];
        const isUpdatable = !!nextStatus;

        return (
          <div className="flex items-center justify-end gap-3">
            {isUpdatable ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(order, nextStatus)}
                className="flex items-center gap-2 pr-4 h-10 rounded-2xl border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-blue-600 transition-all shadow-sm border font-black text-[10px] uppercase tracking-widest group"
              >
                <div className="p-1 bg-blue-100 rounded-lg group-hover:bg-blue-400 text-blue-600 group-hover:text-white transition-colors">
                  <ArrowRightCircle size={14} />
                </div>
                <span>Move to {nextStatus.replace(/_/g, ' ')}</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-2xl border border-dashed border-slate-200 text-[10px] font-bold uppercase tracking-widest">
                <History size={14} />
                <span>Processing...</span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      <Table
        columns={columns}
        data={orders}
      />
    </div>
  );
};
