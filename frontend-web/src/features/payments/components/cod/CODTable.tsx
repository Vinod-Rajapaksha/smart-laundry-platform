import { Table, type TableColumn } from "../../../../components/ui/Table";
import { Badge, type BadgeVariant } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { UserCheck } from "lucide-react";
import type { CODPayment } from "../../types";

interface CODTableProps {
  data: CODPayment[];
  loading?: boolean;
  onViewDetails: (cod: CODPayment) => void;
}

export const CODTable = ({ data, loading, onViewDetails }: CODTableProps) => {
  const columns: TableColumn<CODPayment>[] = [
    {
      header: "Created Date",
      className: "w-[180px]",
      cell: (item) => {
        const d = new Date(item.createdAt);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{d.toLocaleDateString()}</span>
            <span className="text-xs text-slate-500">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      },
    },
    {
      header: "Order ID",
      cell: (item) => (
        <span className="text-emerald-600 font-bold hover:underline cursor-pointer tracking-tight">
          #{item.order?.orderNo || 'N/A'}
        </span>
      ),
    },
    {
      header: "Customer",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{item.user?.firstName || 'Unknown'} {item.user?.lastName || ''}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.user?.email?.split('@')[0] || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: "Collected By",
      cell: (item) => (
        item.collector ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] border border-slate-200 shadow-sm">
              <UserCheck size={12} className="text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-700">{item.collector.firstName} {item.collector.lastName}</span>
          </div>
        ) : (
          <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Unassigned</span>
        )
      ),
    },
    {
      header: "Amount",
      cell: (item) => (
        <span className="font-black text-slate-900">
          Rs.{item.payment?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => {
        const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
          COMPLETED: { variant: "success", label: "Collected" },
          PENDING: { variant: "warning", label: "Out for Collection" },
          FAILED: { variant: "danger", label: "Failed" },
        };
        const config = statusMap[item.status] || { variant: "default", label: item.status };
        return <Badge variant={config.variant} className="text-[9px] font-black uppercase tracking-tighter">{config.label}</Badge>;
      },
    },
    {
      header: "Action",
      className: "text-right",
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(item)}
          className="hover:bg-slate-50 border-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          View Audit
        </Button>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Compiling COD registries...</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={data}
    />
  );
};
