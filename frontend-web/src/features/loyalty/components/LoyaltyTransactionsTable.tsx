import { Table, type TableColumn } from "../../../components/ui/Table";
import type { LoyaltyTransaction } from "../types";
import { ArrowUpRight, ArrowDownLeft, Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";

interface LoyaltyTransactionsTableProps {
  transactions: LoyaltyTransaction[];
  loading?: boolean;
}

export default function LoyaltyTransactionsTable({ transactions, loading }: LoyaltyTransactionsTableProps) {
  const getTransactionIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EARNED':
        return (
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight size={18} />
          </div>
        );
      case 'REDEEMED':
        return (
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownLeft size={18} />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
            <Clock size={18} />
          </div>
        );
    }
  };

  const columns: TableColumn<LoyaltyTransaction>[] = [
    {
      header: "Member Details",
      cell: (data) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm relative">
             {data.loyaltyId?.userId?.avatar ? (
                <img src={data.loyaltyId.userId.avatar} alt="" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                   <User size={16} />
                </div>
             )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">
              {data.loyaltyId?.userId?.name || "Anonymous Member"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
               {data.loyaltyId?.userId?.email || 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Activity Type",
      cell: (data) => (
        <div className="flex items-center gap-3">
          {getTransactionIcon(data.type)}
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {data.type}
          </span>
        </div>
      ),
    },
    {
      header: "Points Impact",
      className: "text-center",
      cell: (data) => {
        const isPositive = data.type.toUpperCase() === 'EARNED';
        return (
          <div className={`flex flex-col items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span className="text-sm font-black tracking-tight">
              {isPositive ? '+' : '-'}{Math.abs(data.points || 0).toLocaleString()}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">
              Loyalty Credits
            </span>
          </div>
        );
      }
    },
    {
      header: "Rationale / Context",
      className: "w-[300px]",
      cell: (data) => (
        <div className="flex items-start gap-2 max-w-[280px]">
           <FileText size={14} className="text-slate-300 mt-1 shrink-0" />
           <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
             {data.description || 'System generated event'}
           </p>
        </div>
      ),
    },
    {
      header: "Logged At",
      className: "text-right",
      cell: (data) => (
        <div className="flex flex-col items-end">
          <p className="text-xs font-bold text-slate-900 tracking-tight">
            {format(new Date(data.createdAt), "MMM dd, yyyy")}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
             {format(new Date(data.createdAt), "HH:mm a")}
          </p>
        </div>
      ),
    },
  ];

  if (loading && transactions.length === 0) {
    return (
      <div className="w-full bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center border border-slate-100 shadow-xl shadow-slate-200/40">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-50 border-b-blue-600 mb-4"></div>
         <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Parsing Transaction Ledger...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-20 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
           <Clock size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-900 font-black text-xl mb-2">No Transactions Detected</span>
        <p className="text-slate-400 text-sm font-medium">The point history ledger is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Table
        columns={columns}
        data={transactions}
      />
    </div>
  );
}
