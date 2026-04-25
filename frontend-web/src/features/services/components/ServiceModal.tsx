import { useState, useEffect } from "react";
import { X, Save, Percent, Plus, Trash2, Beaker } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { LaundryService } from "../types";
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
  const [formData, setFormData] = useState<Partial<LaundryService>>({
    name: "",
    category: "Wash & Fold",
    unit: "KG",
    price: 0,
    isActive: true,
    isPopular: false,
    description: "",
    inventoryItems: []
  });

  const [inventoryRegistry, setInventoryRegistry] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
          setFormData((prev) => ({ ...prev, category: names[0] }));
        }
      }).catch(() => { });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        inventoryItems: initialData.inventoryItems || []
      });
    } else {
      setFormData({
        name: "",
        category: "Wash & Fold",
        unit: "KG",
        price: 0,
        isActive: true,
        isPopular: false,
        description: "",
        inventoryItems: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: (formData as any).price ?? (formData as any).basePrice ?? 0,
    };
    onSubmit(payload);
    onClose();
  };

  const addInventoryMapping = () => {
    const newItem = { itemId: "", quantity: 0.1 };
    setFormData({
      ...formData,
      inventoryItems: [...(formData.inventoryItems || []), newItem]
    });
  };

  const removeInventoryMapping = (index: number) => {
    const newList = [...(formData.inventoryItems || [])];
    newList.splice(index, 1);
    setFormData({ ...formData, inventoryItems: newList });
  };

  const updateInventoryMapping = (index: number, field: string, value: any) => {
    const newList = [...(formData.inventoryItems || [])];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, inventoryItems: newList });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300 no-scrollbar">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
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
                className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none ring-offset-white focus:ring-2 focus:ring-blue-500/10"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.length === 0 && (
                    <option value={formData.category}>{formData.category}</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
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
                  onClick={addInventoryMapping}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition active:scale-95 shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              {formData.inventoryItems?.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">No items linked</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.inventoryItems?.map((mapping, idx) => {
                    const selectedItem = inventoryRegistry.find(i => i._id === mapping.itemId);
                    return (
                      <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                        <select
                          className="flex-1 h-10 bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-700 outline-none"
                          value={mapping.itemId}
                          onChange={(e) => updateInventoryMapping(idx, "itemId", e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Item</option>
                          {inventoryRegistry.map(item => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1 w-24">
                          <input
                            type="number"
                            step="0.01"
                            className="w-full h-10 bg-slate-50 border-none rounded-lg text-xs font-bold text-center text-blue-600"
                            placeholder="Qty"
                            value={mapping.quantity}
                            onChange={(e) => updateInventoryMapping(idx, "quantity", Number(e.target.value))}
                            required
                          />
                          <span className="text-[9px] font-black text-slate-400 uppercase">{selectedItem?.unit || ""}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInventoryMapping(idx)}
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
                className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 text-base font-bold"
                value={(formData as any).price ?? (formData as any).basePrice ?? ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Narrative</label>
              <textarea
                placeholder="Describe special care instructions or process..."
                className="w-full p-6 h-32 bg-slate-50 border-none rounded-[2rem] text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none no-scrollbar"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

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
              className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20"
            >
              <Save size={18} className="mr-2" />
              Commit Service
            </Button>
          </div>
        </form>
      </div>
    </>
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
