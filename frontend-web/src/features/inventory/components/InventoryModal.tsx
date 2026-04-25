import { useState, useEffect } from "react";
import { X, Package, Save, AlertCircle, Loader2 } from "lucide-react";
import type { InventoryItem, InventoryUnit } from "../types";
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
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    categoryName: "",
    unit: "PCS" as InventoryUnit,
    unitPrice: 0,
    qtyInStock: 0,
    reorderLevel: 5,
    batchQty: 10,
    isActive: true,
    supplierId: "",
  });

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

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
        } catch (error) {
          toast.error("Failed to load form dependencies");
        } finally {
          setFetchingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: "",
        categoryName: categories[0]?.name || "",
        unit: "PCS" as InventoryUnit,
        unitPrice: 0,
        qtyInStock: 0,
        reorderLevel: 5,
        batchQty: 10,
        isActive: true,
        supplierId: "",
      });
    }
  }, [item, isOpen, categories]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
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
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400">
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
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Premium Liquid Detergent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                <select
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.categoryName}
                  onChange={e => setFormData({ ...formData, categoryName: e.target.value })}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Unit of Measure</label>
                <select
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700 font-mono"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value as InventoryUnit })}
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
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.supplierId || ""}
                  onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map(sup => (
                    <option key={sup._id} value={sup._id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Price (LKR)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.unitPrice}
                  onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Stock Qty</label>
                <input
                  type="number"
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.qtyInStock}
                  onChange={e => setFormData({ ...formData, qtyInStock: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Reorder Level</label>
                <input
                  type="number"
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.reorderLevel}
                  onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Batch Qty (Order)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-bold text-slate-700"
                  value={formData.batchQty}
                  onChange={e => setFormData({ ...formData, batchQty: Number(e.target.value) })}
                />
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
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              disabled={loading || fetchingData}
              onClick={() => {
                if (!formData.supplierId) {
                  toast.error("Please select a supplier");
                  return;
                }
                onSave(formData);
              }}
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
