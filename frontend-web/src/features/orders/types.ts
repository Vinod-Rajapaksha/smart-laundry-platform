export type OrderStatus =
  | "ORDER_PLACED"
  | "PICKUP_ASSIGNED"
  | "PICKUP_ON_THE_WAY"
  | "PICKUP_ARRIVED"
  | "PICKED_UP"
  | "HANDED_OVER"
  | "WASHING"
  | "DRYING"
  | "PROCESSING"
  | "READY"
  | "DELIVERY_ASSIGNED"
  | "DELIVERY_ON_THE_WAY"
  | "DELIVERY_ARRIVED"
  | "DELIVERED"
  | "CANCELLED"

export interface OrderOption {
  inventoryId: string;
  name: string;
  price: number;
  categoryName: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  userId: any;
  updateBy?: string;
  serviceId: any;
  weightKg?: number;
  status: OrderStatus;
  reservedDateTime?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  notes?: string;
  subtotal: number;
  extraFee: number;
  discountTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  options: OrderOption[];
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All" | "Pending" | "Pickup" | "Processing" | "Delivery" | "Completed" | "Cancelled";
