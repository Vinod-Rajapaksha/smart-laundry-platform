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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg active:scale-95 shadow-blue-500/10 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add New Service</span>
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {total} Catalog Items • Page {page} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <ServiceTable
        data={services}
        loading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          startItem: total === 0 ? 0 : (page - 1) * 10 + 1,
          endItem: Math.min(page * 10, total),
          totalItems: total,
          onPageChange: setPage,
        }}
        onEdit={(svc) => {
          setEditingService(svc);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSubmit={editingService ? handleUpdate : handleCreate}
      />
    </div>
  );
}
