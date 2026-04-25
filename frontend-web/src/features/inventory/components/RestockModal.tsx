import { useState, useEffect } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import type { InventoryItem } from "../types";

interface RestockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (qty: number) => void;
}

export default function RestockModal({ item, isOpen, onClose, onConfirm }: RestockModalProps) {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    if (item) {
      setQty(item.batchQty || 10);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden animate-in zoom-in-95 duration-200 font-poppins">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Restock Request</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier: {(item.supplierId as any)?.name || "Assigned Vendor"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Initiating this request will generate an official purchase email to the supplier. You can override the batch quantity for this specific order below.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Order Quantity ({item.unit})</label>
            <input
              type="number"
              autoFocus
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition font-black text-lg text-slate-700"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <p className="text-[10px] text-slate-400 mt-2 italic px-1">Default batch size for this item is {item.batchQty} {item.unit}.</p>
          </div>

          <button
            onClick={() => onConfirm(qty)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Generate Reorder Email
          </button>
        </div>
      </div>
    </>
  );
}
