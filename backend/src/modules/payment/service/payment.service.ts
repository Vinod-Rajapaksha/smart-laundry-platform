import mongoose from 'mongoose';
import Payment from '../../../database/models/Payment.js';
import Order from '../../../database/models/Order.js';
import BankTransfer from '../../../database/models/BankTransfer.js';
import CashOnDelivery from '../../../database/models/CashOnDelivery.js';
import ApiError from '../../../core/apiError.js';
import {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
  PAYMENT_PROVIDERS,
  BANK_VERIFICATION_STATUS
} from '../../../core/constants.js';
import { generateBankReference } from '../../../utils/reference.js';
import * as loyaltyService from '../../loyalty/loyalty.service.js';
import { createNotification } from '../../notification/service.js';
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

  let payment = await Payment.findOne({
    orderId: order._id,
    status: PAYMENT_STATUS.PENDING
  });

  let reference;
  if (payment) {
    reference = payment.transactionRef;
    if (payment.method !== PAYMENT_METHODS.BANK_TRANSFER) {
      payment.method = PAYMENT_METHODS.BANK_TRANSFER;
      payment.provider = PAYMENT_PROVIDERS.BANK;
      await payment.save();
    }
  } else {
    reference = await generateUniqueReference();
    payment = await Payment.create({
      orderId: order._id,
      userId: userId,
      amount: order.totalAmount,
      method: PAYMENT_METHODS.BANK_TRANSFER,
      status: PAYMENT_STATUS.PENDING,
      provider: PAYMENT_PROVIDERS.BANK,
      transactionRef: reference,
      paidAt: null,
    });
  }

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

  let payment = await Payment.findOne({
    orderId: order._id,
    status: PAYMENT_STATUS.PENDING
  });

  if (payment) {
    if (payment.method !== PAYMENT_METHODS.COD) {
      payment.method = PAYMENT_METHODS.COD;
      payment.provider = PAYMENT_PROVIDERS.COD;
      await payment.save();
    }
  } else {
    const reference = await generateUniqueReference();
    payment = await Payment.create({
      orderId: order._id,
      userId: userId,
      amount: order.totalAmount,
      method: PAYMENT_METHODS.COD,
      status: PAYMENT_STATUS.PENDING,
      provider: PAYMENT_PROVIDERS.COD,
      transactionRef: reference,
      paidAt: null,
    });
  }

  order.paymentMethod = PAYMENT_METHODS.COD;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  await CashOnDelivery.findOneAndUpdate(
    { paymentId: payment._id },
    {
      paymentId: payment._id,
      orderId: order._id,
      userId: userId,
      status: PAYMENT_STATUS.PENDING
    },
    { upsert: true, new: true }
  );

  return {
    payment,
    message: 'Cash on delivery payment initiated',
  };
}

export async function initCardPayment(orderId: string, userId: string, saveCard: boolean = false) {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId).populate('userId', 'name email telephone address');
  } else {
    order = await Order.findOne({ orderNo: orderId }).populate('userId', 'name email telephone address');
  }

  if (!order) throw new ApiError(404, 'Order not found');

  const orderOwnerId = order.userId && (order.userId as any)._id ? (order.userId as any)._id.toString() : order.userId?.toString();

  if (orderOwnerId !== String(userId)) {
    throw new ApiError(403, 'You cannot pay for this order');
  }

  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    throw new ApiError(400, 'Order is already paid');
  }

  let payment = await Payment.findOne({
    orderId: order._id,
    status: PAYMENT_STATUS.PENDING
  });

  let reference;
  if (payment) {
    reference = payment.transactionRef;
    if (payment.method !== PAYMENT_METHODS.CARD) {
      payment.method = PAYMENT_METHODS.CARD;
      payment.provider = PAYMENT_PROVIDERS.PAYHERE;
      await payment.save();
    }
  } else {
    reference = await generateUniqueReference();
    payment = await Payment.create({
      orderId: order._id,
      userId: userId,
      amount: order.totalAmount,
      method: PAYMENT_METHODS.CARD,
      status: PAYMENT_STATUS.PENDING,
      provider: PAYMENT_PROVIDERS.PAYHERE,
      transactionRef: reference,
      paidAt: null,
    });
  }

  order.paymentMethod = PAYMENT_METHODS.CARD;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  await order.save();

  const merchantId = (process.env.PAYHERE_MERCHANT_ID || '').trim();
  const merchantSecret = (process.env.PAYHERE_SECRET || '').trim();
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
      return_url: `${process.env.API_BASE_URL}/payment/success`,
      cancel_url: `${process.env.API_BASE_URL}/payment/cancel`,
      notify_url: `${process.env.API_BASE_URL}/api/payments/online/payhere/notify`,
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
      city: '',
      country: 'Sri Lanka',
      custom_1: saveCard ? 'SAVE_CARD' : 'NO_SAVE'
    }
  };
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  const oldStatus = order.paymentStatus;
  order.paymentStatus = paymentStatus;
  await order.save();

  // Notification for payment status update
  if (paymentStatus === PAYMENT_STATUS.PAID && oldStatus !== PAYMENT_STATUS.PAID) {
    await createNotification(String(order.userId), {
      title: 'Payment Successful',
      message: `Your payment for order ${order.orderNo} has been received.`,
      type: NOTIFICATION_TYPES.PAYMENT,
      data: { orderId: order._id, status: PAYMENT_STATUS.PAID }
    });
    await loyaltyService.awardLoyaltyPoints(String(order.userId), 10, String(order._id));
  }

  return order;
}

export async function getPaymentDashboardStats() {
  const [totalRevenueData, successRateData, methodSplit] = await Promise.all([
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 2 }
    ]),

    // Success Rate
    Payment.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          successCount: { $sum: { $cond: [{ $eq: ["$status", PAYMENT_STATUS.PAID] }, 1, 0] } }
        }
      }
    ]),

    // Method Split
    Payment.aggregate([
      {
        $group: {
          _id: "$method",
          value: { $sum: 1 }
        }
      }
    ])
  ]);

  // Daily Trajectory (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const trajectory = await Payment.aggregate([
    { $match: { status: PAYMENT_STATUS.PAID, paidAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        amount: { $sum: "$amount" },
        sortDate: { $first: "$paidAt" }
      }
    },
    { $sort: { sortDate: 1 } }
  ]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Counts from specific models
  const [pendingVerifications, activeCOD] = await Promise.all([
    BankTransfer.countDocuments({ verifyStatus: BANK_VERIFICATION_STATUS.PENDING }),
    CashOnDelivery.aggregate([
      { $match: { status: BANK_VERIFICATION_STATUS.PENDING } },
      {
        $lookup: {
          from: 'payments',
          localField: 'paymentId',
          foreignField: '_id',
          as: 'payment'
        }
      },
      { $unwind: '$payment' },
      { $group: { _id: null, total: { $sum: '$payment.amount' }, count: { $sum: 1 } } }
    ])
  ]);

  const currentMonthRevenue = totalRevenueData[0]?.total || 0;
  const prevMonthRevenue = totalRevenueData[1]?.total || 0;
  const revChange = prevMonthRevenue ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;

  const successRate = successRateData[0] ? (successRateData[0].successCount / successRateData[0].totalCount) * 100 : 0;

  const totalMethodCount = methodSplit.reduce((acc, curr) => acc + curr.value, 0);
  const methodData = methodSplit.map(m => ({
    name: m._id,
    value: Math.round((m.value / totalMethodCount) * 100),
    color: m._id === PAYMENT_METHODS.CARD || m._id === 'ONLINE' ? '#3b82f6' : m._id === PAYMENT_METHODS.COD ? '#10b981' : '#8b5cf6'
  }));

  return {
    kpis: {
      totalRevenue: currentMonthRevenue,
      revenueChange: revChange.toFixed(1),
      successRate: successRate.toFixed(1),
      pendingVerifications,
      activeCODAmt: activeCOD[0]?.total || 0,
      pendingSettlements: activeCOD[0]?.count || 0
    },
    trajectory: trajectory.map(t => ({
      name: weekdays[new Date(t.sortDate).getDay()],
      amount: t.amount
    })),
    methodSplit: methodData
  };
}

export async function getAllPayments(filters: { status?: string } = {}) {
  const query: any = {};
  if (filters.status && filters.status !== 'All') {
    query.status = filters.status;
  }

  return Payment.find(query)
    .sort({ createdAt: -1 })
    .populate('orderId', 'orderNo');
}

export async function adminVerifyPayment(paymentId: string, status: 'PAID' | 'FAILED') {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, 'Payment not found');

  if (payment.status !== PAYMENT_STATUS.PENDING) {
    throw new ApiError(400, 'Payment is already processed');
  }

  payment.status = status;
  if (status === PAYMENT_STATUS.PAID) {
    payment.paidAt = new Date();
  }
  await payment.save();

  // Sync with Order
  const order = await Order.findById(payment.orderId);
  if (order) {
    const oldStatus = order.paymentStatus;
    order.paymentStatus = status;
    if (status === PAYMENT_STATUS.PAID) {
      order.paidAt = new Date();
      // Award loyalty points & Notification
      if (oldStatus !== PAYMENT_STATUS.PAID) {
        await createNotification(String(order.userId), {
          title: 'Payment Verified',
          message: `Your payment for order ${order.orderNo} has been verified by admin.`,
          type: NOTIFICATION_TYPES.PAYMENT,
          data: { orderId: order._id, status: PAYMENT_STATUS.PAID }
        });
        await loyaltyService.awardLoyaltyPoints(String(order.userId), 10, String(order._id));
      }
    }
    await order.save();
  }

  return payment;
}
