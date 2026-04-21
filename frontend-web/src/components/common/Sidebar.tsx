import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  WashingMachine,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Landmark,
  Package,
  RefreshCcw,
  MessageSquare,
  Truck,
  BarChart3,
  LogOut,
  CreditCard,
  Ticket,
  Star,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth.slice";
import ConfirmDialog from "../common/ConfirmDialog";
import { toast } from "react-hot-toast";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Users size={18} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart size={18} />,
  },
  {
    id: "payments",
    label: "Payments",
    path: "/admin/payments",
    icon: <CreditCard size={18} />,
  },
  {
    id: "bank-verification",
    label: "Bank Verification",
    path: "/admin/bank-verification",
    icon: <Landmark size={18} />,
  },
  {
    id: "services",
    label: "Services",
    path: "/admin/services",
    icon: <WashingMachine size={18} />,
  },
  {
    id: "inventory",
    label: "Inventory",
    path: "/admin/inventory",
    icon: <Package size={18} />,
  },
  {
    id: "status-update",
    label: "Status Update",
    path: "/admin/status-update",
    icon: <RefreshCcw size={18} />,
  },
  {
    id: "vouchers",
    label: "Vouchers",
    path: "/admin/vouchers",
    icon: <Ticket size={18} />,
  },
  {
    id: "loyalty",
    label: "Loyalty",
    path: "/admin/loyalty",
    icon: <Star size={18} />,
  },
  {
    id: "feedbacks",
    label: "Feedbacks",
    path: "/admin/feedbacks",
    icon: <MessageSquare size={18} />,
  },
  {
    id: "deliveries",
    label: "Deliveries",
    path: "/admin/deliveries",
    icon: <Truck size={18} />,
  },
  {
    id: "reports",
    label: "Reports",
    path: "/admin/reports",
    icon: <BarChart3 size={18} />,
  },
];

export default function AsideSidebar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = () => {
    setConfirmOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
    setConfirmOpen(false);
  };

  return (
    <>
      <aside className="w-64 h-screen flex flex-col bg-white border-r border-slate-200">

        {/* HEADER */}
        <div className="flex items-center gap-3 p-6 h-[88px] shrink-0">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white">
            <WashingMachine size={18} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-wide">
              B & W LAUNDRY
            </h1>
            <p className="text-xs text-slate-500">Admin Portal</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === "dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="profile" className="w-full h-full object-cover" />
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

            {/* User Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role || "Admin"}
              </p>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}>
              <LogOut size={16} className="text-slate-600 hover:text-red-500" />
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmOpen}
        title="Logout"
        description="Do you really want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}