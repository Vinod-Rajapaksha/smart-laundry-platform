import { BankVerificationStatusPill } from "./BankVerificationStatusPill";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { type PendingTransferData } from "../api/bank-verification.api";
import { Search } from "lucide-react";

interface BankVerificationTableProps {
  data: PendingTransferData[];
  loading: boolean;
  onViewDetails: (item: PendingTransferData) => void;
}

export const BankVerificationTable = ({ data, loading, onViewDetails }: BankVerificationTableProps) => {

  const columns: TableColumn<PendingTransferData>[] = [
    {
      header: "Date/Time",
      cell: (tx) => {
        const d = new Date(tx.createdAt);
        return (
          <>
            <div className="font-semibold text-slate-800">{d.toLocaleDateString()}</div>
            <div className="text-slate-500 text-[13px] mt-0.5">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </>
        )
      },
    },
    {
      header: "Order ID",
      cell: (tx) => <span className="text-[#3b82f6] font-semibold">#{tx.paymentId?.orderId?.orderNo || 'N/A'}</span>,
    },
    {
      header: "Reference ID",
      cell: (tx) => <span className="text-slate-500">{tx.systemRefId}</span>,
    },
    {
      header: "Customer",
      cell: (tx) => {
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] bg-indigo-100 text-indigo-600 shadow-sm`}>
              {tx.userId?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-700 leading-tight">
                {tx.userId?.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {tx.userId?.email || "No email"}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      header: "Amount",
      cell: (tx) => <span className="font-bold text-slate-900">Rs.{tx.paymentId?.amount?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: "System Check",
      cell: (tx) => {
        if (!tx.ocrStatus || tx.ocrStatus === 'PENDING') {
          return <span className="text-slate-400 text-xs italic">Processing...</span>;
        }
        if (tx.ocrStatus === 'MATCHED') {
          return (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Verified
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[11px] uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            Mismatch
          </div>
        );
      },
    },
    {
      header: "Status",
      className: "text-center",
      cell: (tx) => <BankVerificationStatusPill status={tx.verifyStatus} />,
    },
    {
      header: "Action",
      className: "text-center",
      cell: (tx) => (
        <button
          onClick={() => onViewDetails(tx)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-[13px] font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          Audit Transfer
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl p-8 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold">Loading transfer requests...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center border-t border-slate-100">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-slate-300" />
          </div>
          <span className="text-slate-500 font-semibold text-lg">No bank transfers found</span>
          <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
        </div>
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