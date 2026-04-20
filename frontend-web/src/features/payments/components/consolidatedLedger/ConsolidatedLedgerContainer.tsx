import { useState, useEffect } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConsolidatedLedgerFilters } from "./ConsolidatedLedgerFilters";
import { ConsolidatedLedgerTable } from "./ConsolidatedLedgerTable";
import { ConsolidatedLedgerDrawer } from "./ConsolidatedLedgerDrawer";
import type { Payment, Tab } from "../../types";
import { paymentsApi } from "../../api/payments.api";
import { toast } from "react-hot-toast";
import { Button } from "../../../../components/ui/Button";

export const ConsolidatedLedgerContainer = () => {
  const navigate = useNavigate();
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
      const data = await paymentsApi.getPayments(status);
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
      await paymentsApi.verifyPayment(id, status);
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

  const filteredPayments = payments.filter((payment) => {
    const orderIdStr = typeof payment.orderId === 'object' 
      ? (payment.orderId as any).orderNo 
      : payment.orderId;
    
    return orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.transactionRef?.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-500 font-poppins">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/payments")}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 text-slate-500 shadow-sm border border-slate-100 bg-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consolidated Ledger</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Universal Financial History & Reconciliation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest h-10">
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      <ConsolidatedLedgerFilters
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
        <div className="bg-white mx-4 md:mx-0 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <ConsolidatedLedgerTable
            payments={filteredPayments}
            onView={setSelectedPayment}
          />
        </div>
      )}

      <ConsolidatedLedgerDrawer
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onVerify={handleVerify}
        loading={actionLoading}
      />
    </div>
  );
};
