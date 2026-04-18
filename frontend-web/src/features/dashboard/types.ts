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
}

export type DateRange = "today" | "week" | "month" | "year";
