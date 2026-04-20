import { useState } from "react";
import { X, FilePlus, Play, Calendar } from "lucide-react";
import type { Report } from "../types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: Partial<Report>) => void;
  loading?: boolean;
}

export default function ReportModal({ isOpen, onClose, onGenerate, loading }: ReportModalProps) {
  const [formData, setFormData] = useState<Partial<Report>>({
    reportType: "SALES",
    periodFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodTo: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden font-poppins animate-in zoom-in-95 duration-300">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/10">
                <FilePlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">Generate Report</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Analytics</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition text-slate-400 border border-transparent hover:border-slate-100 shadow-sm">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-10 grid gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Report Data Category</label>
              <select
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700"
                value={formData.reportType}
                onChange={e => setFormData({ ...formData, reportType: e.target.value as any })}
              >
                <option value="SALES">Sales & Revenue</option>
                <option value="INVENTORY">Inventory Consumption</option>
                <option value="STAFF">Staff Performance</option>
                <option value="CUSTOMERS">Customer Acquisition</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Timeframe Selection</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-xs"
                    value={formData.periodFrom}
                    onChange={e => setFormData({ ...formData, periodFrom: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-xs"
                    value={formData.periodTo}
                    onChange={e => setFormData({ ...formData, periodTo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-10 border-t border-slate-100 flex gap-4 bg-slate-50/30">
            <button
              onClick={onClose}
              className="flex-1 py-4.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-100 transition shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={() => onGenerate({
                ...formData,
                periodFrom: formData.periodFrom ? new Date(formData.periodFrom).toISOString() : undefined,
                periodTo: formData.periodTo ? new Date(formData.periodTo).toISOString() : undefined,
              })}
              className="flex-2 px-8 py-4.5 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-black transition shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Play size={18} className="fill-white" />
              Compile & Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
