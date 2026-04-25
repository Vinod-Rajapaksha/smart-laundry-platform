import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Ticket, Save, Calendar, Percent, Banknote, Globe, Leaf, Loader2 } from "lucide-react";
import type { Voucher, VoucherType } from "../types";
import { createVoucherSchema, updateVoucherSchema } from "../../../validation/promotion.schema";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher?: Voucher | null;
  onSave: (data: Partial<Voucher>) => void;
  loading?: boolean;
}

const toDateInput = (iso?: string | Date) => {
  if (!iso) return "";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return date.toISOString().split("T")[0];
};

const today = () => new Date().toISOString().split("T")[0];
const nextWeek = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export default function VoucherModal({
  isOpen,
  onClose,
  voucher,
  onSave,
  loading,
}: VoucherModalProps) {
  const isEditMode = !!voucher;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEditMode ? updateVoucherSchema : createVoucherSchema),
    defaultValues: {
      code: "",
      voucherType: "PUBLIC",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: undefined,
      maxDiscount: undefined,
      usageLimitPerUser: undefined,
      usageLimitTotal: undefined,
      startDate: today(),
      endDate: nextWeek(),
    },
  });

  const selectedVoucherType = watch("voucherType");
  const selectedDiscountType = watch("discountType");

  useEffect(() => {
    if (voucher) {
      reset({
        code: voucher.code,
        voucherType: voucher.voucherType,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderAmount: voucher.minOrderAmount || undefined,
        maxDiscount: voucher.maxDiscount || undefined,
        usageLimitPerUser: voucher.usageLimitPerUser || undefined,
        usageLimitTotal: voucher.usageLimitTotal || undefined,
        startDate: toDateInput(voucher.startDate),
        endDate: toDateInput(voucher.endDate),
      });
    } else {
      reset({
        code: "",
        voucherType: "PUBLIC",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: undefined,
        maxDiscount: undefined,
        usageLimitPerUser: undefined,
        usageLimitTotal: undefined,
        startDate: today(),
        endDate: nextWeek(),
      });
    }
  }, [voucher, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: any) => {
    const payload: Record<string, any> = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    if (isEditMode) {
      delete payload.code;
    }

    onSave(payload as any);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
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
          <div className="p-8 grid gap-7 flex-1 overflow-y-auto no-scrollbar">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
                Promo Code
              </label>
              <input
                readOnly={isEditMode}
                className={`w-full px-6 py-4 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 transition font-black text-xl text-slate-900 tracking-widest placeholder:text-slate-200 ${isEditMode ? "opacity-60 cursor-not-allowed" : ""} ${errors.code ? 'ring-2 ring-red-500/50' : ''}`}
                {...register("code")}
                placeholder="E.G. SUMMER2026"
              />
              {errors.code && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.code.message as string}</p>}
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
                    onClick={() => setValue("voucherType", type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${selectedVoucherType === type
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
                    onClick={() => setValue("discountType", "PERCENTAGE")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${selectedDiscountType === "PERCENTAGE"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-400"
                      }`}
                  >
                    <Percent size={14} />
                    <span className="text-[10px] font-black uppercase">%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("discountType", "FIXED")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${selectedDiscountType === "FIXED"
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
                  className={`w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 ${errors.discountValue ? 'ring-2 ring-red-500/50' : ''}`}
                  {...register("discountValue", { valueAsNumber: true })}
                />
                {errors.discountValue && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.discountValue.message as string}</p>}
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
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-sm ${errors.startDate ? 'ring-2 ring-red-500/50' : ''}`}
                    {...register("startDate")}
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
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 text-sm ${errors.endDate ? 'ring-2 ring-red-500/50' : ''}`}
                    {...register("endDate")}
                  />
                </div>
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="col-span-2 text-[10px] text-red-500 mt-1 ml-1 font-bold">
                  {errors.startDate?.message as string || errors.endDate?.message as string}
                </p>
              )}
            </div>

            {/* Optional limits */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Min Order (optional)
                </label>
                <input
                  type="number"
                  placeholder="—"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  {...register("minOrderAmount", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Max Discount (optional)
                </label>
                <input
                  type="number"
                  placeholder="—"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  {...register("maxDiscount", { valueAsNumber: true })}
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
                  placeholder="Unlimited"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  {...register("usageLimitPerUser", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                  Total Uses (optional)
                </label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-slate-700 placeholder:text-slate-300"
                  {...register("usageLimitTotal", { valueAsNumber: true })}
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
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 transition shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditMode ? "Save Changes" : "Set Promo Active"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
