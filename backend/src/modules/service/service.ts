import Service from '../../database/models/Service.js';
import ApiError from '../../core/apiError.js';

interface ServiceInput {
  categoryId: string;
  name: string;
  price: number;
  inventoryItems?: { itemId: string; quantity: number }[];
}

export const createService = async (input: ServiceInput) => {
  const service = await Service.create(input);
  return service;
};

export const updateService = async (id: string, input: Partial<ServiceInput>) => {
  const service = await Service.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  return service;
};

export const deleteService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Service not found');
  }
  return { success: true };
};

export const getServiceById = async (id: string) => {
  const service = await Service.findById(id).populate('categoryId', 'name');
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  return service;
};

export const getAllServices = async (query: any) => {
  const { limit, sort, status_ne, ...filters } = query;

  const mongoQuery: any = {};

  if (status_ne) {
    mongoQuery.status = { $ne: status_ne };
  }

  let dbQuery = Service.find(mongoQuery);

  if (sort) dbQuery = dbQuery.sort(sort);
  if (limit) dbQuery = dbQuery.limit(Number(limit));

  return await dbQuery.exec();
};

export const getServicesByCategory = async (categoryId: string) => {
  return await Service.find({ categoryId }).sort({ name: 1 });
};
