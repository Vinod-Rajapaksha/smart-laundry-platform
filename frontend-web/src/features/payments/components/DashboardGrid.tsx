import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Landmark,
  CreditCard,
  LayoutGrid,
  ArrowUpRight
} from "lucide-react";

export const DashboardGrid = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Consolidated Ledger",
      description: "Full transaction history across all payment methods for the platform.",
      icon: <LayoutGrid className="w-10 h-10 text-slate-600" />,
      bg: "bg-slate-50",
      border: "border-slate-100",
      link: "/admin/payments/ledger",
      accent: "from-slate-500/20 to-transparent"
    },
    {
      title: "Online Transactions",
      description: "Gateway payments processed via PayHere digital integration.",
      icon: <CreditCard className="w-10 h-10 text-blue-500" />,
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      link: "/admin/payments/online",
      accent: "from-blue-500/20 to-transparent"
    },
    {
      title: "COD Settlements",
      description: "Reconciliation of cash-on-delivery payments collected by riders.",
      icon: <Banknote className="w-10 h-10 text-emerald-500" />,
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      link: "/admin/payments/cod",
      accent: "from-emerald-500/20 to-transparent"
    },
    {
      title: "Bank Transfers",
      description: "Log of manual bank transfer records for historical auditing.",
      icon: <Landmark className="w-10 h-10 text-purple-500" />,
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      link: "/admin/payments/bank-transfer",
      accent: "from-purple-500/20 to-transparent"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {modules.map((module, idx) => (
        <div
          key={idx}
          onClick={() => navigate(module.link)}
          className="group relative cursor-pointer overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between min-h-[280px]"
        >
          {/* Background Accent */}
          <div className={`absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${module.accent} transition-transform group-hover:scale-125 duration-700`} />
          
          <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${module.bg} border ${module.border} mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              {typeof module.icon === 'object' ? (
                <div className="scale-75">{module.icon}</div>
              ) : module.icon}
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
              {module.title}
            </h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
              {module.description}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-6 border-t border-slate-50 pt-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">
              Open Module
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:translate-x-1 transition-all duration-500 shadow-lg shadow-slate-900/20 group-hover:shadow-blue-500/40">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
