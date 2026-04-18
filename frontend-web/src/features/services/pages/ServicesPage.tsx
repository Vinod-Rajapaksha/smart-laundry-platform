import { useState, useEffect } from "react";
import { Plus, Sparkles, Activity } from "lucide-react";
import ServiceTable from "../components/ServiceTable";
import ServiceModal from "../components/ServiceModal";
import { servicesApi } from "../api/services.api";
import { type LaundryService, type ServiceTab } from "../types";
import { toast } from "react-hot-toast";

const CATEGORIES: ServiceTab[] = ["All", "Wash & Fold", "Dry Cleaning", "Ironing", "Premium Care"];

export default function ServicesPage() {
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
      setServices(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total); // fixed property mapping
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
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700 font-poppins px-1 md:px-0">

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Offering Catalog</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Laundry Services</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[500px]">
            Manage your service portfolio, set pricing, and configure turnaround times for different laundry processes.
          </p>
        </div>

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
            <span className="text-[10px] font-black uppercase tracking-widest">{total} Catalog Items</span>
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
