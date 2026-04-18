export interface ReservationOption {
  inventoryId: string;
  name: string;
  price: number;
  categoryName: string;
}

export interface ReservationState {
  serviceMode: 'PICKUP_DELIVERY' | 'SELF_SERVICE' | null;
  serviceId: string | null;
  selectedOptions: ReservationOption[];
  scheduledDate: string | null; // ISO string
  pickupAddress: string | null;
  deliveryAddress: string | null;
  weightKg: number | null;
  notes: string | null;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface InventoryItem {
  _id: string;
  name: string;
  categoryName: string;
  unitPrice: number;
  isDefault: boolean;
  unit: string;
  description: string | null;
}
