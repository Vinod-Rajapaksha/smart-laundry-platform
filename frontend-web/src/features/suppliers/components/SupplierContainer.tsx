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
          <button
            onClick={() => handleOpenDrawer(null)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} />
            Onboard Vendor
          </button>
        </div>
      </div>

      <SupplierStatsGrid stats={stats} loading={loading} />

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0">
        <div className="md:col-span-8 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {["All Vendors", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by name, contact or category..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition shadow-sm font-bold text-xs"
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
