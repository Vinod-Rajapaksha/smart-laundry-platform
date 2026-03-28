export type OrderStatus =
  | 'PENDING'
  | 'PICKUP_ASSIGNED'
  | 'PICKUP_ENROUTE'
  | 'PICKED_UP'
  | 'PROCESSING'
  | 'READY'
  | 'DELIVERY_ASSIGNED'
  | 'DELIVERY_ENROUTE'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DeliveryOrder {
  _id: string;
  orderNo: string;
  status: OrderStatus;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  totalAmount: number;
  weightKg: number | null;
  notes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  riderLatitude: number | null;
  riderLongitude: number | null;
  updatedAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    telephone: string;
  };
}

export interface DeliveryDashboardData {
  orders: DeliveryOrder[];
  grouped: Record<OrderStatus, DeliveryOrder[]>;
  counts: Record<OrderStatus, number>;
}