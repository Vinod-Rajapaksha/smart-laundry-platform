import { useState, useEffect } from "react";
import { ArrowLeft, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "../../api/payments.api";
import type { PendingTransferData } from "../../../bank-verification/api/bank-verification.api";
import { BankTransferTable } from "./BankTransferTable";
import { BankTransferDrawer } from "./BankTransferDrawer";
import { BankTransferFilters } from "./BankTransferFilters";

export const BankTransferContainer = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<PendingTransferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<PendingTransferData | null>(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await paymentsApi.getBankTransfers({
        status: activeTab,
        search: searchQuery
      });
      setTransfers(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-500 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/payments")}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 text-slate-500 shadow-sm border border-slate-100 bg-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 text-purple-600 shadow-sm shadow-purple-500/10">
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Financial Ledger</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Manual Bank reconciliation System</p>
            </div>
          </div>
        </div>
      </div>

      <BankTransferFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white mx-4 md:mx-0 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-purple-200/20 overflow-hidden">
        <BankTransferTable
          data={transfers}
          loading={loading}
          onViewDetails={setSelectedTx}
        />
      </div>

      <BankTransferDrawer
        isOpen={!!selectedTx}
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
