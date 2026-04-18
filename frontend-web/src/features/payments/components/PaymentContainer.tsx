import { useState, useEffect } from "react";
import PaymentFilters from "./PaymentFilters";
import PaymentTable from "./PaymentTable";
import PaymentDrawer from "./PaymentDrawer";
import type { Payment, Tab } from "../types";
import { getPayments, verifyPayment } from "../api/payments.api";
import { toast } from "react-hot-toast";

export default function PaymentContainer() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const statusMap: Record<string, string> = {
        "Paid": "PAID",
        "Pending": "PENDING",
        "Failed": "FAILED"
      };
      const status = statusMap[activeTab];
      const data = await getPayments(status);
      setPayments(data);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [activeTab]);

  const handleVerify = async (id: string, status: 'PAID' | 'FAILED') => {
    try {
      setActionLoading(true);
      await verifyPayment(id, status);
      toast.success(status === 'PAID' ? "Payment confirmed" : "Payment rejected");

      // Update local state
      setPayments(prev => prev.map(p => p._id === id ? { ...p, status } : p));
      if (selectedPayment?._id === id) {
        setSelectedPayment(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      toast.error("Failed to verify payment");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (payment.transactionRef?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRevenue = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* FINANCIAL SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white font-poppins">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Revenue</p>
          <p className="text-3xl font-black">LKR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Awaiting Verification</p>
          <p className="text-3xl font-black text-amber-600 transition-transform group-hover:scale-105 origin-left">
            LKR {payments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Capture Rate</p>
          <p className="text-3xl font-black text-blue-600 transition-transform group-hover:scale-105 origin-left">
            {payments.length ? Math.round((payments.filter(p => p.status === "PAID").length / payments.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <PaymentFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <PaymentTable
          payments={filteredPayments}
          onView={setSelectedPayment}
        />
      )}

      <PaymentDrawer
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onVerify={handleVerify}
        loading={actionLoading}
      />
    </div>
  );
}
