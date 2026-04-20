import { Wallet, X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import type { OnlineTransaction } from "../../types";

interface OnlineTransactionDrawerProps {
  transaction: OnlineTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineTransactionDrawer = ({ transaction, isOpen, onClose }: OnlineTransactionDrawerProps) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 font-poppins">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Status Header */}
          <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${transaction.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
              transaction.status === 'FAILED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
              }`}>
              <Wallet size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight text-center leading-none">
              Rs.{transaction.payment?.amount?.toFixed(2)}
            </h3>
            <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">{transaction.status}</p>
          </div>

          {/* Data Grid */}
          <div className="space-y-6">
            <section>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Payment Information</h4>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Method</span>
                  <span className="text-sm font-bold text-slate-800">Online (PayHere)</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order Number</span>
                  <span className="text-sm font-bold text-blue-600 underline">#{transaction.order?.orderNo}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gateway Order ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md">{transaction.gatewayOrderId}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gateway Payment ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md">{transaction.gatewayPaymentId}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Customer Profile</h4>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <p className="text-sm font-bold text-slate-800">{transaction.user?.firstName} {transaction.user?.lastName}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">{transaction.user?.email}</p>
              </div>
            </section>

            {transaction.rawResponse && (
              <section>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Gateway Response</h4>
                <pre className="p-4 bg-slate-900 rounded-2xl text-indigo-300 text-[10px] overflow-x-auto custom-scrollbar leading-relaxed border border-white/5">
                  {JSON.stringify(transaction.rawResponse, null, 2)}
                </pre>
              </section>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Button className="w-full h-12 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20" onClick={() => window.print()}>
            Archive Ledger Entry
          </Button>
        </div>
      </div>
    </div>
  );
};
