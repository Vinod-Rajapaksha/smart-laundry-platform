import { X, Star, User, Calendar, ShieldCheck, MessageSquare, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { type Feedback, FEEDBACK_STATUS } from '../types';
import { format } from 'date-fns';
import { useState } from 'react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
  onUpdateStatus: (id: string, status: any) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const FeedbackDrawer = ({ isOpen, onClose, feedback, onUpdateStatus, onDelete, loading }: FeedbackDrawerProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  if (!isOpen || !feedback) return null;

  const formattedDate = format(new Date(feedback.createdAt), "MMMM dd, yyyy");

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
      />
    ));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/20">
            <MessageSquare size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 leading-none">Review Desk</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              Moderation ID: {feedback._id.substring(0, 8).toUpperCase()}
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
        <div className="flex-1 overflow-y-auto font-poppins bg-white">
          <div className="p-8 space-y-10">
            {/* Rating Section */}
            <div className="text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center">
              <div className="flex gap-1.5 mb-4">
                {renderStars(feedback.rating)}
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{feedback.rating.toFixed(1)} <span className="text-lg text-slate-400">/ 5.0</span></h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{feedback.status} Verification</p>
            </div>

            {/* Identities */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                  <p className="font-bold text-slate-900 text-base">{feedback.userId?.name || "Member"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                  ORD
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reference</p>
                  <p className="font-bold text-slate-900 text-base">#{feedback.orderId?.orderNo || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <section>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Review content</p>
              <div className="bg-slate-50/80 p-6 rounded-3xl italic text-slate-600 text-[16px] leading-relaxed border border-slate-100 shadow-inner">
                "{feedback.comment}"
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-400 px-2">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Captured on {formattedDate}</span>
              </div>
            </section>

            {/* Suggestions & Tags */}
            {(feedback.suggestions || (feedback.tags && feedback.tags.length > 0)) && (
              <section className="space-y-6">
                {feedback.suggestions && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Suggestions</p>
                    <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100/50 text-slate-700 text-sm leading-relaxed">
                      {feedback.suggestions}
                    </div>
                  </div>
                )}

                {feedback.tags && feedback.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {feedback.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* MODERATION AREA */}
            <div className="pt-6 space-y-4">
              <div className="flex gap-4">
                <button
                  disabled={loading || feedback.status === FEEDBACK_STATUS.APPROVED}
                  onClick={() => onUpdateStatus(feedback._id, FEEDBACK_STATUS.APPROVED)}
                  className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>
                <button
                  disabled={loading || feedback.status === FEEDBACK_STATUS.REJECTED}
                  onClick={() => onUpdateStatus(feedback._id, FEEDBACK_STATUS.REJECTED)}
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

                <button
                  disabled={loading}
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-4 bg-white border-2 border-rose-100 text-rose-500 font-bold rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Purge Permanently
                </button>
            </div>
          </div>
        </div>

        {/* Action Center Footer */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-slate-400 mt-1" />
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
              Compliance node: review data is immutable after approval but can be hidden via rejection if guidelines are violated.
            </p>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Purge Review"
        description="Are you absolutely sure? This will permanently erase the review from our systems. This action cannot be reversed."
        confirmText="Purge"
        onConfirm={() => {
          onDelete(feedback._id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        icon={<Trash2 size={32} />}
      />
    </>
  );
};
