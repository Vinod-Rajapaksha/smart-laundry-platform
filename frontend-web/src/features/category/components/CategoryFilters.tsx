import { Search, Plus, Filter } from "lucide-react";
import type { CategoryType } from "../types";

interface CategoryFiltersProps {
  type: CategoryType;
  onTypeChange: (type: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export default function CategoryFilters({
  type,
  onTypeChange,
  searchQuery,
  onSearchChange,
  onAddClick,
}: CategoryFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Type Selector Tabs */}
      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl w-fit">
        <button
          onClick={() => onTypeChange("SERVICE")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            type === "SERVICE"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Service Categories
        </button>
        <button
          onClick={() => onTypeChange("INVENTORY")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            type === "INVENTORY"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Inventory Categories
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-500/10 transition font-medium text-slate-600 placeholder:text-slate-400"
            placeholder={`Search ${type.toLowerCase()} categories...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={onAddClick}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg flex-shrink-0 ${
              type === "SERVICE" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            }`}
          >
            <Plus size={18} />
            Add {type === "SERVICE" ? "Service" : "Inventory"}
          </button>
        </div>
      </div>
    </div>
  );
}
