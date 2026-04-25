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
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  weightKg: number | null;
  notes: string | null;
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER' | null;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  categoryId: string;
  unit: string;
  category?: string;
  description?: string;
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
