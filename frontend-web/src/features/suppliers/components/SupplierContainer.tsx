import { useState } from "react";
import { RefreshCcw, Search, Plus } from "lucide-react";
import { SupplierStatsGrid } from "./SupplierStats";
import { SupplierTable } from "./SupplierTable";
import { SupplierDrawer } from "./SupplierDrawer";
import { SupplierHeader } from "./SupplierHeader";
import { useSuppliers } from "../hooks/useSuppliers";
import type { Supplier } from "../types";

export const SupplierContainer = () => {
  const {
    suppliers,
    stats,
    loading,
    actionLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleSaveSupplier,
    refresh,
  } = useSuppliers();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = (supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedSupplier(null);
    setIsDrawerOpen(false);
  };

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-8 animate-in fade-in duration-700 font-poppins pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SupplierHeader />
        <div className="flex items-center gap-3">
          <button 
            onClick={refresh}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <SupplierStatsGrid stats={stats} loading={loading} />

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
            {["All Vendors", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleOpenDrawer(null)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg active:scale-95 shadow-blue-500/10"
          >
            <Plus size={18} />
            Onboard Vendor
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && suppliers.length === 0 ? (
        <div className="flex items-center justify-center py-40">
           <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-b-blue-600"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Mapping Global Chain...</p>
           </div>
        </div>
      ) : (
        <SupplierTable 
          suppliers={suppliers}
          onEdit={handleOpenDrawer}
          loading={loading}
        />
      )}

      <SupplierDrawer
        isOpen={isDrawerOpen}
        supplier={selectedSupplier}
        onClose={handleCloseDrawer}
        onSave={handleSaveSupplier}
        loading={actionLoading}
      />
    </div>
  );
};
