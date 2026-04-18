export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Delivered"
  | "Cancelled";

export interface OrderOption {
  inventoryId: string;
  name: string;
  price: number;
  categoryName: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  userId: string;
  updateBy?: string;
  serviceId: string;
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

export type Tab = "All" | "Pending" | "Processing" | "Completed" | "Cancelled";
