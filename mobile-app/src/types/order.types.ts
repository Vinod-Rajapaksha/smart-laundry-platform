export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_WASH'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingLog {
  status: OrderStatus;
  timestamp: string;
  notes?: string;
}

export interface Order {
  _id: string;
  customer: string;
  serviceId: any;
  serviceMode: 'PICKUP_DELIVERY' | 'SELF_SERVICE';
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  deliveryFee: number;
  subtotal: number;
  extraFee: number;
  totalAmount: number;
  reservedDateTime: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  weightKg?: number;
  options?: Array<{
    inventoryId: string;
    name: string;
    price: number;
    categoryName: string;
  }>;
  voucherId?: string;
  discountTotal?: number;
  trackingLogs: TrackingLog[];
  createdAt: string;
  updatedAt: string;
}
