import Service from '../../database/models/Service.js';
import ServiceCategory from '../../database/models/ServiceCategory.js';
import Order from '../../database/models/Order.js';

// Service Categories
export const createServiceCategory = async (data: any) => {
    return await ServiceCategory.create(data);
};

export const getServiceCategories = async () => {
    return await ServiceCategory.find();
};

export const updateServiceCategory = async (id: string, data: any) => {
    return await ServiceCategory.findByIdAndUpdate(id, data, { new: true });
};

export const deleteServiceCategory = async (id: string) => {
    return await ServiceCategory.findByIdAndDelete(id);
};

// Services
export const createService = async (data: any) => {
    return await Service.create(data);
};

export const getServices = async (query = {}) => {
    return await Service.find(query).populate('categoryId');
};

export const updateService = async (id: string, data: any) => {
    return await Service.findByIdAndUpdate(id, data, { new: true });
};

export const deleteService = async (id: string) => {
    return await Service.findByIdAndDelete(id);
};

// Pricing Calculation
export const calculatePrices = async (serviceId: string, weightKg: number, finishingType?: string) => {
    const service: any = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');
    
    const basePrice = service.price;
    let finishFee = 0;
    
    if (finishingType === 'Pressed') finishFee = 200;
    else if (finishingType === 'Folded') finishFee = 100;
    else if (finishingType === 'Hanged') finishFee = 150;
    
    const extraFee = finishFee * weightKg;
    const subtotal = basePrice + extraFee;
    
    return { basePrice, extraFee, subtotal };
};

// Orders
export const createOrder = async (data: any) => {
    // Basic auto-generated fields if not provided
    if (!data.orderNo) {
        // Simple distinct logic using date + random string
        data.orderNo = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }
    
    // Perform calculation if missing subtotal and extra fee
    if (data.serviceId && data.weightKg) {
        const caps = await calculatePrices(data.serviceId, data.weightKg, data.finishingType);
        data.subtotal = caps.subtotal;
        data.extraFee = caps.extraFee;
        data.totalAmount = caps.subtotal + (data.deliveryFee || 0) - (data.discountTotal || 0);
    }
    
    return await Order.create(data);
};

export const getOrders = async (page: number, limit: number, filters: any) => {
    const skip = (page - 1) * limit;
    const query: any = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.serviceMode) query.serviceMode = filters.serviceMode;
    if (filters.finishingType) query.finishingType = filters.finishingType;
    
    const [orders, total] = await Promise.all([
        Order.find(query)
             .skip(skip)
             .limit(limit)
             .populate('userId', 'name email phone')
             .populate('serviceId', 'name price'),
        Order.countDocuments(query)
    ]);
    
    return { orders, total, page, limit };
};

export const updateOrder = async (id: string, data: any) => {
    // If order involves recalc, can be added depending on whether service properties are changed.
    return await Order.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOrder = async (id: string) => {
    return await Order.findByIdAndDelete(id);
};