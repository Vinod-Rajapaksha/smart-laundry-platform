import { Table, type TableColumn } from "../../../components/ui/Table";
import { type Feedback, FEEDBACK_STATUS } from "../types";
import { format } from "date-fns";
import { Star, MessageSquareCode, Eye } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface FeedbackTableProps {
  feedbacks: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
  loading?: boolean;
}

export const FeedbackTable = ({ feedbacks, onViewDetails, loading }: FeedbackTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case FEEDBACK_STATUS.APPROVED: return "bg-emerald-100 text-emerald-700";
      case FEEDBACK_STATUS.PENDING: return "bg-amber-100 text-amber-700";
      case FEEDBACK_STATUS.REJECTED: return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
      />
    ));
  };

  const columns: TableColumn<Feedback>[] = [
    {
      header: "Customer & Order",
      cell: (feedback) => (
        <div className="group">
          <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
            {feedback.userId?.name || "Anonymous"}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Order: #{feedback.orderId?.orderNo || 'N/A'}
          </p>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (feedback) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-0.5">
            {renderStars(feedback.rating)}
          </div>
          <span className="text-[10px] font-black text-slate-400">{feedback.rating.toFixed(1)} / 5.0</span>
        </div>
      ),
    },
    {
      header: "Review Snippet",
      cell: (feedback) => (
        <div className="max-w-[300px]">
          <p className="text-xs text-slate-600 line-clamp-1 italic">"{feedback.comment}"</p>
          <div className="flex gap-2 mt-1.5">
             {feedback.tags?.slice(0, 2).map(tag => (
               <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
                  {tag}
               </span>
             ))}
          </div>
        </div>
      ),
    },
    {
       header: "Date",
       cell: (feedback) => (
         <p className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
            {format(new Date(feedback.createdAt), "MMM dd, yyyy")}
         </p>
       )
    },
    {
      header: "Status & Actions",
      className: "text-right",
      cell: (feedback) => (
        <div className="flex items-center justify-end gap-3">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(feedback.status)}`}>
            {feedback.status}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(feedback)}
            className="p-2 h-9 w-9 rounded-xl border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm bg-white"
          >
            <Eye size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-20 flex flex-col items-center justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-b-blue-600 mb-4"></div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sifting through reviews...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <MessageSquareCode size={32} className="text-slate-200" />
        </div>
        <span className="text-slate-500 font-black uppercase tracking-widest text-sm">No Voices Found</span>
        <p className="text-slate-400 text-xs mt-1">Adjust filters to broaden your search.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      <Table
        columns={columns}
        data={feedbacks}
      />
    </div>
  );
};
