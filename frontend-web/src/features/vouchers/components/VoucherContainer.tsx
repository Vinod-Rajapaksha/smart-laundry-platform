import { useState, useEffect } from "react";
import VoucherFilters from "./VoucherFilters";
import VoucherTable from "./VoucherTable";
import VoucherModal from "./VoucherModal";
import { VoucherHeader } from "./VoucherHeader";
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
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins">
      <VoucherHeader />
      {/* VOUCHER SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 relative group cursor-default">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Now</p>
          <p className="text-3xl font-black text-white">
            {vouchers.filter(v => v.isActive).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group cursor-default transition-all hover:shadow-md">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Codes</p>
          <p className="text-3xl font-black text-blue-600">{vouchers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group cursor-default transition-all hover:shadow-md">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Avg Discount</p>
          <p className="text-3xl font-black text-slate-900">
            {vouchers.length > 0
              ? Math.round(vouchers.reduce((acc, v) => acc + (v.discountValue || 0), 0) / vouchers.length)
              : 0}%
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
