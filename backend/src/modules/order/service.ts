import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Order from '../../database/models/Order.js';
import Service from '../../database/models/Service.js';
import Inventory from '../../database/models/Inventory.js';
import ApiError from '../../core/apiError.js';
import { PAYMENT_STATUS, ORDER_STATUS, DEFAULT_PAGINATION } from '../../core/constants.js';
import { generateOrderNo } from '../../utils/reference.js';
import { getIO } from '../../core/socket.js';
import * as voucherService from '../voucher/service.js';
import * as loyaltyService from '../loyalty/loyalty.service.js';
import { LOYALTY_RULES } from '../../core/constants.js';

interface CreateOrderInput {
  serviceId: string;
  weightKg?: number;
  reservedDateTime?: Date;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
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

  const subtotal = service.price * (input.weightKg || 1); 
  let extraFromOptions = 0;
  const selectedOptions = [];

  // 2. Process laundry options
  if (input.options && input.options.length > 0) {
    const inventoryItems = await Inventory.find({
      _id: { $in: input.options },
      isActive: true,
    });

    for (const item of inventoryItems) {
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
    pickupLat: input.pickupLat,
    pickupLng: input.pickupLng,
    deliveryLat: input.deliveryLat,
    deliveryLng: input.deliveryLng,
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

export const claimOrder = async (orderId: string, staffId: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.staffId) {
    throw new ApiError(400, 'Order already assigned to another rider');
  }

  // Determine next status based on current status
  let nextStatus = order.status;
  if (order.status === ORDER_STATUS.ORDER_PLACED || order.status === ORDER_STATUS.PENDING) {
    nextStatus = ORDER_STATUS.PICKUP_ASSIGNED;
  } else if (order.status === ORDER_STATUS.READY) {
    nextStatus = ORDER_STATUS.DELIVERY_ASSIGNED;
  }

  const staffIdObj = new mongoose.Types.ObjectId(staffId);
  order.staffId = staffIdObj as any;
  order.status = nextStatus;
  await order.save();

  return order;
};

export const getAvailableOrders = async (query: any) => {
  const { page, limit } = query;
  const p = parseInt(page as string) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit as string) || DEFAULT_PAGINATION.LIMIT;
  const skip = (p - 1) * l;

  const filter = {
    staffId: null,
    status: { $in: [ORDER_STATUS.ORDER_PLACED, ORDER_STATUS.PENDING, ORDER_STATUS.READY] }
  };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('userId', 'name telephone')
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

export const getStaffTasks = async (staffId: string, query: any) => {
  const { status, page, limit } = query;
  const p = parseInt(page as string) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit as string) || DEFAULT_PAGINATION.LIMIT;
  const skip = (p - 1) * l;

  const filter: any = { staffId };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('userId', 'name telephone')
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

  if (status === ORDER_STATUS.DELIVERED) {
    try {
      await loyaltyService.awardLoyaltyPoints(
        order.userId.toString(), 
        LOYALTY_RULES.POINTS_PER_ORDER || 10, 
        order._id.toString()
      );
    } catch (e) {
      console.error('Failed to award loyalty points:', e);
    }
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
  const p = parseInt(page as string) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit as string) || DEFAULT_PAGINATION.LIMIT;
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
  const p = parseInt(page as string) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit as string) || DEFAULT_PAGINATION.LIMIT;
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

export const generateReceiptPdf = async (id: string): Promise<Buffer> => {
  const order = await Order.findById(id)
    .populate('userId', 'name email address')
    .populate('serviceId', 'name price');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Header
    doc
      .fillColor('#444444')
      .fontSize(25)
      .text('B & W Laundry', 50, 50, { align: 'center' })
      .fontSize(10)
      .text('Premium Laundry Solutions', { align: 'center' })
      .moveDown();

    doc.moveDown();

    // Invoice Info
    doc
      .fillColor('#000000')
      .fontSize(18)
      .text('Receipt / Invoice', 50, 130);

    const invoiceTableTop = 160;
    doc
      .fontSize(10)
      .text('Order No:', 50, invoiceTableTop)
      .font('Helvetica-Bold')
      .text(order.orderNo, 150, invoiceTableTop)
      .font('Helvetica')
      .text('Date:', 50, invoiceTableTop + 15)
      .text(new Date(order.createdAt).toLocaleDateString(), 150, invoiceTableTop + 15)
      .text('Status:', 50, invoiceTableTop + 30)
      .text(order.status, 150, invoiceTableTop + 30);

    // Customer Info
    const customerInfoTop = 160;
    doc
      .fontSize(10)
      .text('Bill To:', 350, customerInfoTop)
      .font('Helvetica-Bold')
      .text((order.userId as any)?.name || 'Valued Customer', 350, customerInfoTop + 15)
      .font('Helvetica')
      .text((order.userId as any)?.email || '', 350, customerInfoTop + 30)
      .text(order.pickupAddress || '', 350, customerInfoTop + 45);

    // Items Header
    const itemTableTop = 250;
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Service Description', 50, itemTableTop)
      .text('Weight/Qty', 280, itemTableTop, { width: 90, align: 'right' })
      .text('Unit Price', 370, itemTableTop, { width: 90, align: 'right' })
      .text('Total', 480, itemTableTop, { width: 50, align: 'right' });

    doc
      .moveTo(50, itemTableTop + 15)
      .lineTo(550, itemTableTop + 15)
      .stroke();

    // Line items
    let position = itemTableTop + 30;
    doc
      .font('Helvetica')
      .text((order.serviceId as any)?.name || 'Laundry Service', 50, position)
      .text(`${order.weightKg || 1} kg`, 280, position, { width: 90, align: 'right' })
      .text(`LKR ${(order.subtotal / (order.weightKg || 1)).toFixed(2)}`, 370, position, { width: 90, align: 'right' })
      .text(`LKR ${order.subtotal.toFixed(2)}`, 480, position, { width: 50, align: 'right' });

    // Options (extra features)
    if (order.options && order.options.length > 0) {
      order.options.forEach((opt: any) => {
        position += 20;
        doc
          .fontSize(9)
          .text(`+ ${opt.name} (${opt.categoryName})`, 70, position)
          .text(`LKR ${opt.price.toFixed(2)}`, 480, position, { width: 50, align: 'right' });
      });
    }

    // Divider
    position += 30;
    doc
      .moveTo(50, position)
      .lineTo(550, position)
      .stroke();

    // Calculations
    position += 20;
    doc
      .fontSize(10)
      .text('Subtotal:', 350, position)
      .text(`LKR ${order.subtotal.toFixed(2)}`, 480, position, { width: 50, align: 'right' });

    position += 15;
    doc
      .text('Extra Fees:', 350, position)
      .text(`LKR ${order.extraFee.toFixed(2)}`, 480, position, { width: 50, align: 'right' });

    position += 15;
    doc
      .text('Delivery Fee:', 350, position)
      .text(`LKR ${order.deliveryFee.toFixed(2)}`, 480, position, { width: 50, align: 'right' });

    if ((order.discountTotal || 0) > 0) {
      position += 15;
      doc
        .fillColor('#EE5555')
        .text('Discount:', 350, position)
        .text(`- LKR ${order.discountTotal.toFixed(2)}`, 480, position, { width: 50, align: 'right' })
        .fillColor('#000000');
    }

    position += 20;
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('TOTAL:', 350, position)
      .text(`LKR ${order.totalAmount.toFixed(2)}`, 450, position, { width: 100, align: 'right' });

    // Footer
    doc
      .font('Helvetica')
      .fontSize(10)
      .text('Thank you for choosing B & W Laundry!', 50, 700, { align: 'center', width: 500 });

    doc.end();
  });
};
