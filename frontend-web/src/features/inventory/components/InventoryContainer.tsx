import { useState, useEffect } from "react";
import { InventoryHeader } from "./InventoryHeader";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import InventoryModal from "./InventoryModal";
import type { InventoryItem, Tab } from "../types";
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../api/inventory.api";
import { toast } from "react-hot-toast";

export default function InventoryContainer() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const statusMap: Record<string, string> = {
        "Low Stock": "low",
        "Inactive": "inactive"
      };
      const status = statusMap[activeTab];
      const response = await getInventory(status);
      const inventoryData = (response as any).items || response;
      setItems(Array.isArray(inventoryData) ? inventoryData : []);
    } catch (error) {
      toast.error("Failed to fetch inventory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleSave = async (data: Partial<InventoryItem>) => {
    try {
      setActionLoading(true);
      if (selectedItem) {
        await updateInventoryItem(selectedItem._id, data);
        toast.success("Item updated successfully");
      } else {
        await createInventoryItem(data);
        toast.success("New item created");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("This will permanently remove this item from inventory. Continue?")) return;
    try {
      setActionLoading(true);
      await deleteInventoryItem(id);
      toast.success("Item removed");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.qtyInStock <= i.reorderLevel).length;

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-700 font-poppins">
      <InventoryHeader />
      {/* INVENTORY SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 relative group cursor-default">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Categories</p>
          <p className="text-3xl font-black text-white">
            {new Set(items.map(i => i.categoryName)).size}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Stock Items</p>
          <p className="text-3xl font-black text-blue-600">{items.length}</p>
        </div>
        <div className={`p-6 rounded-3xl border shadow-sm transition-all ${lowStockCount > 0 ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100"
          }`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${lowStockCount > 0 ? "text-rose-600" : "text-slate-400"
            }`}>Low Stock Alert</p>
          <p className={`text-3xl font-black ${lowStockCount > 0 ? "text-rose-700" : "text-slate-900"
            }`}>{lowStockCount}</p>
        </div>
      </div>

      <InventoryFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-blue-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <InventoryTable
          items={filteredItems}
          onEdit={(item) => {
            setSelectedItem(item);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <InventoryModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={actionLoading}
      />
    </div>
  );
}
