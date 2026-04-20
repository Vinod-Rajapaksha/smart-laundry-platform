import type { Payment } from "../../types";
import { X, Receipt, ExternalLink, Calendar, CreditCard, ShieldCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ConsolidatedLedgerDrawerProps {
  payment: Payment | null;
  onClose: () => void;
  onVerify: (id: string, status: 'PAID' | 'FAILED') => void;
  loading?: boolean;
}

export const ConsolidatedLedgerDrawer = ({ payment, onClose, onVerify, loading }: ConsolidatedLedgerDrawerProps) => {
  if (!payment) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <Receipt size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">Transaction</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {payment.transactionRef?.substring(0, 12) || 'N/A'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-8 space-y-10">
            {/* AMOUNT HERO */}
            <div className="text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Transfer Amount</p>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">LKR {payment.amount.toLocaleString()}</h3>
              <div className={`mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${payment.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                {payment.status}
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-slate-200">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <CreditCard size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Payment Method</p>
                  <p className="font-bold text-slate-800 uppercase text-sm tracking-widest">{payment.method}</p>
                </div>
                <ExternalLink size={14} className="text-slate-300" />
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-2xl shadow-sm">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Date & Time</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {payment.paidAt && !isNaN(new Date(payment.paidAt).getTime()) 
                      ? format(new Date(payment.paidAt), "MMMM dd, HH:mm:ss") 
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION CENTER */}
            {payment.status === "PENDING" && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Verification Required</span>
                </div>
                <div className="flex gap-4">
                  <button
                    disabled={loading}
                    onClick={() => onVerify(payment._id, 'FAILED')}
                    className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-rose-500 hover:text-rose-600 transition active:scale-95"
                  >
                    Reject
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => onVerify(payment._id, 'PAID')}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={20} />
                    Confirm
                  </button>
                </div>
              </section>
            )}
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[9px] text-center text-slate-400 leading-relaxed uppercase font-bold tracking-[0.2em]">
              Secure Payment Verification Node • Smart Laundry Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
