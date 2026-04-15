import { type ReactNode } from "react";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: ReactNode;
  }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl w-fit border border-slate-200/60 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${isActive 
                ? "bg-white text-blue-600 shadow-sm shadow-blue-100/50 border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }
            `}
          >
            {tab.icon && <span className={isActive ? "text-blue-500" : "text-slate-400"}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
