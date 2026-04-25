import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "../../api/payments.api";
import type { CODPayment } from "../../types";
import { CODTable } from "./CODTable";
import { CODDrawer } from "./CODDrawer";
import { CodFilters } from "./CodFilters";

export const CODContainer = () => {
  const navigate = useNavigate();
  const [codTransfers, setCodTransfers] = useState<CODPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCod, setSelectedCod] = useState<CODPayment | null>(null);

  const fetchCods = async () => {
    try {
      setLoading(true);
      const res = await paymentsApi.getCashOnDeliveries({
        status: activeTab,
        search: searchQuery
      });
      setCodTransfers(res || []);
    } catch (e) {
      console.error("Failed to fetch COD data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCods();
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Cash Collection</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Rider Settlement & In-Person Payments</p>
          </div>
        </div>
      </div>

      <CodFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white mx-4 md:mx-0 rounded-[2rem] border border-slate-100 shadow-xl shadow-emerald-200/20 overflow-hidden">
        <CODTable
          data={codTransfers}
          loading={loading}
          onViewDetails={setSelectedCod}
        />
      </div>

      <CODDrawer
        isOpen={!!selectedCod}
        cod={selectedCod}
        onClose={() => setSelectedCod(null)}
      />
    </div>
  );
};
