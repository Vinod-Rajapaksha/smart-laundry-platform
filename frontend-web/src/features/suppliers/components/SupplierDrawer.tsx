import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, MapPin, User, Mail, Phone, Briefcase, Power, ShieldCheck, Loader2 } from "lucide-react";
import type { Supplier } from "../types";
import { createSupplierSchema, updateSupplierSchema } from "../../../validation/supplier.schema";
import { categoryApi } from "../../category/api/category.api";
import type { InventoryCategory } from "../../category/types";
import { toast } from "react-hot-toast";

interface SupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSave: (data: Partial<Supplier>, id?: string) => Promise<void>;
  loading: boolean;
}

export const SupplierDrawer = ({ isOpen, onClose, supplier, onSave, loading }: SupplierDrawerProps) => {
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(supplier ? updateSupplierSchema : createSupplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      status: "ACTIVE",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          setFetchingCategories(true);
          const data = await categoryApi.getAllCategories<InventoryCategory>("INVENTORY");
          setCategories(data);

          if (!supplier && data.length > 0) {
            setValue("category", data[0].name);
          }
        } catch (error) {
          toast.error("Failed to load inventory categories");
        } finally {
          setFetchingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen, supplier, setValue]);

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        category: supplier.category,
        status: supplier.status || "ACTIVE",
      });
    } else {
      reset({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        category: categories[0]?.name || "",
        status: "ACTIVE",
      });
    }
  }, [supplier, isOpen, categories, reset]);

  const handleFormSubmit = async (data: any) => {
    await onSave(data, supplier?._id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 animate-in fade-in transition-opacity" onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">{supplier ? "Modify Partner" : "Onboard Vendor"}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Supplier Lifecycle Management</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar font-poppins relative">
          {fetchingCategories && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          <form id="supplier-form" onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-8">
            {/* Primary Details */}
            <section className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Enterprise Identity</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                    placeholder="Full Company Name"
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.name.message as string}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Accountable Representative</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm ${errors.contactPerson ? 'ring-2 ring-red-500/50' : ''}`}
                    placeholder="Contact Name"
                    {...register("contactPerson")}
                  />
                </div>
                {errors.contactPerson && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.contactPerson.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Direct Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      type="email"
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-xs ${errors.email ? 'ring-2 ring-red-500/50' : ''}`}
                      placeholder="john@vendor.com"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.email.message as string}</p>}
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Mobile/Office</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-xs ${errors.phone ? 'ring-2 ring-red-500/50' : ''}`}
                      placeholder="07XXXXXXXX"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.phone.message as string}</p>}
                </div>
              </div>
            </section>

            {/* Categorization & Logistics */}
            <section className="space-y-6 pt-2">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Operational Category</label>
                <div className="relative">
                  <select
                    className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm ${errors.category ? 'ring-2 ring-red-500/50' : ''}`}
                    {...register("category")}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.category.message as string}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-300" size={20} />
                  <textarea
                    rows={3}
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm resize-none ${errors.address ? 'ring-2 ring-red-500/50' : ''}`}
                    placeholder="Principal operating address..."
                    {...register("address")}
                  />
                </div>
                {errors.address && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.address.message as string}</p>}
              </div>
            </section>

            {/* Lifecycle Status */}
            {supplier && (
              <section className="pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Operational Status</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setValue("status", "ACTIVE")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedStatus === "ACTIVE"
                      ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 shadow-lg"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                  >
                    <ShieldCheck size={16} />
                    Active Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("status", "INACTIVE")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedStatus === "INACTIVE"
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                  >
                    <Power size={16} />
                    Suspended
                  </button>
                </div>
              </section>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-50 bg-white sticky bottom-0">
          <button
            form="supplier-form"
            type="submit"
            disabled={loading || fetchingCategories}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} />
                {supplier ? "Sync Changes" : "Establish Partnership"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
