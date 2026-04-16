import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Landmark,
  Package,
  RefreshCcw,
  Megaphone,
  MessageSquare,
  Truck,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PageConfig = {
  title: string;
  Icon?: LucideIcon;
};

export const pageConfig: Record<string, PageConfig> = {
  dashboard: {
    title: "Dashboard",
    Icon: LayoutDashboard,
  },

  customers: {
    title: "Customers",
    Icon: Users,
  },

  orders: {
    title: "Orders",
    Icon: ShoppingCart,
  },

  "bank-verification": {
    title: "Bank Transfer Verification",
    Icon: Landmark,
  },

  inventory: {
    title: "Inventory",
    Icon: Package,
  },

  "update-status": {
    title: "Update Status",
    Icon: RefreshCcw,
  },

  promotions: {
    title: "Promotions",
    Icon: Megaphone,
  },

  feedbacks: {
    title: "Feedbacks",
    Icon: MessageSquare,
  },

  deliveries: {
    title: "Deliveries",
    Icon: Truck,
  },

  suppliers: {
    title: "Supplier Management",
    Icon: Truck,
  },

  reports: {
    title: "Reports",
    Icon: BarChart3,
  },
};