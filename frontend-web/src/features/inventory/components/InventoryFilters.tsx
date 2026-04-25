import { Plus, Search } from "lucide-react";
import type { Tab } from "../types";

interface InventoryFiltersProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

const tabs: Tab[] = ["All Items", "Low Stock", "Inactive"];

export default function InventoryFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onAddClick,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 font-poppins">
      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg active:scale-95 shadow-blue-500/10"
        >
          <Plus size={18} />
          New Item
        </button>
      </div>

      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Lookup by Name/SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-sm"
        />
      </div>
    </div>
  );
}
