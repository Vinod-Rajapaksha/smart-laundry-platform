import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface KPIStatCardProps {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  Icon: LucideIcon;
  color: 'blue' | 'indigo' | 'emerald' | 'amber';
}

export default function KPIStatCard({ label, value, trend, isPositive, Icon, color }: KPIStatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold rounded-full px-2 py-1 ${isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mb-1 leading-none">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
