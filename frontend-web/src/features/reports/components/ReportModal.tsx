import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, FilePlus, Play, Calendar, Loader2 } from "lucide-react";
import { reportSchema, type ReportInput } from "../../../validation/report.schema";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
  loading?: boolean;
}

export default function ReportModal({ isOpen, onClose, onGenerate, loading }: ReportModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "SALES",
      periodFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodTo: new Date().toISOString().split('T')[0],
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: ReportInput) => {
    onGenerate({
      ...data,
      periodFrom: new Date(data.periodFrom).toISOString(),
      periodTo: new Date(data.periodTo).toISOString(),
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
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
            <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition text-slate-400 border border-transparent hover:border-slate-100 shadow-sm">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-10 grid gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Report Data Category</label>
              <select
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 ${errors.reportType ? 'ring-2 ring-red-500/50' : ''}`}
                {...register("reportType")}
              >
                <option value="SALES">Sales & Revenue</option>
                <option value="INVENTORY">Inventory Consumption</option>
                <option value="STAFF">Staff Performance</option>
                <option value="CUSTOMERS">Customer Acquisition</option>
              </select>
              {errors.reportType && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.reportType.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Timeframe Selection</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="date"
                    className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-xs ${errors.periodFrom ? 'ring-2 ring-red-500/50' : ''}`}
                    {...register("periodFrom")}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="date"
                    className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-xs ${errors.periodTo ? 'ring-2 ring-red-500/50' : ''}`}
                    {...register("periodTo")}
                  />
                </div>
              </div>
              {(errors.periodFrom || errors.periodTo) && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">
                  {errors.periodFrom?.message || errors.periodTo?.message}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-10 border-t border-slate-100 flex gap-4 bg-slate-50/30 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-100 transition shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 px-8 py-4.5 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-black transition shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <Play size={18} className="fill-white" />
                  Compile & Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
