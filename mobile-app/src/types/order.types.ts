export type OrderStatus = 
  | 'ORDER_PLACED'
  | 'PICKUP_ASSIGNED'
  | 'PICKUP_ON_THE_WAY'
  | 'PICKUP_ARRIVED'
  | 'PICKED_UP'
  | 'HANDED_OVER'
  | 'WASHING'
  | 'DRYING'
  | 'PROCESSING'
  | 'READY'
  | 'DELIVERY_ASSIGNED'
  | 'DELIVERY_ON_THE_WAY'
  | 'DELIVERY_ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingLog {
  status: OrderStatus;
  timestamp: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNo?: string;
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
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
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
  isReviewed?: boolean;
  paidAt?: string;
  bankVerificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}
