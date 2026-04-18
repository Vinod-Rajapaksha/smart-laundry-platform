import mongoose from 'mongoose';
import Order from '../../database/models/Order.js';
import Service from '../../database/models/Service.js';
import Inventory from '../../database/models/Inventory.js';
import ApiError from '../../core/apiError.js';
import { PAYMENT_STATUS, ORDER_STATUS, DEFAULT_PAGINATION } from '../../core/constants.js';
import { generateOrderNo } from '../../utils/reference.js';
import { getIO } from '../../core/socket.js';
import * as voucherService from '../voucher/service.js';

interface CreateOrderInput {
  serviceId: string;
  weightKg?: number;
  reservedDateTime?: Date;
  pickupAddress?: string;
  deliveryAddress?: string;
  notes?: string;
  extraFee?: number;
  deliveryFee?: number;
  paymentMethod: string;
  options?: string[]; // Inventory item IDs
}

export const createOrder = async (userId: string, input: CreateOrderInput) => {
  // 1. Fetch main service
  const service = await Service.findById(input.serviceId);
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  const subtotal = service.price * (input.weightKg || 1); // Base price * weight
  let extraFromOptions = 0;
  const selectedOptions = [];

  // 2. Process laundry options (detergent, fabric care etc)
  if (input.options && input.options.length > 0) {
    const inventoryItems = await Inventory.find({
      _id: { $in: input.options },
      isActive: true,
    });

    for (const item of inventoryItems) {
      // If it's NOT default, add to the price
      if (!item.isDefault) {
        extraFromOptions += item.unitPrice;
      }

      selectedOptions.push({
        inventoryId: item._id,
        name: item.name,
        price: item.isDefault ? 0 : item.unitPrice,
        categoryName: item.categoryName,
      });
    }
  }

  const extraFee = (input.extraFee || 0) + extraFromOptions;
  const deliveryFee = input.deliveryFee || 0;
  const totalAmount = subtotal + extraFee + deliveryFee;

  // 3. Generate unique order number
  let orderNo = generateOrderNo();
  let exists = await Order.exists({ orderNo });
  while (exists) {
    orderNo = generateOrderNo();
    exists = await Order.exists({ orderNo });
  }

  // 4. Create Order
  const order = await Order.create({
    orderNo,
    userId,
    serviceId: input.serviceId,
    weightKg: input.weightKg,
    status: ORDER_STATUS.ORDER_PLACED,
    reservedDateTime: input.reservedDateTime,
    pickupAddress: input.pickupAddress,
    deliveryAddress: input.deliveryAddress,
    notes: input.notes,
    subtotal,
    extraFee,
    deliveryFee,
    totalAmount,
    paymentMethod: input.paymentMethod,
    paymentStatus: PAYMENT_STATUS.PENDING,
    options: selectedOptions,
  });

  return order;
};

export const updateOrderStatus = async (id: string, status: string, updateBy: string) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { $set: { status, updateBy } },
    { new: true }
  );
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Push real-time update to the specific customer via Socket.io
  try {
    const io = getIO();
    io.to(`user_${order.userId.toString()}`).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error('Socket execution failed (possibly not initialized)', e);
  }

  return order;
};

export const getOrderById = async (id: string) => {
  const order = await Order.findById(id)
    .populate('userId', 'name email telephone')
    .populate('serviceId', 'name price');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
};

export const getMyOrders = async (userId: string, query: any) => {
  const { status, page, limit } = query;
  const p = parseInt(page) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit) || DEFAULT_PAGINATION.LIMIT;
  const skip = (p - 1) * l;

  const filter: any = { userId };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('serviceId', 'name'),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    },
  };
};

export const getAllOrders = async (query: any) => {
  const { status, userId, page, limit } = query;
  const p = parseInt(page) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit) || DEFAULT_PAGINATION.LIMIT;
  const skip = (p - 1) * l;

  const filter: any = {};
  if (status) filter.status = status;
  if (userId) filter.userId = userId;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('userId', 'name')
      .populate('serviceId', 'name'),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    },
  };
};

export const applyVoucher = async (orderId: string, userId: string, voucherCode: string) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.voucherId) {
    throw new ApiError(400, 'A voucher has already been applied to this order');
  }

  // Calculate order amount for validation (subtotal + extraFee)
  const currentAmount = order.subtotal + order.extraFee;

  // Validate voucher
  const voucher = await voucherService.validateVoucher(voucherCode, userId, currentAmount);

  // Calculate discount
  let discountTotal = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    discountTotal = (currentAmount * voucher.discountValue) / 100;
    if (voucher.maxDiscount && discountTotal > voucher.maxDiscount) {
      discountTotal = voucher.maxDiscount;
    }
  } else {
    discountTotal = voucher.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  if (discountTotal > currentAmount) {
    discountTotal = currentAmount;
  }

  // Update order
  order.discountTotal = discountTotal;
  order.totalAmount = currentAmount + order.deliveryFee - discountTotal;
  order.voucherId = voucher._id;

  await order.save();

  return order;
};
