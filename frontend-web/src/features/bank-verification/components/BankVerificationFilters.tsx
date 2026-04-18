import { useState } from "react";

const tabs = ["Pending", "Approved", "Rejected", "All Transactions"];
const amountOptions = [
  { value: "", label: "Any Amount" },
  { value: "0-100", label: "Rs.0 - Rs.100" },
  { value: "100-500", label: "Rs.100 - Rs.500" },
  { value: "500-1000", label: "Rs.500 - Rs.1,000" },
  { value: "1000+", label: "Rs.1,000+" },
];

interface BankVerificationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export const BankVerificationFilters = ({ activeTab, onTabChange, onSearch }: BankVerificationFiltersProps) => {
  const [search, setSearch] = useState("");

  const handleApply = () => {
    if (onSearch) onSearch(search);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-6 pt-2 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-4 pt-4 text-sm font-semibold transition-colors relative ${
              activeTab === tab
                ? "text-[#3b82f6]"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6] rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Filters Form */}
      <div className="flex items-end gap-4 p-6 w-full">
        <div className="flex flex-col gap-2 flex-[2]">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Order ID, Ref, or Customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Range</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="w-full pl-9 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount Range</label>
          <select className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all">
            {amountOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 ml-2">
          <button 
            className="px-6 py-2.5 bg-[#f1f5f9] text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors"
            onClick={() => {
              setSearch("");
              if (onSearch) onSearch("");
            }}
          >
            Reset
          </button>
          <button 
            className="px-8 py-2.5 bg-[#3b82f6] text-white font-semibold rounded-lg text-sm hover:bg-blue-600 shadow-sm transition-colors"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};