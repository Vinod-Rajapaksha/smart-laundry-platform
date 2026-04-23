import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Package, Save, AlertCircle, Loader2 } from "lucide-react";
import type { InventoryItem } from "../types";
import { inventorySchema, type InventoryInput } from "../../../validation/inventory.schema";
import { categoryApi } from "../../category/api/category.api";
import { suppliersApi } from "../../suppliers/api/suppliers.api";
import type { InventoryCategory } from "../../category/types";
import type { Supplier } from "../../suppliers/types";
import { toast } from "react-hot-toast";

interface InventoryModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => void;
  loading?: boolean;
}

export default function InventoryModal({ item, isOpen, onClose, onSave, loading }: InventoryModalProps) {
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventoryInput>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      categoryName: "",
      unit: "PCS",
      unitPrice: 0,
      qtyInStock: 0,
      reorderLevel: 5,
      batchQty: 10,
      isActive: true,
      supplierId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setFetchingData(true);
          const [catData, supData] = await Promise.all([
            categoryApi.getAllCategories<InventoryCategory>("INVENTORY"),
            suppliersApi.getSuppliers()
          ]);
          setCategories(catData);
          setSuppliers(Array.isArray(supData) ? supData : (supData as any)?.suppliers || []);

          if (!item && catData.length > 0) {
            setValue("categoryName", catData[0].name);
          }
        } catch (error) {
          toast.error("Failed to load form dependencies");
        } finally {
          setFetchingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen, item, setValue]);

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        categoryName: item.categoryName,
        unit: item.unit as any,
        unitPrice: item.unitPrice,
        qtyInStock: item.qtyInStock,
        reorderLevel: item.reorderLevel,
        batchQty: item.batchQty || 0,
        supplierId: typeof item.supplierId === 'object' ? (item.supplierId as any)._id : item.supplierId,
        isActive: item.isActive,
      });
    } else {
      reset({
        name: "",
        categoryName: categories[0]?.name || "",
        unit: "PCS",
        unitPrice: 0,
        qtyInStock: 0,
        reorderLevel: 5,
        batchQty: 10,
        isActive: true,
        supplierId: "",
      });
    }
  }, [item, isOpen, categories, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: InventoryInput) => {
    onSave(data as any);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">{item ? 'Edit Item' : 'New Stock Item'}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-8 grid gap-6 relative">
            {fetchingData && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Item Display Name</label>
                <input
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("name")}
                  placeholder="e.g. Premium Liquid Detergent"
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                <select
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.categoryName ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("categoryName")}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryName && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.categoryName.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Unit of Measure</label>
                <select
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 font-mono"
                  {...register("unit")}
                >
                  <option value="PCS">PCS (Pieces)</option>
                  <option value="KG">KG (Kilograms)</option>
                  <option value="L">L (Liters)</option>
                  <option value="ML">ML (Milliliters)</option>
                  <option value="SET">SET (Sets)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Supplier</label>
                <select
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.supplierId ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("supplierId")}
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map(sup => (
                    <option key={sup._id} value={sup._id}>{sup.name}</option>
                  ))}
                </select>
                {errors.supplierId && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.supplierId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Price (LKR)</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.unitPrice ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("unitPrice", { valueAsNumber: true })}
                />
                {errors.unitPrice && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.unitPrice.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Stock Qty</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.qtyInStock ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("qtyInStock", { valueAsNumber: true })}
                />
                {errors.qtyInStock && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.qtyInStock.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Reorder Level</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.reorderLevel ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("reorderLevel", { valueAsNumber: true })}
                />
                {errors.reorderLevel && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.reorderLevel.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Batch Qty (Order)</label>
                <input
                  type="number"
                  className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 ${errors.batchQty ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("batchQty", { valueAsNumber: true })}
                />
                {errors.batchQty && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.batchQty.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[11px] text-blue-600 font-bold uppercase tracking-tight">
              <AlertCircle size={14} />
              Set a reorder level to receive stock alerts
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
              disabled={loading || fetchingData}
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
