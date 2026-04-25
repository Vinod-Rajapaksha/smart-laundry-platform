import { useState } from "react";
import type { Order } from "../types";
import { X, Clock, Package, MapPin, CreditCard, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { format } from "date-fns";
import OrderForm from "./OrderForm";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

interface OrderDrawerProps {
  order: Order | null;
  onClose: () => void;
  onUpdateOrder: (id: string, data: any) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function OrderDrawer({
  order,
  onClose,
  onUpdateOrder,
  onDeleteOrder,
  loading
}: OrderDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!order) return null;

  const handleEditSubmit = async (data: any) => {
    await onUpdateOrder(order._id, data);
    setIsEditing(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Detailed View</p>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                #{order.orderNo}
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-bold uppercase ring-1 ring-blue-100">
                  {order.status}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-blue-600"
                  title="Edit Order"
                >
                  <Edit3 size={20} />
                </button>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 hover:bg-rose-50 rounded-xl transition text-slate-400 hover:text-rose-600"
                title="Delete Order"
              >
                <Trash2 size={20} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-8">
            {isEditing ? (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Edit Order Details</h3>
                <OrderForm
                  initialData={order}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setIsEditing(false)}
                  isLoading={loading}
                />
              </div>
            ) : (
              <>


                {/* CUSTOMER INFO */}
                <section className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={16} />
                    <p className="text-sm font-medium">Placed on {order.createdAt && !isNaN(new Date(order.createdAt).getTime()) ? format(new Date(order.createdAt), "PPpp") : "N/A"}</p>
                  </div>
                  {(order.pickupAddress || order.deliveryAddress) && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Logistics Info</p>
                        {order.pickupAddress && (
                          <p className="text-[11px] text-slate-600 font-medium">
                            <span className="font-bold text-blue-600 mr-2">PICKUP:</span> {order.pickupAddress}
                          </p>
                        )}
                        {order.deliveryAddress && (
                          <p className="text-[11px] text-slate-600 font-medium mt-1">
                            <span className="font-bold text-emerald-600 mr-2">DELIVERY:</span> {order.deliveryAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {order.notes && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Internal Notes</p>
                      <p className="text-xs text-slate-600 italic">"{order.notes}"</p>
                    </div>
                  )}
                </section>

                {/* SERVICES */}
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Operations Detail</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-blue-500" />
                        <div>
                          <span className="text-sm font-bold text-slate-700 block">Base Service</span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">
                            {typeof order.serviceId === "object" ? order.serviceId?.name : order.serviceId}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">PRIMARY</span>
                    </div>
                    {order.options?.map((opt, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-3 pl-6 border-l-2 border-slate-100">
                          <ChevronRight size={14} className="text-slate-300" />
                          <span className="text-sm text-slate-600 font-medium">{opt.name}</span>
                        </div>
                        <span className="text-xs text-slate-400 uppercase font-black tracking-widest">{opt.categoryName}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* PAYMENT SUMMARY */}
                <section className="bg-slate-900 rounded-3xl p-8 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-widest">Payment Info</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ring-1 ring-white/20 uppercase ${order.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Estimated Weight</span>
                      <span>{order.weightKg || '--'} KG</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black">LKR {order.totalAmount.toLocaleString()}</span>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Deactivate Order"
        description="Are you sure you want to deactivate (soft delete) this order? This can be undone by an administrator later."
        confirmText="Deactivate"
        onConfirm={() => {
          onDeleteOrder(order._id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        icon={<Trash2 size={32} />}
      />
    </>
  );
}
