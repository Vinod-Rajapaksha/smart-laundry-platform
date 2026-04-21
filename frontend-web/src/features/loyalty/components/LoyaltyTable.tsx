import { Table, type TableColumn } from "../../../components/ui/Table";
import type { CustomerLoyalty } from "../types";
import { Award, TrendingUp, User } from "lucide-react";

interface LoyaltyTableProps {
  customers: CustomerLoyalty[];
  loading?: boolean;
}

export default function LoyaltyTable({ customers, loading }: LoyaltyTableProps) {
  const getTierColor = (tier: any) => {
    const tierName = typeof tier === 'string' ? tier : (tier?.name || 'basic');
    switch (tierName.toLowerCase()) {
      case "platinum": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "gold": return "text-amber-600 bg-amber-50 border-amber-200";
      case "silver": return "text-slate-600 bg-slate-50 border-slate-200";
      default: return "text-slate-500 bg-slate-100 border-slate-200";
    }
  };

  const columns: TableColumn<CustomerLoyalty>[] = [
    {
      header: "Customer",
      cell: (data) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-full text-slate-500">
            <User size={16} />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none mb-1">
              {data.userId?.name || "Anonymous Member"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap">
              {data.userId?.email || 'No email registered'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Current Tier",
      cell: (data) => (
        <div className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shadow-sm ${getTierColor(data.tierId)}`}>
          <Award size={12} />
          <span className="uppercase">
            {typeof data.tierId === 'string' ? 'Loading tier...' : (data.tierId?.name || 'Bronze')}
          </span>
        </div>
      ),
    },
    {
      header: "Loyalty Points",
      className: "text-center",
      cell: (data) => (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-blue-600 font-bold">
            <TrendingUp size={14} />
            <span>{(data.points || 0).toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap">Lifetime Balance</span>
        </div>
      ),
    },
    {
      header: "Total Revenue",
      className: "text-right",
      cell: (data) => (
        <span className="font-bold text-slate-900">
          LKR {(data.totalSpent || 0).toLocaleString()}
        </span>
      ),
    },
  ];

  if (loading && customers.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-12 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Accessing loyalty database...</span>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
          <Award size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-500 font-semibold text-lg">No loyalty records found</span>
        <p className="text-slate-400 text-sm">Customer loyalty profiles will appear here.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={customers}
    />
  );
}
