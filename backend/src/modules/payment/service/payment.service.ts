import mongoose from 'mongoose';
import Payment from '../../../database/models/Payment.js';
import Order from '../../../database/models/Order.js';
import ApiError from '../../../core/apiError.js';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../../core/constants.js';
import { generateBankReference } from '../../../utils/reference.js';

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