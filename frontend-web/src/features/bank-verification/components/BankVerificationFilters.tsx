import { useState } from "react";
import { Search, RotateCcw, Calendar } from "lucide-react";

const tabs = ["Pending", "Approved", "Rejected", "All Transactions"];

interface BankVerificationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (query: string) => void;
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

export const BankVerificationFilters = ({
  activeTab,
  onTabChange,
  onSearch,
  startDate,
  endDate,
  onDateChange
}: BankVerificationFiltersProps) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearch(val);
    onSearch?.(val);
  };

  const handleReset = () => {
    setSearch("");
    onDateChange("", "");
    onSearch?.("");
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap
                ${isActive
                  ? "text-white bg-blue-600 shadow"
                  : "text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200"
                }`}
            >
              {tab === "All Transactions" ? "Master Ledger" : tab}

              {isActive && (
                <span className="absolute inset-0 rounded-full ring-2 ring-blue-400/30"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="relative w-full lg:max-w-sm group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Order ID, Customer Name, Ref No..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              transition shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">

          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateChange(e.target.value, endDate)}
              className="pl-7 pr-2 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <span className="text-slate-400 text-xs">to</span>

          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateChange(startDate, e.target.value)}
              className="pl-7 pr-2 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 
            text-slate-500 hover:text-red-500 rounded-xl border border-slate-200 transition-all active:scale-95"
        >
          <RotateCcw size={16} className="transition-transform group-hover:-rotate-45" />
          <span className="text-xs font-medium">Reset</span>
        </button>
      </div>
    </div>
  );
};