import { useState, useEffect } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { statusUpdateApi } from "../api/statusUpdate.api";
import { StatusUpdateTable } from "./StatusUpdateTable";
import { StatusUpdateConfirmModal } from "./StatusUpdateConfirmModal";
import { StatusUpdateHeader } from "./StatusUpdateHeader";
import { type StatusUpdateOrder, type OrderStatus, type Tab, ORDER_STATUS } from "../types";

export const StatusUpdateContainer = () => {
  const [orders, setOrders] = useState<StatusUpdateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<StatusUpdateOrder | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await statusUpdateApi.getOrders();
      const ordersData = response?.orders || response;
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
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !targetStatus) return;

    try {
      setActionLoading(true);
      await statusUpdateApi.updateStatus(selectedOrder._id, targetStatus);
      toast.success(`Order #${selectedOrder.orderNo} moved to ${targetStatus.replace(/_/g, ' ')}`);

      // Update local state
      setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, status: targetStatus } : o));
      setSelectedOrder(null);
      setTargetStatus(null);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch = order.orderNo.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    let matchesTab = true;
    if (activeTab === "In-Process") {
      matchesTab = ([ORDER_STATUS.PICKED_UP, ORDER_STATUS.WASHING, ORDER_STATUS.DRYING, ORDER_STATUS.PROCESSING] as OrderStatus[]).includes(order.status);
    } else if (activeTab === "Completed") {
      matchesTab = ([ORDER_STATUS.READY, ORDER_STATUS.DELIVERED, ORDER_STATUS.DELIVERY_ASSIGNED] as OrderStatus[]).includes(order.status);
    } else if (activeTab === "Cancelled") {
      matchesTab = ([ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED] as OrderStatus[]).includes(order.status);
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins pb-20">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <StatusUpdateHeader />
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={fetchOrders}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0">
        <div className="md:col-span-8 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {["All", "In-Process", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`flex-1 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="md:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by Order #..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition shadow-sm font-bold text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-b-blue-600"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Production Line...</p>
          </div>
        </div>
      ) : (
        <StatusUpdateTable
          orders={filteredOrders}
          onUpdateStatus={(order, next) => {
            setSelectedOrder(order);
            setTargetStatus(next);
          }}
        />
      )}

      <StatusUpdateConfirmModal
        order={selectedOrder}
        targetStatus={targetStatus}
        onClose={() => {
          setSelectedOrder(null);
          setTargetStatus(null);
        }}
        onConfirm={handleUpdateStatus}
        loading={actionLoading}
      />
    </div>
  );
};
