import { useState } from "react";
import { X, Ticket, Save, Calendar, Percent, Banknote } from "lucide-react";
import type { Voucher } from "../types";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Voucher>) => void;
  loading?: boolean;
}

export default function VoucherModal({ isOpen, onClose, onSave, loading }: VoucherModalProps) {
  const [formData, setFormData] = useState<Partial<Voucher>>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    isActive: true,
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden font-poppins animate-in zoom-in-95 duration-300">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
                <Ticket size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">New Voucher</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Marketing Campaigns</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition text-slate-400 shadow-sm border border-transparent hover:border-slate-200">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-10 grid gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Promo Code</label>
              <input
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 transition font-black text-xl text-slate-900 tracking-widest placeholder:text-slate-200"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="E.G. SUMMER2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Type</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${formData.discountType === 'PERCENTAGE' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                  >
                    <Percent size={14} />
                    <span className="text-[10px] font-black uppercase">Percent</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, discountType: 'FIXED' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${formData.discountType === 'FIXED' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                  >
                    <Banknote size={14} />
                    <span className="text-[10px] font-black uppercase">Fixed</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Value</label>
                <input
                  type="number"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700"
                  value={formData.discountValue}
                  onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-sm"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Usage Limit</label>
                <input
                  type="number"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700"
                  value={formData.usageLimit}
                  onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/50">
            <button
              onClick={onClose}
              className="flex-1 py-4.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-100 transition shadow-sm active:scale-95 transition-transform"
            >
              Discard
            </button>
            <button
              disabled={loading}
              onClick={() => onSave(formData)}
              className="flex-2 px-8 py-4.5 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 transition shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Save size={20} />
              Set Promo Active
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
