import { X, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import type { StatusUpdateOrder, OrderStatus } from "../types";

interface StatusUpdateConfirmModalProps {
  order: StatusUpdateOrder | null;
  targetStatus: OrderStatus | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const StatusUpdateConfirmModal = ({ order, targetStatus, onClose, onConfirm, loading }: StatusUpdateConfirmModalProps) => {
  if (!order || !targetStatus) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden font-poppins animate-in zoom-in-95 duration-200">
        <div className="flex flex-col">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">Confirm Status</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order #{order.orderNo}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* TRANSITION VISUAL */}
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="flex flex-col items-center">
                <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  {order.status}
                </div>
                <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase">Current</p>
              </div>
              
              <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                <ArrowRight size={20} />
              </div>

              <div className="flex flex-col items-center">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                  {targetStatus}
                </div>
                <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase">Target</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-4 items-center">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                Updating this status will notify the customer and trigger downstream automated processes.
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                disabled={loading}
                onClick={onClose}
                className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:border-slate-200 hover:text-slate-600 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={onConfirm}
                className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : "Yes, Update"}
              </button>
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-50 text-center">
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operation Logged Securely</p>
          </div>
        </div>
      </div>
    </>
  );
};
