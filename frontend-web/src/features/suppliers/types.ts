export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalCategories: number;
}

export type SupplierTab = "All Vendors" | "Active" | "Inactive";
