import { X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import type { CODPayment } from "../../types";

interface CODDrawerProps {
  cod: CODPayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CODDrawer({ cod, isOpen, onClose }: CODDrawerProps) {
  if (!isOpen || !cod) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300 font-poppins">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Collection Audit Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Stat */}
          <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Collection Value</span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rs.{cod.payment?.amount?.toFixed(2)}</h3>
            <Badge variant={cod.status === 'COMPLETED' ? 'success' : 'warning'} className="mt-4 text-[9px] px-4 py-1 font-black uppercase tracking-widest rounded-full">
              {cod.status === 'COMPLETED' ? 'Settled' : 'In Progress'}
            </Badge>
          </div>

          {/* Data Blocks */}
          <div className="space-y-8">
            <section>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Logistical Context</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-medium tracking-tight">Order Reference</span>
                  <span className="text-sm font-black text-emerald-600 tracking-tight">#{cod.order?.orderNo}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                  <span className="text-xs text-slate-500 font-medium tracking-tight">Collection Timestamp</span>
                  <span className="text-sm font-bold text-slate-800">
                    {cod.collectedAt ? new Date(cod.collectedAt).toLocaleString() : 'Pending Processing'}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Personnel Engagement</h4>
              <div className="space-y-5">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Customer</span>
                  <p className="text-sm font-black text-slate-800">{cod.user?.firstName} {cod.user?.lastName}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">{cod.user?.email}</p>
                </div>

                <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
                  <span className="block text-[10px] text-emerald-600 uppercase font-black tracking-widest mb-3 text-center">Assigned Logistics Partner</span>
                  {cod.collector ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 font-black shadow-sm">
                        {cod.collector.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">{cod.collector.firstName} {cod.collector.lastName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rider ID: {cod.collector._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest py-2">Mission Unassigned</p>
                  )}
                </div>
              </div>
            </section>

            {cod.notes && (
              <section>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Operational Notes</h4>
                <div className="text-sm text-slate-600 bg-amber-50/50 p-5 rounded-2xl border border-amber-100 italic leading-relaxed">
                  "{cod.notes}"
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-slate-200" onClick={onClose}>Dismiss</Button>
          <Button className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">Audit Complete</Button>
        </div>
      </div>
    </div>
  );
}
