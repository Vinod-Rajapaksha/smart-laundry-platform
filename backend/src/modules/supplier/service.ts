import mongoose from 'mongoose';
import ApiError from '../../core/apiError.js';
import { getPagination } from '../../core/pagination.js';
import { SUPPLIER_STATUS } from '../../core/constants.js';
import Supplier from '../../database/models/Supplier.js';

export const createSupplier = async (data: any) => {
  const existing = await Supplier.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(400, 'Supplier with this email already exists');
  }
  return await Supplier.create(data);
};

export const getSuppliers = async (query: any) => {
  const { page, limit, status, search } = query;
  const { page: p, limit: l, skip } = getPagination(page, limit);

  const filter: any = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    Supplier.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Supplier.countDocuments(filter),
  ]);

  return {
    suppliers,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    },
  };
};

export const getSupplierById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid Supplier ID');
  const supplier = await Supplier.findById(id);
  if (!supplier) throw new ApiError(404, 'Supplier not found');
  return supplier;
};

export const updateSupplier = async (id: string, data: any) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid Supplier ID');
  
  if (data.email) {
    const existing = await Supplier.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(400, 'Supplier with this email already exists');
    }
  }

  const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!supplier) throw new ApiError(404, 'Supplier not found');
  return supplier;
};

export const deleteSupplier = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid Supplier ID');
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier) throw new ApiError(404, 'Supplier not found');
  return supplier;
};

export const getSupplierStats = async () => {
  const [total, active, categories] = await Promise.all([
    Supplier.countDocuments(),
    Supplier.countDocuments({ status: SUPPLIER_STATUS.ACTIVE }),
    Supplier.distinct('category'),
  ]);

  return {
    totalSuppliers: total,
    activeSuppliers: active,
    totalCategories: categories.length,
  };
};
