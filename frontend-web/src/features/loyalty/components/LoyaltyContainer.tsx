import { useState, useEffect } from "react";
import LoyaltyFilters from "./LoyaltyFilters";
import LoyaltyTable from "./LoyaltyTable";
import { LoyaltyTiersGrid } from "./LoyaltyTiersGrid";
import { TierManagementDrawer } from "./TierManagementDrawer";
import LoyaltyTransactionsTable from "./LoyaltyTransactionsTable";
import type { CustomerLoyalty, LoyaltyTier, LoyaltyTransaction, Tab } from "../types";
import { getCustomerLoyalty, getLoyaltyTiers, updateLoyaltyTier, getAllTransactions } from "../api/loyalty.api";
import { toast } from "react-hot-toast";

export default function LoyaltyContainer() {
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Customers");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      if (activeTab === "Customers") {
        const data = await getCustomerLoyalty();
        setCustomers(Array.isArray(data) ? data : (data as any).data || []);
      } else if (activeTab === "Tiers") {
        const data = await getLoyaltyTiers();
        setTiers(Array.isArray(data) ? data : (data as any).data || []);
      } else if (activeTab === "Transactions") {
        const data = await getAllTransactions();
        setTransactions(Array.isArray(data) ? data : (data as any).data || []);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab.toLowerCase()} records`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, [activeTab]);

  const handleUpdateTier = async (id: string, data: Partial<LoyaltyTier>) => {
    try {
      setActionLoading(true);
      await updateLoyaltyTier(id, data);
      toast.success("Tier protocol updated");
      fetchLoyaltyData();
    } catch (error) {
      toast.error("Protocol sync failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = c.userId?.name?.toLowerCase() || "";
    const userEmail = c.userId?.email?.toLowerCase() || "";
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-500 font-poppins pb-20">
      {/* LOYALTY HIGHLIGHTS */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Members</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{customers.length}</p>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Points Issued</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-blue-600 tracking-tight">
              {customers.reduce((s, c) => s + c.points, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Platinum Members</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-indigo-600 tracking-tight">
              {customers.filter(c =>
                c.tierId &&
                typeof c.tierId !== 'string' &&
                c.tierId.name?.toLowerCase() === "platinum"
              ).length}
            </p>
          </div>
        </div>
      </div>

      <LoyaltyFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading && (customers.length === 0 && tiers.length === 0) ? (
        <div className="flex items-center justify-center py-40">
           <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-b-indigo-600"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Processing Membership Data...</p>
           </div>
        </div>
      ) : (
        <>
          {activeTab === "Customers" && (
            <LoyaltyTable customers={filteredCustomers} loading={loading} />
          )}

          {activeTab === "Tiers" && (
            <LoyaltyTiersGrid 
              tiers={tiers} 
              onEdit={(tier) => {
                setSelectedTier(tier);
                setIsDrawerOpen(true);
              }} 
              loading={loading} 
            />
          )}

          {activeTab === "Transactions" && (
             <LoyaltyTransactionsTable transactions={transactions} loading={loading} />
          )}
        </>
      )}

      <TierManagementDrawer
        isOpen={isDrawerOpen}
        tier={selectedTier}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleUpdateTier}
        loading={actionLoading}
      />
    </div>
  );
}
