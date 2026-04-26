import { Users, ShieldCheck, Tag } from "lucide-react";
import type { SupplierStats } from "../types";

interface SupplierStatsProps {
  stats: SupplierStats | null;
  loading: boolean;
}

export const SupplierStatsGrid = ({ stats, loading }: SupplierStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-white/5 group relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 scale-150 blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-700" />
        <div className="relative z-10 flex justify-between items-start">
           <div>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Vendors</p>
              <p className="text-4xl font-black text-white">{loading ? "..." : stats?.totalSuppliers}</p>
           </div>
           <div className="p-3 bg-white/10 rounded-2xl text-blue-400">
              <Users size={24} />
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
           <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Partners</p>
              <p className="text-4xl font-black text-blue-600">{loading ? "..." : stats?.activeSuppliers}</p>
           </div>
           <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <ShieldCheck size={24} />
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
           <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Stock Categories</p>
              <p className="text-4xl font-black text-slate-900">{loading ? "..." : stats?.totalCategories}</p>
           </div>
           <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <Tag size={24} />
           </div>
        </div>
      </div>
    </div>
  );
};
