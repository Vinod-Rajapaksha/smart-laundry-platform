import { useState, useEffect } from "react";
import { X, Save, Percent, Banknote, Plus, Trash2, ShieldCheck, ListPlus } from "lucide-react";
import type { LoyaltyTier } from "../types";

interface TierManagementDrawerProps {
   isOpen: boolean;
   tier: LoyaltyTier | null;
   onClose: () => void;
   onSave: (id: string, data: Partial<LoyaltyTier>) => Promise<void>;
   loading: boolean;
}

export const TierManagementDrawer = ({ isOpen, tier, onClose, onSave, loading }: TierManagementDrawerProps) => {
   const [formData, setFormData] = useState<Partial<LoyaltyTier>>({
      minPoints: 0,
      discountType: 'PERCENTAGE',
      discountValue: 0,
      perks: [],
   });
   const [newPerk, setNewPerk] = useState("");

   useEffect(() => {
      if (tier) {
         setFormData({
            minPoints: tier.minPoints,
            discountType: tier.discountType || 'PERCENTAGE',
            discountValue: tier.discountValue,
            perks: [...tier.perks],
         });
      }
   }, [tier, isOpen]);

   const addPerk = () => {
      if (newPerk.trim() && !formData.perks?.includes(newPerk.trim())) {
         setFormData(prev => ({
            ...prev,
            perks: [...(prev.perks || []), newPerk.trim()]
         }));
         setNewPerk("");
      }
   };

   const removePerk = (index: number) => {
      setFormData(prev => ({
         ...prev,
         perks: prev.perks?.filter((_, i) => i !== index)
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (tier) {
         await onSave(tier._id, formData);
         onClose();
      }
   };

   if (!isOpen || !tier) return null;

   return (
      <>
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 animate-in fade-in" onClick={onClose} />
         <div className={`fixed inset-y-0 right-0 w-full max-w-[550px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-slate-900 leading-none">Configure {tier.name}</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 underline decoration-indigo-500/30 underline-offset-4">Benefit Protocol Optimization</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                  <X size={22} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar font-poppins">
               <form id="tier-form" onSubmit={handleSubmit} className="p-8 space-y-10">
                  {/* THRESHOLD */}
                  <section className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Activation Threshold</label>
                        <div className="relative group">
                           <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg group-focus-within:bg-indigo-50 transition-colors">
                              <Plus size={14} className="text-slate-500 group-focus-within:text-indigo-600" />
                           </div>
                           <input
                              type="number"
                              required
                              className="w-full pl-16 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-black text-lg"
                              placeholder="0"
                              value={formData.minPoints}
                              onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) })}
                           />
                           <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Points required</span>
                        </div>
                     </div>
                  </section>

                  {/* DIRECT BENEFITS */}
                  <section className="space-y-6">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Transaction Benefit</label>

                     <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                        <button
                           type="button"
                           onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                           className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.discountType === 'PERCENTAGE' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <Percent size={14} />
                           Percentage (%)
                        </button>
                        <button
                           type="button"
                           onClick={() => setFormData({ ...formData, discountType: 'FIXED' })}
                           className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.discountType === 'FIXED' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <Banknote size={14} />
                           Fixed (LKR)
                        </button>
                     </div>

                     <div className="relative group">
                        <input
                           type="number"
                           required
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-black text-lg"
                           placeholder="Value"
                           value={formData.discountValue}
                           onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-600 font-black">
                           {formData.discountType === 'PERCENTAGE' ? '%' : 'LKR'}
                        </div>
                     </div>
                  </section>

                  {/* CUSTOM PERKS */}
                  <section className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Incentive Perks (Icons Automapped)</label>

                     <div className="flex gap-2">
                        <div className="relative flex-1">
                           <input
                              className="w-full pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm"
                              placeholder="e.g. Free Express Pickup"
                              value={newPerk}
                              onChange={(e) => setNewPerk(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerk())}
                           />
                        </div>
                        <button
                           type="button"
                           onClick={addPerk}
                           className="p-4 bg-slate-900 text-white rounded-[1.25rem] hover:bg-slate-800 transition active:scale-95"
                        >
                           <Plus size={20} />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 gap-2 pt-2">
                        {formData.perks?.map((perk, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group/item hover:border-indigo-200 transition-all">
                              <div className="flex items-center gap-3">
                                 <ListPlus size={16} className="text-indigo-400" />
                                 <span className="text-sm font-bold text-slate-700">{perk}</span>
                              </div>
                              <button
                                 type="button"
                                 onClick={() => removePerk(i)}
                                 className="p-1.5 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                        {formData.perks?.length === 0 && (
                           <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No perks established</p>
                           </div>
                        )}
                     </div>
                  </section>
               </form>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-50 bg-white sticky bottom-0">
               <button
                  form="tier-form"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {loading ? "Optimizing Config..." : (
                     <>
                        <Save size={20} />
                        Propagate Tier Changes
                     </>
                  )}
               </button>
            </div>
         </div>
      </>
   );
};
