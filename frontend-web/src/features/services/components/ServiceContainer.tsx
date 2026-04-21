import { useState, useEffect } from "react";
import { Plus, Activity } from "lucide-react";
import ServiceTable from "./ServiceTable";
import ServiceModal from "./ServiceModal";
import { ServiceHeader } from "./ServiceHeader";
import { servicesApi } from "../api/services.api";
import { type LaundryService, type ServiceTab } from "../types";
import { toast } from "react-hot-toast";

const CATEGORIES: ServiceTab[] = ["All", "Wash & Fold", "Dry Cleaning", "Ironing", "Premium Care"];

export default function ServiceContainer() {
  const [services, setServices] = useState<LaundryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ServiceTab>("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<LaundryService | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await servicesApi.getAll({
        category: activeCategory,
        page,
        limit: 10
      });
      const responseData = res as any;
      const items = responseData?.items || (Array.isArray(responseData) ? responseData : []);
      const pagination = responseData?.pagination || { total: items.length, totalPages: 1 };
      
      setServices(items);
      setTotalPages(pagination.totalPages || 1);
      setTotal(pagination.total || items.length);
    } catch (err) {
      toast.error("Failed to load service registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory, page]);

  const handleCreate = async (data: Partial<LaundryService>) => {
    try {
      await servicesApi.create(data);
      toast.success("Service offering launched");
      fetchServices();
    } catch (err) {
      toast.error("Launch sequence failed");
    }
  };

  const handleUpdate = async (data: Partial<LaundryService>) => {
    if (!editingService) return;
    try {
      await servicesApi.update(editingService._id, data);
      toast.success("Service refined successfully");
      fetchServices();
    } catch (err) {
      toast.error("Refinement failed");
    }
  };

  const handleDelete = async (svc: LaundryService) => {
    if (window.confirm(`Decommission ${svc.name}? This cannot be undone.`)) {
      try {
        await servicesApi.delete(svc._id);
        toast.success("Service decommissioned");
        fetchServices();
      } catch (err) {
        toast.error("Decommissioning blocked");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1256px] mx-auto pb-20 animate-in fade-in zoom-in duration-700 font-poppins px-1 md:px-0">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ServiceHeader />
        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* SERVICE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 relative group cursor-default text-left">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Offerings</p>
          <p className="text-3xl font-black text-white">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group cursor-default text-left">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Popular Services</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-blue-600">
              {services.filter(s => s.isPopular).length}
            </p>
            <div className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-tighter">High Demand</div>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm relative group cursor-default text-left">
          <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Catalog</p>
          <p className="text-3xl font-black text-emerald-700">
            {services.filter(s => s.isActive).length}
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.05]"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
        <div className="hidden lg:flex items-center gap-4 pr-6 text-slate-400">
          <div className="h-10 w-[1px] bg-slate-100" />
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {total} Catalog Items • Page {page} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <ServiceTable
          data={services}
          loading={loading}
          onEdit={(svc) => {
            setEditingService(svc);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSubmit={editingService ? handleUpdate : handleCreate}
      />
    </div>
  );
}
