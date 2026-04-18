import { useState, useEffect, useCallback } from "react";
import { getDashboardKPIs } from "../api/dashboard.api";
import { getOrders } from "../../orders/api/orders.api";
import type { Order } from "../../orders/types";
import type { DashboardKPIs, DateRange } from "../types";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Truck,
  Activity,
  RefreshCcw,
  Zap
} from "lucide-react";
import { toast } from "react-hot-toast";
import KPIStatCard from "./KPIStatCard";
import RevenueChart from "./RevenueChart";
import StatusDistributionChart from "./StatusDistributionChart";
import DateRangeFilter from "./DateRangeFilter";
import { format } from "date-fns";

export default function DashboardContainer() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRange, setActiveRange] = useState<DateRange>("today");

  const fetchData = useCallback(async (showToast = false) => {
    try {
      if (!showToast) setLoading(true);
      else setRefreshing(true);

      const [kpis, orders] = await Promise.all([
        getDashboardKPIs(activeRange),
        getOrders() // We'll take latest from here
      ]);

      setData(kpis);
      // Sort and take latest 5
      setRecentOrders(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));

      if (showToast) toast.success("Dashboard data synchronized");
    } catch (error) {
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="h-64 bg-slate-100 rounded-[2.5rem] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 bg-slate-100 rounded-3xl" />
        <div className="h-80 bg-slate-100 rounded-3xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Zap className="text-amber-500 fill-amber-500" size={28} />
            Command Center
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Platform-wide analytics and real-time operations feed.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter activeRange={activeRange} onRangeChange={setActiveRange} />
          <button
            disabled={refreshing}
            onClick={() => fetchData(true)}
            className={`p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all active:scale-90 shadow-sm flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIStatCard
          label="Today's Revenue"
          value={`LKR ${(data?.todayRevenue || 0).toLocaleString()}`}
          trend="+14.2%"
          isPositive={true}
          Icon={DollarSign}
          color="blue"
        />
        <KPIStatCard
          label="New Orders"
          value={(data?.newOrders || 0).toString()}
          trend="+5 today"
          isPositive={true}
          Icon={ShoppingCart}
          color="indigo"
        />
        <KPIStatCard
          label="Active Staff"
          value={(data?.activeStaff || 0).toString()}
          trend="Steady"
          isPositive={true}
          Icon={Users}
          color="emerald"
        />
        <KPIStatCard
          label="Logistics Queue"
          value={(data?.pendingDeliveries || 0).toString()}
          trend="-2"
          isPositive={false}
          Icon={Truck}
          color="amber"
        />
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

      {/* RECENT ACTIVITY & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-indigo-500" />
              Operational Ledger
            </h2>
            <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest px-4 py-2 bg-indigo-50 rounded-xl transition-colors">
              Full History
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between p-5 bg-slate-50 border border-transparent hover:border-slate-200 rounded-[1.5rem] group transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 font-bold group-hover:text-amber-500 transition-colors border border-slate-100">
                      ORD
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        {order.orderNo}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {order.status}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(order.createdAt), "HH:mm, MMM dd")} • Customer ID: {order.userId.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">LKR {order.totalAmount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.paymentMethod}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="font-bold italic">No recent activities recorded</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-end min-h-[400px] shadow-2xl group transition-all hover:scale-[1.01]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 z-10" />
          <img
            src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=1000"
            className="absolute top-0 left-0 w-full h-full object-cover grayscale opacity-20 transition-transform duration-1000 group-hover:scale-110"
            alt="System Operational"
          />
          <div className="relative z-20">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase mb-4 inline-block tracking-widest">System Status</span>
            <h3 className="text-2xl font-black mb-2 leading-tight">Edge Infrastructure Operational</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Cluster synchronization is active across secondary nodes. Load balancing optimized for current traffic density.</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">Node {i}</div>)}
              </div>
              <div className="h-px flex-1 bg-slate-800" />
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
