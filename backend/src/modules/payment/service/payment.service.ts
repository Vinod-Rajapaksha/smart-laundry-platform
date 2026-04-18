import mongoose from 'mongoose';
import Payment from '../../../database/models/Payment.js';
import Order from '../../../database/models/Order.js';
import ApiError from '../../../core/apiError.js';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../../core/constants.js';
import { generateBankReference } from '../../../utils/reference.js';
import * as loyaltyService from '../../loyalty/loyalty.service.js';
import crypto from 'crypto';

async function generateUniqueReference(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const ref = generateBankReference();
    const exists = await Payment.exists({ transactionRef: ref });
    if (!exists) return ref;
  }
  throw new ApiError(500, 'Failed to generate unique reference');
}

export async function initBankTransferPayment(orderId: string, userId: string) {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNo: orderId });
  }

  if (!order) throw new ApiError(404, 'Order not found');

  if (String(order.userId) !== String(userId)) {
    throw new ApiError(403, 'You cannot pay for this order');
  }

  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    throw new ApiError(400, 'Order is already paid');
  }

  const reference = await generateUniqueReference();

  const payment = await Payment.create({
    orderId: order._id,
    amount: order.totalAmount,
    method: PAYMENT_METHODS.BANK_TRANSFER,
    status: PAYMENT_STATUS.PENDING,
    provider: 'BANK',
    transactionRef: reference,
    paidAt: null,
  });

  order.paymentMethod = PAYMENT_METHODS.BANK_TRANSFER;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  return {
    payment,
    bank: {
      bankName: process.env.BANK_NAME,
      accountNo: process.env.BANK_ACCOUNT_NO,
      accountName: process.env.BANK_ACCOUNT_NAME,
      branch: process.env.BANK_BRANCH,
      reference,
    },
  };
}

export async function initCODPayment(orderId: string, userId: string) {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNo: orderId });
  }

  if (!order) throw new ApiError(404, 'Order not found');

  if (String(order.userId) !== String(userId)) {
    throw new ApiError(403, 'You cannot pay for this order');
  }

  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    throw new ApiError(400, 'Order is already paid');
  }

  const reference = await generateUniqueReference();

  const payment = await Payment.create({
    orderId: order._id,
    amount: order.totalAmount,
    method: PAYMENT_METHODS.COD,
    status: PAYMENT_STATUS.PENDING,
    provider: 'COD',
    transactionRef: reference,
    paidAt: null,
  });

  order.paymentMethod = PAYMENT_METHODS.COD;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  return {
    payment,
    message: 'Cash on delivery payment initiated',
  };
}

export async function initCardPayment(orderId: string, userId: string) {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId).populate('userId', 'name email telephone address');
  } else {
    order = await Order.findOne({ orderNo: orderId }).populate('userId', 'name email telephone address');
  }

  if (!order) throw new ApiError(404, 'Order not found');

  // Populate gives us an object, so we extract _id carefully
  const orderOwnerId = order.userId && (order.userId as any)._id ? (order.userId as any)._id.toString() : order.userId?.toString();

  if (orderOwnerId !== String(userId)) {
    throw new ApiError(403, 'You cannot pay for this order');
  }

  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    throw new ApiError(400, 'Order is already paid');
  }

  const reference = await generateUniqueReference();

  const payment = await Payment.create({
    orderId: order._id,
    amount: order.totalAmount,
    method: PAYMENT_METHODS.CARD,
    status: PAYMENT_STATUS.PENDING,
    provider: 'PAYHERE',
    transactionRef: reference,
    paidAt: null,
  });

  order.paymentMethod = PAYMENT_METHODS.CARD;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  const merchantId = process.env.EXPO_PUBLIC_PAYHERE_MERCHANT_ID || '';
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '';
  const currency = 'LKR';
  const amountFormatted = order.totalAmount.toFixed(2);

  const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const rawData = merchantId + reference + amountFormatted + currency + secretHash;
  const hash = crypto.createHash('md5').update(rawData).digest('hex').toUpperCase();

  const customer = order.userId as any;

  return {
    payment,
    payhereParams: {
      sandbox: true,
      merchant_id: merchantId,
      return_url: 'smart-laundry-platform://payment/success',
      cancel_url: 'smart-laundry-platform://payment/cancel',
      notify_url: `${process.env.EXPO_PUBLIC_API_BASE_URL}/payments/payhere/notify`,
      order_id: reference,
      items: 'Laundry Order #' + order._id.toString().substring(0, 8),
      amount: amountFormatted,
      currency: currency,
      hash: hash,
      first_name: customer?.name?.split(' ')[0] || 'Customer',
      last_name: customer?.name?.split(' ').slice(1).join(' ') || '',
      email: customer?.email || '',
      phone: customer?.telephone || '',
      address: customer?.address || 'Sri Lanka',
      city: 'Colombo',
      country: 'Sri Lanka',
    }
  };
}


export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  const oldStatus = order.paymentStatus;
  order.paymentStatus = paymentStatus;
  await order.save();

  // If status changed to PAID, award 10 loyalty points
  if (paymentStatus === PAYMENT_STATUS.PAID && oldStatus !== PAYMENT_STATUS.PAID) {
    await loyaltyService.awardLoyaltyPoints(String(order.userId), 10, String(order._id));
  }

  return order;
}