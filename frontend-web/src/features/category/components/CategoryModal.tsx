import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Layers, Save, PackageSearch } from "lucide-react";
import type { CategoryType } from "../types";
import { serviceCategorySchema, inventoryCategorySchema } from "../../../validation/category.schema";

interface CategoryModalProps {
  type: CategoryType;
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
}

export default function CategoryModal({ type, item, isOpen, onClose, onSave, loading }: CategoryModalProps) {
  const schema = type === "SERVICE" ? serviceCategorySchema : inventoryCategorySchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      price: 0,
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description || "",
        isActive: item.isActive,
        price: item.price || 0,
      });
    } else {
      reset({
        name: "",
        description: "",
        isActive: true,
        price: 0,
      });
    }
  }, [item, isOpen, reset]);

  if (!isOpen) return null;

  const colorClass = type === "SERVICE" ? "indigo" : "emerald";

  const handleFormSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
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
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-8 grid gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
              <input
                className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-${colorClass}-500/20 transition font-bold text-slate-700 ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                {...register("name")}
                placeholder={`e.g. ${type === "SERVICE" ? 'Wash & Fold' : 'Chemicals'}`}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.name.message as string}</p>}
            </div>

            {type === "SERVICE" && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Base Price (LKR)</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-${colorClass}-500/20 transition font-bold text-slate-700 ${errors.price ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.price.message as string}</p>}
              </div>
            )}

            <div>
              <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1`}>Description</label>
              <textarea
                className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-${colorClass}-500/20 transition font-bold text-slate-700 min-h-[100px] resize-none`}
                {...register("description")}
                placeholder="Describe the category usage..."
              />
            </div>

            <div className="flex items-center gap-3 px-1">
              <input
                type="checkbox"
                id="isActive"
                className={`w-5 h-5 rounded-lg border-slate-200 text-${colorClass}-600 focus:ring-${colorClass}-500/20`}
                {...register("isActive")}
              />
              <label htmlFor="isActive" className="text-sm font-bold text-slate-600 cursor-pointer">Active and Visible</label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto p-8 border-t border-slate-100 flex gap-4 bg-slate-50/30">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-4 bg-${colorClass}-600 text-white font-bold rounded-2xl hover:bg-${colorClass}-700 transition shadow-lg shadow-${colorClass}-500/20 flex items-center justify-center gap-2`}
            >
              <Save size={18} />
              {item ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
