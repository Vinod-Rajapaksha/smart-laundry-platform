import { Table, type TableColumn } from "../../../../components/ui/Table";
import { Badge, type BadgeVariant } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Eye } from "lucide-react";
import type { OnlineTransaction } from "../../types";

interface OnlineTransactionTableProps {
  data: OnlineTransaction[];
  loading?: boolean;
  onViewDetails: (tx: OnlineTransaction) => void;
}

export const OnlineTransactionTable = ({ data, loading, onViewDetails }: OnlineTransactionTableProps) => {
  const columns: TableColumn<OnlineTransaction>[] = [
    {
      header: "Date/Time",
      className: "w-[180px]",
      cell: (tx) => {
        const d = new Date(tx.createdAt);
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
      cell: (tx) => (
        <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
          #{tx.order?.orderNo || 'N/A'}
        </span>
      ),
    },
    {
      header: "Customer",
      cell: (tx) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{tx.user?.firstName || 'Unknown'} {tx.user?.lastName || ''}</span>
          <span className="text-xs text-slate-500 lowercase">{tx.user?.email || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (tx) => (
        <span className="font-bold text-slate-900">
          Rs.{tx.payment?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (tx) => {
        const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
          COMPLETED: { variant: "success", label: "Completed" },
          PENDING: { variant: "warning", label: "Pending" },
          FAILED: { variant: "danger", label: "Failed" },
        };
        const config = statusMap[tx.status] || { variant: "default", label: tx.status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      header: "References",
      cell: (tx) => (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">G-OrderId: {tx.gatewayOrderId || 'N/A'}</span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">G-PayId: {tx.gatewayPaymentId || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      cell: (tx) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(tx)}
          className="flex items-center gap-2 hover:bg-slate-50"
        >
          <Eye size={14} />
          Details
        </Button>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Synchronizing online ledger...</p>
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
