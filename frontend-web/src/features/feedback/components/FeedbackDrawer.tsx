import { X, Star, User, Calendar, ShieldCheck, ShieldAlert, MessageSquare, Trash2, Power } from 'lucide-react';
import type { Feedback } from '../types';
import { format } from 'date-fns';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
  onToggleStatus: (id: string, current: boolean) => void;
  loading: boolean;
}

export default function FeedbackDrawer({ isOpen, onClose, feedback, onToggleStatus, loading }: FeedbackDrawerProps) {
  if (!isOpen || !feedback) return null;

  const formattedDate = format(new Date(feedback.createdAt), "MMMM dd, yyyy");

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
      />
    ));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-slate-100 bg-white">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-4 shadow-lg shadow-indigo-100">
            <MessageSquare size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1e293b]">Customer Review</h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Review Moderation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-8 space-y-8">

            {/* Rating & Identity */}
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {renderStars(feedback.rating)}
                </div>
                <span className="text-2xl font-black text-slate-900">{feedback.rating.toFixed(1)}</span>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">Customer ID-{feedback.userId.substring(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500 font-medium">Order: ORD-{feedback.orderId.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </section>

            {/* Comment Section */}
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">The Commentary</h3>
              <div className="bg-slate-50/80 p-5 rounded-2xl italic text-slate-600 text-[15px] leading-relaxed relative">
                <span className="absolute -top-3 -left-1 text-4xl text-slate-200 font-serif">“</span>
                {feedback.comment}
                <span className="absolute -bottom-6 -right-1 text-4xl text-slate-200 font-serif">”</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Submitted on {formattedDate}</span>
              </div>
            </section>

            {/* Status Section */}
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Moderation Status</h3>
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${feedback.isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                {feedback.isActive ? (
                  <ShieldCheck className="text-emerald-500" size={20} />
                ) : (
                  <ShieldAlert className="text-slate-400" size={20} />
                )}
                <div>
                  <p className={`text-sm font-bold ${feedback.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    Review is {feedback.isActive ? 'Publicly Visible' : 'Hidden from Public'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium lowercase">
                    This entry is {feedback.isActive ? 'visible' : 'not visible'} in the customer-facing mobile application.
                  </p>
                </div>
              </div>
            </section>

            {/* Primary Action */}
            <section className="pt-2">
              <button
                disabled={loading}
                onClick={() => onToggleStatus(feedback._id, feedback.isActive)}
                className={`w-full h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg disabled:opacity-50 ${feedback.isActive
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-amber-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100"
                  }`}
              >
                <Power size={20} />
                {feedback.isActive ? "Hide from Application" : "Approve & Publish Review"}
              </button>

              <button className="w-full mt-4 h-14 rounded-2xl border border-rose-100 text-rose-500 font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                <Trash2 size={20} />
                Delete Review Permanently
              </button>
            </section>

          </div>
        </div>

        {/* Footer info */}
        <div className="p-8 border-t border-slate-100 bg-white">
          <div className="px-6 py-4 bg-amber-50 rounded-2xl flex items-center justify-start gap-3 border border-amber-100/50">
            <ShieldCheck className="text-amber-500" size={18} />
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
              Compliance: Review moderation affects public SEO and TrustPilot integrations.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
