export interface LaundryService {
  _id: string;
  name: string;
  category: "Wash & Fold" | "Dry Cleaning" | "Ironing" | "Premium Care" | "Other";
  unit: 'KG' | 'PCS' | 'SET' | 'L' | 'ML';
  basePrice: number;
  estimatedHours: number;
  isActive: boolean;
  isPopular: boolean;
  description: string | null;
  inventoryItems?: {
    itemId: string;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceQuery {
  category?: string;
  isActive?: boolean;
  isPopular?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ServiceResponse {
  items: LaundryService[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type ServiceTab = "All" | "Wash & Fold" | "Dry Cleaning" | "Ironing" | "Premium Care";
