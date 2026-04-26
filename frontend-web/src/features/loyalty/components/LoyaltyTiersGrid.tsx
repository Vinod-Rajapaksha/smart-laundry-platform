import { Award, Zap, ShieldCheck, Gem, TrendingDown, CheckCircle2, Edit3 } from "lucide-react";
import type { LoyaltyTier } from "../types";
import { Button } from "../../../components/ui/Button";

interface LoyaltyTiersGridProps {
   tiers: LoyaltyTier[];
   onEdit: (tier: LoyaltyTier) => void;
   loading: boolean;
}

export const LoyaltyTiersGrid = ({ tiers, onEdit, loading }: LoyaltyTiersGridProps) => {
   const getTierIcon = (name: string) => {
      switch (name.toLowerCase()) {
         case 'platinum': return <Gem size={24} className="text-indigo-400" />;
         case 'gold': return <Zap size={24} className="text-amber-400" />;
         case 'silver': return <ShieldCheck size={24} className="text-slate-400" />;
         default: return <Award size={24} className="text-orange-400" />;
      }
   };

   const getTierGradient = (name: string) => {
      switch (name.toLowerCase()) {
         case 'platinum': return "from-indigo-600 via-indigo-500 to-purple-600";
         case 'gold': return "from-amber-600 via-amber-500 to-yellow-600";
         case 'silver': return "from-slate-600 via-slate-500 to-slate-700";
         default: return "from-orange-600 via-orange-500 to-red-600";
      }
   };

   if (loading && tiers.length === 0) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-[350px] bg-white rounded-[2.5rem] border border-slate-100" />
            ))}
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {tiers.map((tier) => (
            <div key={tier._id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2">
               {/* Top Banner Gradient */}
               <div className={`h-24 bg-gradient-to-br ${getTierGradient(tier.name)} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
                     {getTierIcon(tier.name)}
                  </div>
                  <div className="absolute bottom-4 left-6">
                     <h3 className="text-white text-xl font-black uppercase tracking-tighter">{tier.name}</h3>
                     <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{tier.minPoints}+ Points</p>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  {/* Benefit Badge */}
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Standard Benefit</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">
                           {tier.discountValue}{tier.discountType === 'PERCENTAGE' ? '%' : ' LKR'}
                           <span className="text-[10px] text-slate-400 ml-1 uppercase">OFF</span>
                        </p>
                     </div>
                     <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <TrendingDown size={20} />
                     </div>
                  </div>

                  {/* Perks List */}
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Included Perks</p>
                     <div className="space-y-2">
                        {tier.perks.slice(0, 6).map((perk, i) => {
                           const lowerPerk = perk.toLowerCase();
                           let PerkIcon = CheckCircle2;
                           if (lowerPerk.includes('delivery')) PerkIcon = Zap;
                           if (lowerPerk.includes('priority')) PerkIcon = ShieldCheck;
                           if (lowerPerk.includes('discount') || lowerPerk.includes('off')) PerkIcon = TrendingDown;
                           if (lowerPerk.includes('free')) PerkIcon = Gem;

                           return (
                              <div key={i} className="flex items-start gap-2 group/perk">
                                 <div className="mt-0.5 p-0.5 bg-emerald-50 rounded-full group-hover/perk:bg-indigo-50 transition-colors">
                                    <PerkIcon size={10} className="text-emerald-500 group-hover/perk:text-indigo-600 transition-colors" />
                                 </div>
                                 <span className="text-[11px] font-bold text-slate-600 group-hover/perk:text-slate-900 transition-colors leading-tight">{perk}</span>
                              </div>
                           );
                        })}
                        {tier.perks.length === 0 && (
                           <p className="text-[10px] italic text-slate-300">No custom perks defined.</p>
                        )}
                     </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 flex gap-2">
                     <Button
                        onClick={() => onEdit(tier)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20"
                     >
                        <Edit3 size={14} className="mr-2" />
                        Configure
                     </Button>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
};
