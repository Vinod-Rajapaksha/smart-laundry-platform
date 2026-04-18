import { Table, type TableColumn } from "../../../components/ui/Table";
import type { Feedback } from "../types";
import { format } from "date-fns";
import { Star, User, Eye } from "lucide-react";

interface FeedbackTableProps {
  feedbacks: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
  loading?: boolean;
}

export default function FeedbackTable({ feedbacks, onViewDetails, loading }: FeedbackTableProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
      />
    ));
  };

  const columns: TableColumn<Feedback>[] = [
    {
      header: "Customer",
      cell: (f) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <User size={14} />
          </div>
          <span className="text-sm font-semibold text-slate-900 leading-none">ID-{f.userId.substring(0, 6).toUpperCase()}</span>
        </div>
      ),
    },
    {
      header: "Order",
      cell: (f) => (
        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
          ORD-{f.orderId.substring(0, 6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Rating",
      cell: (f) => (
        <div className="flex items-center gap-0.5">
          {renderStars(f.rating)}
        </div>
      ),
    },
    {
      header: "Review Snippet",
      cell: (f) => (
        <div className="max-w-[240px]">
          <p className="text-xs text-slate-600 italic truncate italic">"{f.comment}"</p>
          <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
            {format(new Date(f.createdAt), "MMM dd, yyyy")}
          </p>
        </div>
      ),
    },
    {
      header: "Publicity",
      cell: (f) => (
        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md w-fit border ${f.isActive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
          {f.isActive ? "VISIBLE" : "HIDDEN"}
        </div>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      cell: (f) => (
        <button
          onClick={() => onViewDetails(f)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-[13px] font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 ml-auto"
        >
          <Eye size={14} />
          View Review
        </button>
      ),
    },
  ];

  if (loading && feedbacks.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-12 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Loading customer reviews...</span>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <Star size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-500 font-semibold text-lg">No reviews found</span>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={feedbacks}
    />
  );
}
