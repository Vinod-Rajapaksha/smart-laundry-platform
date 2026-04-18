import { Table, type TableColumn } from "../../../../components/ui/Table";
import { Badge, type BadgeVariant } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import type { PendingTransferData } from "../../../../features/bank-verification/api/bank-verification.api";

interface BankTransferTableProps {
  data: PendingTransferData[];
  loading?: boolean;
  onViewDetails: (tx: PendingTransferData) => void;
}

export default function BankTransferTable({ data, loading, onViewDetails }: BankTransferTableProps) {
  const columns: TableColumn<PendingTransferData>[] = [
    {
      header: "Submission Date",
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
        <span className="text-purple-600 font-bold hover:underline cursor-pointer tracking-tight">
          #{tx.paymentId?.orderId?.orderNo || 'N/A'}
        </span>
      ),
    },
    {
      header: "Customer",
      cell: (tx) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{tx.userId?.firstName} {tx.userId?.lastName}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.systemRefId.slice(-8)}</span>
        </div>
      ),
    },
    {
      header: "Bank Detail",
      cell: (tx) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter mb-0.5">{tx.bankName}</span>
          <span className="text-[10px] text-slate-500 font-bold">Ref: {tx.referenceNo}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (tx) => (
        <span className="font-black text-slate-900 leading-none">
          Rs.{tx.paymentId?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (tx) => {
        const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
          APPROVED: { variant: "success", label: "Approved" },
          PENDING: { variant: "warning", label: "Awaiting Verification" },
          REJECTED: { variant: "danger", label: "Rejected" },
        };
        const config = statusMap[tx.verifyStatus] || { variant: "default", label: tx.verifyStatus };
        return <Badge variant={config.variant} className="text-[9px] font-black uppercase tracking-tighter">{config.label}</Badge>;
      },
    },
    {
      header: "Action",
      className: "text-right",
      cell: (tx) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(tx)}
          className="border-purple-100 text-purple-700 hover:bg-purple-50 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          Audit Ledger
        </Button>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">Accessing financial records...</p>
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
