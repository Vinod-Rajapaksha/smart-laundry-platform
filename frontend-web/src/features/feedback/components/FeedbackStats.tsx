import { Star, MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import type { FeedbackStats } from "../types";

interface FeedbackStatsProps {
  stats: FeedbackStats | null;
  loading: boolean;
}

export const FeedbackStatsGrid = ({ stats, loading }: FeedbackStatsProps) => {
  if (!stats && !loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Average Rating */}
      <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl group overflow-hidden relative border border-slate-800">
        <div className="absolute inset-0 bg-blue-500/10 scale-150 blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Star size={14} className="text-blue-400 fill-blue-400" />
             </div>
             <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Satisfaction</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black">{loading ? "..." : stats?.averageRating.toFixed(1)}</p>
            <p className="text-sm font-bold text-slate-500">/ 5.0</p>
          </div>
        </div>
      </div>

      {/* Total Reviews */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-200 transition-all">
        <div className="flex items-center gap-2 mb-3">
           <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              <MessageSquare size={14} className="text-slate-400 group-hover:text-blue-500" />
           </div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Reviews</p>
        </div>
        <p className="text-3xl font-black text-slate-900">{loading ? "..." : stats?.totalReviews}</p>
      </div>

      {/* Approved Average */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-200 transition-all">
        <div className="flex items-center gap-2 mb-3">
           <div className="p-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp size={14} className="text-emerald-500" />
           </div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Public Rating</p>
        </div>
        <div className="flex items-baseline gap-2">
           <p className="text-3xl font-black text-slate-900">{loading ? "..." : stats?.approvedAverageRating.toFixed(1)}</p>
           <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Verified</p>
        </div>
      </div>

      {/* Pending Moderation */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-200 transition-all">
        <div className="flex items-center gap-2 mb-3">
           <div className="p-1.5 bg-amber-50 rounded-lg">
              <ShieldAlert size={14} className="text-amber-500" />
           </div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Review</p>
        </div>
        <p className="text-3xl font-black text-amber-600">
           {loading ? "..." : stats?.statusBreakdown.find(s => s._id === "pending")?.count || 0}
        </p>
      </div>
    </div>
  );
};
