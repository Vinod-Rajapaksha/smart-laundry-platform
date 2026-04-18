import { useState, useEffect } from "react";
import LoyaltyFilters from "./LoyaltyFilters";
import LoyaltyTable from "./LoyaltyTable";
import type { CustomerLoyalty, Tab } from "../types";
import { getCustomerLoyalty } from "../api/loyalty.api";
import { toast } from "react-hot-toast";

export default function LoyaltyContainer() {
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Customers");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const data = await getCustomerLoyalty();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to fetch loyalty records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, [activeTab]);

  const filteredCustomers = customers.filter((c) =>
    c.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* LOYALTY HIGHLIGHTS */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Members</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900">{customers.length}</p>
            <span className="text-green-500 text-xs font-bold">+12% this month</span>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Points Issued</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-blue-600">
              {customers.reduce((s, c) => s + c.points, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Platinum Members</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-indigo-600">
              {customers.filter(c => typeof c.tierId !== 'string' && c.tierId.name.toLowerCase() === "platinum").length}
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <LoyaltyTable
          customers={filteredCustomers}
        />
      )}
    </div>
  );
}
