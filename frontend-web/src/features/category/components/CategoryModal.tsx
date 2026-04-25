import { useState, useEffect } from "react";
import { X, Layers, Save, PackageSearch } from "lucide-react";
import type { CategoryType } from "../types";

interface CategoryModalProps {
  type: CategoryType;
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
}

export default function CategoryModal({ type, item, isOpen, onClose, onSave, loading }: CategoryModalProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [item, isOpen, type]);

  if (!isOpen) return null;

  const colorClass = type === "SERVICE" ? "indigo" : "emerald";

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${colorClass}-600 text-white rounded-2xl shadow-lg shadow-${colorClass}-500/20`}>
                {type === "SERVICE" ? <Layers size={20} /> : <PackageSearch size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">
                  {item ? 'Edit' : 'New'} {type === "SERVICE" ? 'Service' : 'Inventory'} Category
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Management System
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-8 grid gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
              <input
                className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-${colorClass}-500/20 transition font-bold text-slate-700`}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={`e.g. ${type === "SERVICE" ? 'Wash & Fold' : 'Chemicals'}`}
              />
            </div>
            
            <div>
              <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1`}>Description</label>
              <textarea
                className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-${colorClass}-500/20 transition font-bold text-slate-700 min-h-[100px] resize-none`}
                value={formData.description || ""}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the category usage..."
              />
            </div>

            <div className="flex items-center gap-3 px-1">
              <input
                type="checkbox"
                id="isActive"
                className={`w-5 h-5 rounded-lg border-slate-200 text-${colorClass}-600 focus:ring-${colorClass}-500/20`}
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="text-sm font-bold text-slate-600 cursor-pointer">Active and Visible</label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto p-8 border-t border-slate-100 flex gap-4 bg-slate-50/30">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={() => onSave(formData)}
              className={`flex-1 py-4 bg-${colorClass}-600 text-white font-bold rounded-2xl hover:bg-${colorClass}-700 transition shadow-lg shadow-${colorClass}-500/20 flex items-center justify-center gap-2`}
            >
              <Save size={18} />
              {item ? 'Update' : 'Create'} Category
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
