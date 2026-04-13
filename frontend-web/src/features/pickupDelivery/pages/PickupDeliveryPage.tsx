import { useEffect, useState } from 'react';
import { pickupDeliveryApi } from '../api/pickupDelivery.api';
import type { DeliveryDashboardData, DeliveryOrder, OrderStatus } from '../types';
import {
  Truck,
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  RefreshCw,
  User,
  MapPin,
  Navigation,
  Phone,
  AlertCircle,
} from 'lucide-react';

// ─────────────────────────────────────────
// Status config — color, label for each status
// ─────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING: {
    label: 'Pending Pickup',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  PICKUP_ASSIGNED: {
    label: 'Pickup Assigned',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  PICKUP_ENROUTE: {
    label: 'Rider En Route',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  PICKED_UP: {
    label: 'Picked Up',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  PROCESSING: {
    label: 'Processing',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  READY: {
    label: 'Ready for Delivery',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  DELIVERY_ASSIGNED: {
    label: 'Delivery Assigned',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  DELIVERY_ENROUTE: {
    label: 'Out for Delivery',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};


// ─────────────────────────────────────────
// Order Card Component
// ─────────────────────────────────────────
function OrderCard({ order }: { order: DeliveryOrder }) {
  const config = STATUS_CONFIG[order.status];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-slate-900">{order.orderNo}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.color} ${config.border} border`}>
          {config.label}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-2">
        <User size={13} className="text-slate-400 shrink-0" />
        <span className="text-sm text-slate-700 font-medium">
          {order.userId?.name || 'Unknown'}
        </span>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 mb-2">
        <Phone size={13} className="text-slate-400 shrink-0" />
        <span className="text-sm text-slate-500">
          {order.userId?.telephone || '—'}
        </span>
      </div>

      {/* Pickup Address */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin size={13} className="text-blue-400 shrink-0 mt-0.5" />
        <span className="text-xs text-slate-600 line-clamp-1">
          {order.pickupAddress || '—'}
        </span>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start gap-2 mb-3">
        <Navigation size={13} className="text-green-400 shrink-0 mt-0.5" />
        <span className="text-xs text-slate-600 line-clamp-1">
          {order.deliveryAddress || '—'}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-900">
          LKR {order.totalAmount.toLocaleString()}
        </span>
        {order.riderLatitude && order.riderLongitude ? (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live GPS
          </span>
        ) : (
          <span className="text-xs text-slate-400">No GPS</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Status Section Component
// ─────────────────────────────────────────
function PipelineColumn({
  status,
  orders,
}: {
  status: OrderStatus;
  orders: DeliveryOrder[];
}) {
  const config = STATUS_CONFIG[status];

  return (
    <div>
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${config.bg} border ${config.border}`}
      >
        <span className={`text-xs font-semibold ${config.color}`}>
          {config.label}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}
        >
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
          No orders
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function PickupDeliveryPage() {
  const [data, setData] = useState<DeliveryDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery' | 'processing'>('pickup');

  const fetchData = async () => {
    try {
      setError(null);
      const result = await pickupDeliveryApi.getDeliveryDashboard();
      setData(result);
      setLastUpdated(new Date());
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch delivery data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Loading state ──────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading delivery data...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totalActive = data
    ? Object.entries(data.counts)
        .filter(([s]) => s !== 'DELIVERED')
        .reduce((sum, [, count]) => sum + count, 0)
    : 0;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Package size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending Pickup</p>
              <p className="text-xl font-bold text-slate-900">
                {data?.counts['PENDING'] ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <ArrowUpCircle size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Pickups</p>
              <p className="text-xl font-bold text-slate-900">
                {(data?.counts['PICKUP_ASSIGNED'] ?? 0) +
                  (data?.counts['PICKUP_ENROUTE'] ?? 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <ArrowDownCircle size={18} className="text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Deliveries</p>
              <p className="text-xl font-bold text-slate-900">
                {(data?.counts['DELIVERY_ASSIGNED'] ?? 0) +
                  (data?.counts['DELIVERY_ENROUTE'] ?? 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Truck size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Active</p>
              <p className="text-xl font-bold text-slate-900">{totalActive}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Refresh Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : 'Loading...'}
          {' · '}Auto refreshes every 30 seconds
        </p>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <RefreshCw size={13} />
          Refresh now
        </button>
      </div>

      {/* Tabs */}
<div className="flex gap-1 border-b border-slate-200 mb-6">
  {[
    { key: 'pickup', label: 'Pickup pipeline' },
    { key: 'delivery', label: 'Delivery pipeline' },
    { key: 'processing', label: 'Processing' },
  ].map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key as typeof activeTab)}
      className={`px-4 py-2 text-sm transition border-b-2 -mb-px ${
        activeTab === tab.key
          ? 'border-blue-500 text-blue-600 font-semibold'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

{/* Pickup Pipeline */}
{activeTab === 'pickup' && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <PipelineColumn status="PENDING" orders={data?.grouped['PENDING'] ?? []} />
    <PipelineColumn status="PICKUP_ASSIGNED" orders={data?.grouped['PICKUP_ASSIGNED'] ?? []} />
    <PipelineColumn status="PICKUP_ENROUTE" orders={data?.grouped['PICKUP_ENROUTE'] ?? []} />
  </div>
)}

{/* Delivery Pipeline */}
{activeTab === 'delivery' && (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    <PipelineColumn status="READY" orders={data?.grouped['READY'] ?? []} />
    <PipelineColumn status="DELIVERY_ASSIGNED" orders={data?.grouped['DELIVERY_ASSIGNED'] ?? []} />
    <PipelineColumn status="DELIVERY_ENROUTE" orders={data?.grouped['DELIVERY_ENROUTE'] ?? []} />
    <PipelineColumn status="DELIVERED" orders={data?.grouped['DELIVERED'] ?? []} />
  </div>
)}

{/* Processing */}
{activeTab === 'processing' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <PipelineColumn status="PICKED_UP" orders={data?.grouped['PICKED_UP'] ?? []} />
    <PipelineColumn status="PROCESSING" orders={data?.grouped['PROCESSING'] ?? []} />
  </div>
)}

    </div>
  );
}



