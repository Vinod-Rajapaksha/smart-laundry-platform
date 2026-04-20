import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Landmark,
  Package,
  RefreshCcw,
  MessageSquare,
  Truck,
  BarChart3,
  Ticket,
  Star,
  Settings2,
  CreditCard,
  Banknote,
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

  "payments": {
    title: "Payments",
    Icon: CreditCard,
  },

  "ledger": {
    title: "Consolidated Ledger",
    Icon: LayoutDashboard,
  },

  "online": {
    title: "Card Payments",
    Icon: CreditCard,
  },

  cod: {
    title: "Cash on Delivery",
    Icon: Banknote,
  },

  "bank-transfer": {
    title: "Bank Transfer Ledger",
    Icon: Landmark,
  },

  "bank-verification": {
    title: "Bank Transfer Verification",
    Icon: Landmark,
  },

  inventory: {
    title: "Inventory",
    Icon: Package,
  },

  pricing: {
    title: "Pricing Rules",
    Icon: Settings2,
  },

  "update-status": {
    title: "Update Status",
    Icon: RefreshCcw,
  },

  vouchers: {
    title: "Voucher Management",
    Icon: Ticket,
  },

  loyalty: {
    title: "Loyalty Program",
    Icon: Star,
  },

  feedbacks: {
    title: "Feedbacks",
    Icon: MessageSquare,
  },

  deliveries: {
    title: "Deliveries",
    Icon: Truck,
  },

  reports: {
    title: "Reports",
    Icon: BarChart3,
  },
};