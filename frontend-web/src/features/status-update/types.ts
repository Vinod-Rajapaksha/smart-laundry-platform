import type { Order } from "../orders/types";

export const ORDER_STATUS = {
  ORDER_PLACED: 'ORDER_PLACED',
  PENDING: 'PENDING',
  PICKUP_ASSIGNED: 'PICKUP_ASSIGNED',
  PICKUP_ON_THE_WAY: 'PICKUP_ON_THE_WAY',
  PICKED_UP: 'PICKED_UP',
  WASHING: 'WASHING',
  DRYING: 'DRYING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED',
  DELIVERY_ON_THE_WAY: 'DELIVERY_ON_THE_WAY',
  ON_THE_WAY: 'ON_THE_WAY',
  DELIVERED: 'DELIVERED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export interface StatusUpdateOrder extends Omit<Order, 'status'> {
  status: OrderStatus;
  userId: any; // Populated with { name: string }
}

export const MANUAL_TRANSITIONS: Record<string, OrderStatus> = {
  [ORDER_STATUS.PICKED_UP]: ORDER_STATUS.WASHING,
  [ORDER_STATUS.WASHING]: ORDER_STATUS.DRYING,
  [ORDER_STATUS.DRYING]: ORDER_STATUS.PROCESSING,
  [ORDER_STATUS.PROCESSING]: ORDER_STATUS.READY,
};

export type Tab = "All" | "In-Process" | "Completed" | "Cancelled";
