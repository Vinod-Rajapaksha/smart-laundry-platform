import { useState, useEffect } from "react";
import { X, Save, MapPin, User, Mail, Phone, Briefcase, Power, ShieldCheck } from "lucide-react";
import type { Supplier } from "../types";

interface SupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSave: (data: Partial<Supplier>, id?: string) => Promise<void>;
  loading: boolean;
}

export const SupplierDrawer = ({ isOpen, onClose, supplier, onSave, loading }: SupplierDrawerProps) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        status: "ACTIVE",
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, supplier?._id);
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
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar font-poppins">
          <form id="supplier-form" onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Primary Details */}
            <section className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Enterprise Identity</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                    placeholder="Full Company Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Accountable Representative</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                    placeholder="Contact Name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Direct Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      required
                      type="email"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-xs"
                      placeholder="john@vendor.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Mobile/Office</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-xs"
                      placeholder="+94 7X XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Categorization & Logistics */}
            <section className="space-y-6 pt-2">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Operational Category</label>
                <div className="relative">
                  <input
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm"
                    placeholder="e.g. Detergents, Chemicals, Logistics"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Geographic HQ / Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-300" size={20} />
                  <textarea
                    required
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm resize-none"
                    placeholder="Principal operating address..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Lifecycle Status */}
            {supplier && (
              <section className="pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Operational Status</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "ACTIVE" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.status === "ACTIVE"
                      ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 shadow-lg"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                  >
                    <ShieldCheck size={16} />
                    Active Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "INACTIVE" })}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.status === "INACTIVE"
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
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Processing..." : (
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
