import { useState, useEffect } from "react";
import VoucherFilters from "./VoucherFilters";
import VoucherTable from "./VoucherTable";
import VoucherModal from "./VoucherModal";
import type { Voucher, Tab } from "../types";
import { getVouchers, deleteVoucher, createVoucher } from "../api/vouchers.api";
import { toast } from "react-hot-toast";

export default function VoucherContainer() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Vouchers");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getVouchers();
      const voucherData = (response as any).data || response;
      setVouchers(Array.isArray(voucherData) ? voucherData : []);
    } catch (error) {
      toast.error("Failed to fetch vouchers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async (data: Partial<Voucher>) => {
    try {
      setActionLoading(true);
      await createVoucher(data);
      toast.success("Voucher created successfully");
      setIsModalOpen(false);
      fetchVouchers();
    } catch (error) {
      toast.error("Failed to create voucher");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return;
    try {
      setActionLoading(true);
      await deleteVoucher(id);
      toast.success("Voucher deleted");
      fetchVouchers();
    } catch (error) {
      toast.error("Failed to delete voucher");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Active") return matchesSearch && v.isActive;
    if (activeTab === "Expired") return matchesSearch && new Date(v.expiryDate) < new Date();
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* VOUCHER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Created</p>
          <p className="text-3xl font-black text-white">{vouchers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Currently Active</p>
          <p className="text-3xl font-black text-emerald-600">{vouchers.filter(v => v.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Redeemed</p>
          <p className="text-3xl font-black text-blue-600">{vouchers.reduce((s, v) => s + v.usedCount, 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Redeem Rate</p>
          <p className="text-3xl font-black text-indigo-600 tracking-tighter">
            {vouchers.length ? Math.round((vouchers.reduce((s, v) => s + v.usedCount, 0) / (vouchers.reduce((s, v) => s + v.usageLimit, 0) || 1)) * 100) : 0}%
          </p>
        </div>
      </div>

      <VoucherFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-indigo-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <VoucherTable
          vouchers={filteredVouchers}
          onDelete={handleDelete}
        />
      )}

      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        loading={actionLoading}
      />
    </div>
  );
}
