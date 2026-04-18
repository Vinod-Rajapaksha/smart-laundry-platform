import { useState, useEffect } from "react";
import { X, Save, Clock, Percent } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { LaundryService } from "../types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LaundryService>) => void;
  initialData: LaundryService | null;
}

export default function ServiceModal({ isOpen, onClose, onSubmit, initialData }: ServiceModalProps) {
  const [formData, setFormData] = useState<Partial<LaundryService>>({
    name: "",
    category: "Wash & Fold",
    unit: "KG",
    basePrice: 0,
    estimatedHours: 24,
    isActive: true,
    isPopular: false,
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        category: "Wash & Fold",
        unit: "KG",
        basePrice: 0,
        estimatedHours: 24,
        isActive: true,
        isPopular: false,
        description: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 font-poppins">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {initialData ? "Refine Service" : "New Offering"}
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure Laundry Service Parameters</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
            {/* Essential Identity */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Identity</label>
              <Input
                placeholder="e.g. Premium White Wash"
                className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none ring-offset-white focus:ring-2 focus:ring-blue-500/10"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option>Wash & Fold</option>
                  <option>Dry Cleaning</option>
                  <option>Ironing</option>
                  <option>Premium Care</option>
                </select>
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                >
                  <option value="KG">Per Kilogram</option>
                  <option value="PCS">Per Piece</option>
                  <option value="SET">Per Set</option>
                </select>
              </div>
            </div>

            {/* Financials & Logistics */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Percent size={12} /> Base Rate (LKR)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Clock size={12} /> Est. Time (Hours)
                </label>
                <Input
                  type="number"
                  placeholder="24"
                  className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Qualitative */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Narrative</label>
              <textarea
                placeholder="Describe special care instructions or process..."
                className="w-full p-6 h-32 bg-slate-50 border-none rounded-[2rem] text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none no-scrollbar"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Flags */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${formData.isPopular
                    ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm shadow-amber-500/10"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
              >
                <Star size={18} className={formData.isPopular ? "fill-amber-500" : ""} />
                <span className="text-xs font-black uppercase tracking-widest">Mark as Popular</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${formData.isActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-500/10"
                    : "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-500/10"
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${formData.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {formData.isActive ? "Live in App" : "Inactive / Hidden"}
                </span>
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-slate-200 bg-white"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20"
            >
              <Save size={18} className="mr-2" />
              Commit Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Star({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
