import { Bell, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../../src/features/auth/hooks/useAuth";

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
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <Bell size={20} className="text-slate-600" />
        </button>

        <div className="w-px h-8 bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-slate-900">
                {user?.name || "User Name"}
                </span>
                <span className="text-xs text-slate-500">
                {user?.role || "User"}
                </span>
            </div>

            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {user?.avatar ? (
                <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover"
                />
            ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-slate-500"
                >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
            )}
            </div>
        </div>
      </div>
    </header>
  );
}