import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Percent, Plus, Trash2, Beaker, Star } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { LaundryService } from "../types";
import { serviceSchema, type ServiceInput } from "../../../validation/service.schema";
import { getInventory } from "../../inventory/api/inventory.api";
import type { InventoryItem } from "../../inventory/types";
import { categoryApi } from "../../category/api/category.api";
import type { ServiceCategory } from "../../category/types";
import { toast } from "react-hot-toast";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LaundryService>) => void;
  initialData: LaundryService | null;
}

export default function ServiceModal({ isOpen, onClose, onSubmit, initialData }: ServiceModalProps) {
  const [inventoryRegistry, setInventoryRegistry] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category: "Wash & Fold",
      unit: "KG",
      price: 0,
      isActive: true,
      isPopular: false,
      description: "",
      inventoryItems: []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventoryItems",
  });

  const isPopular = watch("isPopular");
  const isActive = watch("isActive");

  useEffect(() => {
    if (isOpen) {
      const fetchInventory = async () => {
        try {
          const response = await getInventory();
          const data = (response as any).items || response;
          setInventoryRegistry(Array.isArray(data) ? data : []);
        } catch (error) {
          toast.error("Failed to load inventory for mapping");
        }
      };
      fetchInventory();

      categoryApi.getAllCategories<ServiceCategory>("SERVICE").then((cats) => {
        const names = cats.map((c) => c.name);
        setCategories(names);
        if (!initialData && names.length > 0) {
          setValue("category", names[0]);
        }
      }).catch(() => { });
    }
  }, [isOpen, initialData, setValue]);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category: (initialData as any).category || (initialData as any).categoryName || "Wash & Fold",
        unit: (initialData as any).unit || "KG",
        price: (initialData as any).price || (initialData as any).basePrice || 0,
        isActive: initialData.isActive,
        isPopular: initialData.isPopular || false,
        description: initialData.description || "",
        inventoryItems: initialData.inventoryItems || []
      });
    } else {
      reset({
        name: "",
        category: categories[0] || "Wash & Fold",
        unit: "KG",
        price: 0,
        isActive: true,
        isPopular: false,
        description: "",
        inventoryItems: []
      });
    }
  }, [initialData, isOpen, categories, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: ServiceInput) => {
    onSubmit(data as any);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300 no-scrollbar">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
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

          <div className="p-8 space-y-8 flex-1">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Identity</label>
              <Input
                placeholder="e.g. Premium White Wash"
                className={`h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                {...register("name")}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.name.message}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none ring-offset-white focus:ring-2 focus:ring-blue-500/10"
                  {...register("category")}
                >
                  {categories.length === 0 && (
                    <option value="Wash & Fold">Wash & Fold</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
                  {...register("unit")}
                >
                  <option value="KG">Per Kilogram</option>
                  <option value="PCS">Per Piece</option>
                  <option value="SET">Per Set</option>
                  <option value="L">Per Liter</option>
                  <option value="ML">Per Milliliter</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Beaker className="text-blue-600" size={18} />
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Resources Required</label>
                </div>
                <button
                  type="button"
                  onClick={() => append({ itemId: "", quantity: 0.1 })}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition active:scale-95 shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">No items linked</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, idx) => {
                    const selectedItemId = watch(`inventoryItems.${idx}.itemId`);
                    const selectedItem = inventoryRegistry.find(i => i._id === selectedItemId);
                    return (
                      <div key={field.id} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex-1">
                          <select
                            className={`w-full h-10 bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-700 outline-none ${errors.inventoryItems?.[idx]?.itemId ? 'ring-1 ring-red-500' : ''}`}
                            {...register(`inventoryItems.${idx}.itemId` as const)}
                          >
                            <option value="" disabled>Select Item</option>
                            {inventoryRegistry.map(item => (
                              <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1 w-24">
                          <input
                            type="number"
                            step="0.01"
                            className={`w-full h-10 bg-slate-50 border-none rounded-lg text-xs font-bold text-center text-blue-600 ${errors.inventoryItems?.[idx]?.quantity ? 'ring-1 ring-red-500' : ''}`}
                            placeholder="Qty"
                            {...register(`inventoryItems.${idx}.quantity` as const, { valueAsNumber: true })}
                          />
                          <span className="text-[9px] font-black text-slate-400 uppercase">{selectedItem?.unit || ""}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="p-2 text-rose-400 hover:text-rose-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-[9px] text-slate-400 font-medium italic mt-2">Inventory will be deducted automatically per reservation.</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Percent size={12} /> Base Rate (LKR)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                className={`h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold ${errors.price ? 'ring-2 ring-red-500/50' : ''}`}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.price.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Narrative</label>
              <textarea
                placeholder="Describe special care instructions or process..."
                className="w-full p-6 h-32 bg-slate-50 border-none rounded-[2rem] text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none no-scrollbar"
                {...register("description")}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setValue("isPopular", !isPopular)}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${isPopular
                  ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm shadow-amber-500/10"
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
              >
                <Star size={18} className={isPopular ? "fill-amber-500" : ""} />
                <span className="text-xs font-black uppercase tracking-widest">Mark as Popular</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${isActive
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-500/10"
                  : "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-500/10"
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {isActive ? "Live in App" : "Inactive / Hidden"}
                </span>
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4 sticky bottom-0 z-10">
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
              className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Commit Service
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
