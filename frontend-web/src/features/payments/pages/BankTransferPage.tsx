import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft, Download, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "../api/payments.api";
import type { PendingTransferData } from "../../../features/bank-verification/api/bank-verification.api";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import BankTransferTable from "../components/bankTransfer/BankTransferTable";
import BankTransferDrawer from "../components/bankTransfer/BankTransferDrawer";

export default function BankTransferPage() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<PendingTransferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<PendingTransferData | null>(null);

  const tabs = ["All Transactions", "Approved", "Pending", "Rejected"];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest h-11 border-slate-200">
            <Download size={14} /> Comprehensive Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex p-1 bg-slate-50 rounded-2xl w-fit border border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-[0.05em] ${activeTab === tab
                  ? "bg-white text-purple-600 shadow-sm ring-1 ring-purple-100"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab === "All Transactions" ? "Master Ledger" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 max-w-md w-full">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={16} />
              <Input
                placeholder="Bank, Reference, Order..."
                className="pl-12 h-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/10 transition-all font-medium text-sm"
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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-purple-200/20 overflow-hidden">
        <BankTransferTable 
          data={transfers} 
          loading={loading} 
          onViewDetails={setSelectedTx} 
        />
      </div>

      {/* Details Drawer */}
      <BankTransferDrawer 
        isOpen={!!selectedTx} 
        tx={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  );
}
