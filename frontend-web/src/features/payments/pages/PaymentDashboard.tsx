import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Landmark,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const REVENUE_DATA = [
  { name: 'Mon', amount: 45000 },
  { name: 'Tue', amount: 52000 },
  { name: 'Wed', amount: 48000 },
  { name: 'Thu', amount: 61000 },
  { name: 'Fri', amount: 55000 },
  { name: 'Sat', amount: 67000 },
  { name: 'Sun', amount: 72000 },
];

const METHOD_DATA = [
  { name: 'Online', value: 45, color: '#3b82f6' },
  { name: 'COD', value: 35, color: '#10b981' },
  { name: 'Bank Transfer', value: 20, color: '#8b5cf6' },
];

export default function PaymentDashboard() {
  const navigate = useNavigate();

  const kpis = [
    {
      label: "Total Revenue (MoM)",
      value: "Rs. 1.2M",
      change: "+12.5%",
      trend: "up",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Success Rate",
      value: "98.2%",
      change: "+2.1%",
      trend: "up",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Pending Verifications",
      value: "14",
      change: "-5",
      trend: "down",
      icon: <Clock className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Active COD",
      value: "Rs. 84k",
      change: "Out for collection",
      trend: "neutral",
      icon: <Activity className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  const modules = [
    {
      title: "Online Transactions",
      description: "Automated PayHere gateway integration ledger.",
      icon: <CreditCard className="w-10 h-10 text-blue-500" />,
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      link: "/admin/payments/online",
      stats: "Rs. 540k this month"
    },
    {
      title: "Cash on Delivery",
      description: "Rider-collected cash settlement tracking.",
      icon: <Banknote className="w-10 h-10 text-emerald-500" />,
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      link: "/admin/payments/cod",
      stats: "32 pending settlements"
    },
    {
      title: "Bank Transfers",
      description: "Manual verification system for direct transfers.",
      icon: <Landmark className="w-10 h-10 text-purple-500" />,
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      link: "/admin/payments/bank-transfer",
      stats: "14 awaiting audit"
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-in fade-in zoom-in duration-500 font-poppins pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Financial Hub</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-3 opacity-60">Global Payment Command Center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Gateway Online</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-transform duration-300">
            <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-4`}>
              {kpi.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
              <span className={`text-[10px] font-black ${kpi.trend === 'up' ? 'text-emerald-500' : kpi.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trajectory</h2>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none ring-1 ring-slate-100">
              <option>Last 7 Days</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Method Split</h2>
          <div className="relative flex-1 flex flex-col justify-center items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={METHOD_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {METHOD_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '15px',
                      border: 'none',
                      fontSize: '10px',
                      fontWeight: 800
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 top-[40%] text-center">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Share</span>
                <span className="text-2xl font-black text-slate-800 tracking-tighter">100%</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full">
              {METHOD_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {modules.map((module, idx) => (
          <div
            key={idx}
            onClick={() => navigate(module.link)}
            className="group relative cursor-pointer overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 blur-3xl ${module.bg}`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${module.bg} border ${module.border} mb-8 shadow-inner transition-transform group-hover:scale-110 duration-500`}>
                {module.icon}
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{module.title}</h2>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 group-hover:text-slate-600 transition-colors">
                {module.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                  {module.stats}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg shadow-slate-900/20">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
