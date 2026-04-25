import { useState, useEffect } from "react";
import { X, Ticket, Save, Calendar, Percent, Banknote, Globe, Leaf } from "lucide-react";
import type { Voucher, VoucherType, DiscountType } from "../types";

type CreateVoucherForm = {
  code: string;
  voucherType: VoucherType;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: string;
  maxDiscount: string;
  usageLimitPerUser: string;
  usageLimitTotal: string;
  startDate: string;
  endDate: string;
};

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher?: Voucher | null;
  onSave: (data: Partial<Voucher>) => void;
  loading?: boolean;
}

const toDateInput = (iso?: string) =>
  iso ? new Date(iso).toISOString().split("T")[0] : "";

const today = () => new Date().toISOString().split("T")[0];
const nextWeek = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const emptyForm = (): CreateVoucherForm => ({
  code: "",
  voucherType: "PUBLIC",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minOrderAmount: "",
  maxDiscount: "",
  usageLimitPerUser: "",
  usageLimitTotal: "",
  startDate: today(),
  endDate: nextWeek(),
});

const voucherToForm = (v: Voucher): CreateVoucherForm => ({
  code: v.code,
  voucherType: v.voucherType,
  discountType: v.discountType,
  discountValue: v.discountValue,
  minOrderAmount: v.minOrderAmount != null ? String(v.minOrderAmount) : "",
  maxDiscount: v.maxDiscount != null ? String(v.maxDiscount) : "",
  usageLimitPerUser: v.usageLimitPerUser != null ? String(v.usageLimitPerUser) : "",
  usageLimitTotal: v.usageLimitTotal != null ? String(v.usageLimitTotal) : "",
  startDate: toDateInput(v.startDate),
  endDate: toDateInput(v.endDate),
});

export default function VoucherModal({
  isOpen,
  onClose,
  voucher,
  onSave,
  loading,
}: VoucherModalProps) {
  const isEditMode = !!voucher;

  const [formData, setFormData] = useState<CreateVoucherForm>(
    voucher ? voucherToForm(voucher) : emptyForm()
  );

  useEffect(() => {
    if (isOpen) {
      setFormData(voucher ? voucherToForm(voucher) : emptyForm());
    }
  }, [isOpen, voucher]);

  if (!isOpen) return null;

  const set = (field: keyof CreateVoucherForm, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {
      voucherType: formData.voucherType,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (!isEditMode) payload.code = formData.code;

    if (formData.minOrderAmount) payload.minOrderAmount = Number(formData.minOrderAmount);
    if (formData.maxDiscount) payload.maxDiscount = Number(formData.maxDiscount);
    if (formData.usageLimitPerUser) payload.usageLimitPerUser = Number(formData.usageLimitPerUser);
    if (formData.usageLimitTotal) payload.usageLimitTotal = Number(formData.usageLimitTotal);

    onSave(payload as Partial<Voucher>);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
                <Ticket size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-none">
                  {isEditMode ? "Edit Voucher" : "New Voucher"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {isEditMode ? `Code: ${voucher!.code}` : "Marketing Campaigns"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white rounded-xl transition text-slate-400 shadow-sm border border-transparent hover:border-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <div className="p-8 grid gap-7 flex-1 overflow-y-auto">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
                Promo Code
              </label>
              <input
                readOnly={isEditMode}
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 transition font-black text-xl text-slate-900 tracking-widest placeholder:text-slate-200 ${isEditMode ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                value={formData.code}
                onChange={(e) =>
                  !isEditMode && set("code", e.target.value.toUpperCase())
                }
                placeholder="E.G. SUMMER2026"
              />
            </div>

            {/* Voucher Audience */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                Voucher Audience
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {(["PUBLIC", "SEASONAL"] as VoucherType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set("voucherType", type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${formData.voucherType === type
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-400"
                      }`}
                  >
                    {type === "PUBLIC" ? <Globe size={14} /> : <Leaf size={14} />}
                    <span className="text-[10px] font-black uppercase">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Discount Type
                </label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => set("discountType", "PERCENTAGE")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${formData.discountType === "PERCENTAGE"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-400"
                      }`}
                  >
                    <Percent size={14} />
                    <span className="text-[10px] font-black uppercase">%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => set("discountType", "FIXED")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${formData.discountType === "FIXED"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-400"
                      }`}
                  >
                    <Banknote size={14} />
                    <span className="text-[10px] font-black uppercase">Fixed</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Value
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700"
                  value={formData.discountValue}
                  onChange={(e) => set("discountValue", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-sm"
                    value={formData.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-sm"
                    value={formData.endDate}
                    onChange={(e) => set("endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Optional limits */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Min Order (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="—"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  value={formData.minOrderAmount}
                  onChange={(e) => set("minOrderAmount", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Max Discount (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="—"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  value={formData.maxDiscount}
                  onChange={(e) => set("maxDiscount", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Uses / User (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Unlimited"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  value={formData.usageLimitPerUser}
                  onChange={(e) => set("usageLimitPerUser", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Total Uses (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Unlimited"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  value={formData.usageLimitTotal}
                  onChange={(e) => set("usageLimitTotal", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-8 border-t border-slate-100 flex gap-6 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-100 transition shadow-sm active:scale-95"
            >
              Discard
            </button>
            <button
              type="button"
              disabled={loading || (!isEditMode && !formData.code)}
              onClick={handleSubmit}
              className="flex-[2] px-8 py-4 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 transition shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Saving…" : isEditMode ? "Save Changes" : "Set Promo Active"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
