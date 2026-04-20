import { useState, useEffect } from "react";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDrawer from "./OrderDrawer";
import type { Order, Tab, OrderStatus } from "../types";
import { getOrders, updateOrderStatus, updateOrder, deleteOrder } from "../api/orders.api";
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
      // Backend returns { orders: Order[], pagination: { ... } }
      // We check if response has orders, if not we assume it might be an array (for safety)
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

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      setActionLoading(true);
      await updateOrderStatus(id, status);
      toast.success(`Order set to ${status}`);

      // Update local state for both the list and the drawer
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

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
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">Processing</p>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status === "Processing").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Action</p>
          <p className="text-3xl font-bold text-amber-600">
            {orders.filter(o => o.status === "Pending").length}
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
        onUpdateStatus={handleUpdateStatus}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
        loading={actionLoading}
      />
    </div>
  );
}
