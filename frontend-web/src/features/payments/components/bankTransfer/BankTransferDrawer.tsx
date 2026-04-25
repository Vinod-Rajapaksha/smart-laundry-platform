import { Landmark, X, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";
import type { PendingTransferData } from "../../../bank-verification/api/bank-verification.api";

interface BankTransferDrawerProps {
  tx: PendingTransferData | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export const BankTransferDrawer = ({ tx, isOpen, onClose }: BankTransferDrawerProps) => {
  if (!isOpen || !tx) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-in fade-in duration-300 font-poppins">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-slate-800">
          <h2 className="text-xl font-black tracking-tight">Financial Record Audit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Financial Summary */}
          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Transferred Amount</span>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Rs.{tx.paymentId?.amount?.toFixed(2)}</h3>
            </div>
            <Badge variant={tx.verifyStatus === 'APPROVED' ? 'success' : tx.verifyStatus === 'REJECTED' ? 'danger' : 'warning'} className="h-fit py-2 px-5 font-black uppercase text-[9px] tracking-widest rounded-full shadow-sm">
              {tx.verifyStatus}
            </Badge>
          </div>

          {/* Data Blocks */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Identity</h4>
                <div className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <span className="text-sm font-black text-slate-800">{tx.userId?.email}</span>
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Linked Order</h4>
                <span className="text-sm font-black text-purple-600 underline tracking-tight">#{tx.paymentId?.orderId?.orderNo}</span>
              </section>
            </div>
            <div className="space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Context</h4>
                <div className="text-[11px] text-slate-500 leading-relaxed font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  {new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Internal Audit ID</h4>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100/50">{tx.systemRefId.toUpperCase()}</span>
              </section>
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4 shadow-xl shadow-slate-900/10">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-2">
                <Landmark size={14} /> Institution Info
              </span>
              <span>Ref Tracking</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-base font-black tracking-tight">{tx.bankName}</span>
              <span className="text-base font-mono font-bold text-blue-400">{tx.referenceNo}</span>
            </div>
          </div>

          {/* OCR Check */}
          <section>
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              <CheckCircle2 size={14} className={tx.ocrStatus === 'MATCHED' ? 'text-emerald-500' : 'text-slate-300'} />
              OCR Intelligent Verification
            </h4>
            <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm transition-all ${tx.ocrStatus === 'MATCHED' ? 'bg-emerald-50/50 border-emerald-100' :
              tx.ocrStatus === 'MISMATCHED' ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50/50 border-slate-100'
              }`}>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${tx.ocrStatus === 'MATCHED' ? 'text-emerald-700' :
                  tx.ocrStatus === 'MISMATCHED' ? 'text-rose-700' : 'text-slate-400'
                  }`}>
                  {tx.ocrStatus || 'PROCESSING'}
                </span>
                <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-tight">Confidence: {Math.round((tx.ocrConfidence || 0) * 100)}%</span>
              </div>
              {tx.ocrStatus === 'MATCHED' && <CheckCircle2 size={24} className="text-emerald-500" />}
            </div>
          </section>

          {/* Payment Slip Backdrop */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cryptographic Proof (Slip)</h4>
            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden relative group aspect-[3/4] bg-slate-100 flex items-center justify-center shadow-inner mb-8">
              {tx.slipImageUrl ? (
                <img
                  src={tx.slipImageUrl}
                  alt="Bank Transfer Slip"
                  className="w-full h-full object-contain cursor-zoom-in hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300 animate-pulse">
                  <FileText size={48} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Digital Asset Missing</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
