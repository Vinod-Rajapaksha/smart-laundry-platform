import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import TopBar from "../components/common/TopBar";
import PageFooter from "../components/common/PageFooter";
import { pageConfig } from "../../src/app/config/pageConfig";

export default function AdminLayout() {
  const location = useLocation();

  const pathKey = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  const current = pageConfig[pathKey] || { title: "Dashboard" };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white overflow-y-auto no-scrollbar">
        <Sidebar />
      </aside>

      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* TopBar */}
        <div className="shrink-0">
          <TopBar
            title={current.title}
            Icon={current.Icon}
          />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>

        {/* Footer */}
        <div className="shrink-0 h-[69px]">
          <PageFooter />
        </div>

      </div>
    </div>
  );
}