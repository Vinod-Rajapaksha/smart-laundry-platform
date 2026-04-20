import { Search, Filter as FilterIcon } from "lucide-react";
import type { Tab } from "../../types";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";

interface ConsolidatedLedgerFiltersProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabs: Tab[] = ["All", "Pending", "Paid", "Failed"];

export const ConsolidatedLedgerFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: ConsolidatedLedgerFiltersProps) => {
  return (
    <div className="bg-white p-4 mx-4 md:mx-0 rounded-3xl border border-slate-100 shadow-sm space-y-4 font-poppins">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex p-1 bg-slate-50 rounded-2xl w-fit border border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === tab
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-100"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab === "All" ? "Master Ledger" : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 max-w-md w-full">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <Input
              placeholder="Order ID, Customer, Hash..."
              className="pl-12 h-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 p-3 h-11 w-11 rounded-2xl border-slate-100 hover:bg-slate-50">
            <FilterIcon size={18} className="text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};
