import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "../../api/payments.api";
import type { OnlineTransaction } from "../../types";

import { OnlineTransactionTable } from "./OnlineTransactionTable";
import { OnlineTransactionDrawer } from "./OnlineTransactionDrawer";
import { OnlineTransactionFilters } from "./OnlineTransactionFilters";

export const OnlineTransactionContainer = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<OnlineTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<OnlineTransaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await paymentsApi.getOnlineTransactions({
        status: activeTab,
        search: searchQuery
      });
      setTransactions(res || []);
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
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
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Online Transactions</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Audit Ledger & Reconciliation</p>
          </div>
        </div>
      </div>

      <OnlineTransactionFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white mx-4 md:mx-0 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <OnlineTransactionTable
          data={transactions}
          loading={loading}
          onViewDetails={setSelectedTx}
        />
      </div>

      <OnlineTransactionDrawer
        isOpen={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
