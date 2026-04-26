import { Search } from "lucide-react";

interface BankTransferFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabs = ["All Transactions", "Approved", "Pending", "Rejected"];

export const BankTransferFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: BankTransferFiltersProps) => {
  return (
    <div className="bg-white p-5 mx-4 md:mx-0 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 font-poppins">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex p-1 bg-slate-50 rounded-2xl w-fit border border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-[0.05em] ${activeTab === tab
                ? "bg-white text-purple-600 shadow-sm ring-1 ring-purple-100"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab === "All Transactions" ? "Master Ledger" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Bank, Reference, Order, Customer Name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm font-medium"
          />
        </div>
      </div>
    </div>
  );
};
