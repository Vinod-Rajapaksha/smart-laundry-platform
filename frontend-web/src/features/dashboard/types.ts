export interface RevenuePoint {
  date: string;
  amount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface DashboardKPIs {
  todayRevenue: number;
  newOrders: number;
  activeStaff: number;
  pendingDeliveries: number;
  revenueTrend: RevenuePoint[];
  orderStatusDistribution: StatusDistribution[];
  
  // Cross-module metrics
  averageRating?: number;
  lowStockItems?: number;
  activeServices?: number;
  activeVouchers?: number;
  totalCustomers?: number;
}

export type DateRange = "today" | "week" | "month" | "year";
