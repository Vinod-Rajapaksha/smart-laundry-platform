import { LayoutDashboard, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../../src/features/auth/hooks/useAuth";
import { NavLink } from "react-router-dom";
import NotificationCenter from "../notifications/NotificationCenter";

type TopbarProps = {
  title?: string;
  Icon?: LucideIcon;
};

export default function Topbar({
  title = "Dashboard",
  Icon = LayoutDashboard,
}: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex w-full h-16 items-center justify-between px-8 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-blue-500" />}
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationCenter />

        <div className="w-px h-8 bg-slate-100" />

        {/* User Info Link */}
        <NavLink to="/admin/profile" className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {user?.name || "User Name"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {user?.role || "User"} Portal
            </span>
          </div>

          <div className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-white bg-slate-100 flex items-center justify-center shadow-lg shadow-slate-200 group-hover:shadow-blue-200 transition-all group-hover:scale-105">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </div>
        </NavLink>
      </div>
    </header>
  );
}