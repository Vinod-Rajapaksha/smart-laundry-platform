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
import { format } from "date-fns";
import { DashboardHeader } from "./DashboardHeader";

export default function DashboardContainer() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRange, setActiveRange] = useState<DateRange>("today");

  const fetchData = useCallback(async (showToast = false) => {
    try {
      const [kpis, ordersResponse] = await Promise.all([
        getDashboardKPIs(activeRange),
        getOrders()
      ]);
      const ordersList = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse as any).orders || [];

      setData(kpis);
      setRecentOrders(ordersList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));

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

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-8 animate-in fade-in zoom-in duration-700 font-poppins pb-20">

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <DashboardHeader />
        <div className="flex items-center gap-3 pt-2">
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
          trend="Real-time"
          isPositive={true}
          Icon={DollarSign}
          color="blue"
        />
        <KPIStatCard
          label="New Orders"
          value={(data?.newOrders || 0).toString()}
          trend="Total Today"
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
                        {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                          ? format(new Date(order.createdAt), "HH:mm, MMM dd")
                          : "Time unknown"} • Customer: {typeof order.userId === 'object' ? (order.userId as any).name : String(order.userId || '').substring(0, 8).toUpperCase()}
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
      </div>
    </div>
  );
}
