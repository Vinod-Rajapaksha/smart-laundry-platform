import { useState, useEffect } from "react";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDrawer from "./OrderDrawer";
import { OrderHeader } from "./OrderHeader";
import type { Order, Tab } from "../types";
import { getOrders, updateOrder, deleteOrder } from "../api/orders.api";
import { toast } from "react-hot-toast";

export default function OrderContainer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders(activeTab === "All" ? undefined : activeTab);
      const ordersData = (response as any).orders || response;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleUpdateOrder = async (id: string, data: any) => {
    try {
      setActionLoading(true);
      const updatedOrder = await updateOrder(id, data);
      setOrders(prev => prev.map(o => o._id === id ? updatedOrder : o));
      setSelectedOrder(updatedOrder);
      toast.success("Order updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id));
      setSelectedOrder(null);
      toast.success("Order deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) =>
    order.orderNo.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins">
      <OrderHeader />
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-2xl font-black text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-600">
            {orders.filter(o => !["DELIVERED", "CANCELLED"].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Pickup</p>
          <p className="text-2xl font-black text-blue-600">
            {orders.filter(o => o.status.startsWith("PICKUP") || o.status === "PICKED_UP").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Processing</p>
          <p className="text-2xl font-black text-indigo-600">
            {orders.filter(o => ["WASHING", "DRYING", "PROCESSING", "HANDED_OVER"].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Delivery</p>
          <p className="text-2xl font-black text-emerald-600">
            {orders.filter(o => o.status.startsWith("DELIVERY") || o.status === "DELIVERED").length}
          </p>
        </div>
      </div>

      <OrderFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onViewDetails={setSelectedOrder}
        />
      )}

      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
        loading={actionLoading}
      />
    </div>
  );
}
