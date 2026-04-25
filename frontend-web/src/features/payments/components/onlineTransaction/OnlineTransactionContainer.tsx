import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "../../api/payments.api";
import type { OnlineTransaction } from "../../types";

import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { OnlineTransactionTable } from "./OnlineTransactionTable";
import { OnlineTransactionDrawer } from "./OnlineTransactionDrawer";

export const OnlineTransactionContainer = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<OnlineTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<OnlineTransaction | null>(null);

  const tabs = ["All", "COMPLETED", "PENDING", "FAILED"];

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
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest h-10">
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 mx-4 md:mx-0 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex p-1 bg-slate-50 rounded-2xl w-fit border border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-100"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab === "All" ? "Master Ledger" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 max-w-md w-full">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
              <Input
                placeholder="Order ID, Customer, Hash..."
                className="pl-12 h-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0 p-3 h-11 w-11 rounded-2xl border-slate-100 hover:bg-slate-50">
              <Filter size={18} className="text-slate-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white mx-4 md:mx-0 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <OnlineTransactionTable 
          data={transactions} 
          loading={loading} 
          onViewDetails={setSelectedTx} 
        />
      </div>

      {/* Details Drawer */}
      <OnlineTransactionDrawer 
        isOpen={!!selectedTx} 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  );
};
