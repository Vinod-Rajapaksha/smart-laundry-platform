import { useState, useEffect } from "react";
import { CategoryHeader } from "./CategoryHeader";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import type { CategoryType } from "../types";
import { categoryApi } from "../api/category.api";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { AlertTriangle } from "lucide-react";

export default function CategoryContainer() {
  const [type, setType] = useState<CategoryType>("SERVICE");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getAllCategories(type);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(`Failed to fetch ${type.toLowerCase()} categories`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  const handleSave = async (data: any) => {
    try {
      setActionLoading(true);
      if (selectedItem) {
        await categoryApi.updateCategory(type, { ...data, _id: selectedItem._id });
        toast.success("Category updated successfully");
      } else {
        await categoryApi.createCategory(type, data);
        toast.success("New category created");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setActionLoading(true);
      await categoryApi.deleteCategory(type, itemToDelete);
      toast.success("Category removed");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = items.filter(i => i.isActive).length;

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-700 font-poppins">
      <CategoryHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
        <div className={`p-6 rounded-3xl shadow-xl border border-white/5 relative group cursor-default transition-all ${type === "SERVICE" ? "bg-slate-900" : "bg-emerald-900"}`}>
          <p className={`${type === "SERVICE" ? "text-indigo-400" : "text-emerald-400"} text-[10px] font-black uppercase tracking-[0.2em] mb-1`}>Total {type} Categories</p>
          <p className="text-3xl font-black text-white">{items.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active {type}</p>
          <p className={`text-3xl font-black ${type === "SERVICE" ? "text-indigo-600" : "text-emerald-600"}`}>{activeCount}</p>
        </div>
      </div>

      <CategoryFilters
        type={type}
        onTypeChange={(newType) => {
          setType(newType);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
      />

      {loading ? (
        <div className={`flex items-center justify-center py-20 ${type === "SERVICE" ? "text-indigo-500" : "text-emerald-500"}`}>
          <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${type === "SERVICE" ? "border-indigo-600" : "border-emerald-600"}`}></div>
        </div>
      ) : (
        <CategoryTable
          type={type}
          data={filteredItems}
          onEdit={(item) => {
            setSelectedItem(item);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <CategoryModal
        type={type}
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={showConfirm}
        title="Remove Category"
        description="Are you sure you want to permanently remove this category? This action cannot be undone and may affect items or services associated with it."
        confirmText="Remove"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        icon={<AlertTriangle size={32} />}
      />
    </div>
  );
}
