import { useState, useEffect, useCallback } from "react";
import { getDashboardKPIs } from "../api/dashboard.api";
import type { DashboardKPIs, DateRange } from "../types";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Truck,
  Activity,
  RefreshCcw,
  Star,
  Package,
  Ticket,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import KPIStatCard from "./KPIStatCard";
import RevenueChart from "./RevenueChart";
import StatusDistributionChart from "./StatusDistributionChart";
import DateRangeFilter from "./DateRangeFilter";
import { DashboardHeader } from "./DashboardHeader";

export default function DashboardContainer() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRange, setActiveRange] = useState<DateRange>("today");

  const fetchData = useCallback(async (showToast = false) => {
    try {
      const kpis = await getDashboardKPIs(activeRange);
      setData(kpis);

      if (showToast) toast.success("Dashboard data synchronized");
    } catch (error) {
      toast.error("Cloud synchronization failed");
    } finally {
      setRefreshing(false);
    }
  }, [activeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRangeLabel = (base: string) => {
    switch (activeRange) {
      case 'today': return `Today's ${base}`;
      case 'yesterday': return `Yesterday's ${base}`;
      case 'week': return `Weekly ${base}`;
      case 'month': return `Monthly ${base}`;
      case 'year': return `Yearly ${base}`;
      case 'overall': return `Total ${base}`;
      default: return `Today's ${base}`;
    }
  };

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-8 animate-in fade-in zoom-in duration-700 font-poppins pb-20">

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <DashboardHeader />
        <div className="flex items-center gap-3 pt-2">
          <DateRangeFilter activeRange={activeRange} onRangeChange={setActiveRange} />
          <button
            disabled={refreshing}
            onClick={() => fetchData(true)}
            className={`p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90 shadow-sm flex items-center justify-center group ${refreshing ? 'bg-indigo-50/50' : ''}`}
          >
            <RefreshCcw
              size={20}
              className={`${refreshing ? 'animate-spin text-indigo-600' : 'group-hover:rotate-180'} transition-transform duration-500`}
            />
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIStatCard
          label={getRangeLabel("Revenue")}
          value={`LKR ${(data?.todayRevenue || 0).toLocaleString()}`}
          trend="Real-time"
          isPositive={true}
          Icon={DollarSign}
          color="blue"
        />
        <KPIStatCard
          label={getRangeLabel("Orders")}
          value={(data?.newOrders || 0).toString()}
          trend="Aggregated"
          isPositive={true}
          Icon={ShoppingCart}
          color="indigo"
        />
        <KPIStatCard
          label="Active Staff"
          value={(data?.activeStaff || 0).toString()}
          trend="On Duty"
          isPositive={true}
          Icon={Users}
          color="emerald"
        />
        <KPIStatCard
          label="Logistics Queue"
          value={(data?.pendingDeliveries || 0).toString()}
          trend="Pending"
          isPositive={(data?.pendingDeliveries || 0) < 5}
          Icon={Truck}
          color="amber"
        />
      </div>

      {/* PLATFORM HEALTH SUMMARY */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900">
          <Activity size={20} className="text-indigo-500" />
          Cross-Module Systems
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-100">
            <Star size={20} className="text-amber-500" />
            <span className="text-xl font-black text-slate-900">{data?.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Avg Rating</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-100">
            <Package size={20} className="text-rose-500" />
            <span className="text-xl font-black text-slate-900">{data?.lowStockItems || 0}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Low Stock</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-100">
            <Layers size={20} className="text-blue-500" />
            <span className="text-xl font-black text-slate-900">{data?.activeServices || 0}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Services</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-100">
            <Ticket size={20} className="text-emerald-500" />
            <span className="text-xl font-black text-slate-900">{data?.activeVouchers || 0}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vouchers</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-100">
            <Users size={20} className="text-indigo-500" />
            <span className="text-xl font-black text-slate-900">{data?.totalCustomers || 0}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Customers</span>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-black text-slate-900">Revenue Trajectory</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">LKR Cumulative Growth</p>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Live Sync</div>
          </div>
          <RevenueChart data={data?.revenueTrend || []} />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Order Saturation</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Distribution Percentage</p>
            </div>
          </div>
          <StatusDistributionChart data={data?.orderStatusDistribution || []} />
        </div>
      </div>
    </div>
  );
}
