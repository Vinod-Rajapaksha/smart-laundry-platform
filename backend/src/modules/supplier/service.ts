import Supplier, { ISupplier } from '../../database/models/Supplier.js';

export const createSupplierSession = async (data: Partial<ISupplier>) => {
  const supplier = new Supplier(data);
  return await supplier.save();
};

export const fetchAllSuppliers = async () => {
  return await Supplier.find().sort({ createdAt: -1 });
};

export const fetchSupplierById = async (id: string) => {
  return await Supplier.findById(id);
};

export const editSupplier = async (id: string, data: Partial<ISupplier>) => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true });
};

export const removeSupplier = async (id: string) => {
  return await Supplier.findByIdAndDelete(id);
};
