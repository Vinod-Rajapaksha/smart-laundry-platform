import { useState } from "react";
import { Search, QrCode, RefreshCcw, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getOrderByNo, updateOrderStatus } from "../../orders/api/orders.api";
import type { Order, OrderStatus } from "../../orders/types";

export default function StatusUpdatePage() {
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleLookup = async () => {
    if (!orderNo) return;
    try {
      setLoading(true);
      const data = await getOrderByNo(orderNo);
      setOrder(data);
    } catch (error) {
      toast.error("Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!order) return;
    try {
      setLoading(true);
      await updateOrderStatus(order._id, status);
      toast.success(`Status updated to ${status}`);
      handleLookup(); // Refresh current order state
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-2">Order Status Update</h1>
        <p className="text-slate-500">Quickly update laundry progress via Order ID or QR scan</p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />

        <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
          <div className="relative flex-1 group/input w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Enter Order Number (e.g. 1001)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition shadow-inner font-bold text-lg"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>
          <button
            onClick={handleLookup}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            Lookup
          </button>
          <div className="h-10 w-px bg-slate-200 hidden md:block" />
          <button className="flex items-center gap-2 p-4 text-blue-600 font-bold hover:bg-blue-50 rounded-2xl transition">
            <QrCode size={20} />
            Scan
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
      {order ? (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Active Selection</p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Order #{order.orderNo}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase">{order.status}</span>
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-900">LKR {order.totalAmount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{order.paymentStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Estimated Weight</p>
                <p className="font-bold text-slate-700">{order.weightKg || 'Not weighed'} KG</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Last Sync</p>
                <p className="font-bold text-slate-700">Today, 14:30</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">Available Transitions</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton
                label="Start Processing"
                description="Begin washing/drying"
                status="Processing"
                currentStatus={order.status}
                icon={<RefreshCcw size={20} />}
                onClick={() => handleStatusUpdate("Processing")}
              />
              <ActionButton
                label="Mark Completed"
                description="Ready for pickup/delivery"
                status="Completed"
                currentStatus={order.status}
                icon={<CheckCircle2 size={20} />}
                onClick={() => handleStatusUpdate("Completed")}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 opacity-20">
          <RefreshCcw size={80} className="mx-auto mb-4 animate-[spin_10s_linear_infinite]" />
          <p className="text-xl font-bold italic">Waiting for input...</p>
        </div>
      )}
    </div>
  );
}

function ActionButton({ label, description, status, currentStatus, icon, onClick }: any) {
  const isCurrent = currentStatus === status;
  return (
    <button
      onClick={onClick}
      disabled={isCurrent}
      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group ${isCurrent
          ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
          : "bg-white border-slate-200 hover:border-blue-500 hover:shadow-md active:scale-95"
        }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${isCurrent ? "bg-slate-200 text-slate-400" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-900 mb-0.5">{label}</p>
        <p className="text-[10px] text-slate-500 font-medium uppercase">{description}</p>
      </div>
    </button>
  );
}
