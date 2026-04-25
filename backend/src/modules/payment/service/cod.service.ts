import CashOnDelivery from '../../../database/models/CashOnDelivery.js';
import Order from '../../../database/models/Order.js';
import Payment from '../../../database/models/Payment.js';
import ApiError from '../../../core/apiError.js';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../../core/constants.js';

export const confirmCODPayment = async (orderId: string, userId: string) => {
  const order = await Order.findOne({ orderNo: orderId, userId });
  if (!order) throw new ApiError(404, 'Order not found');

  const payment = await Payment.findOne({
    orderId: order._id,
    method: PAYMENT_METHODS.COD,
    status: PAYMENT_STATUS.PENDING
  });

  if (!payment) throw new ApiError(404, 'Initiated COD payment not found');

  const codRecord = await CashOnDelivery.create({
    paymentId: payment._id,
    orderId: order._id,
    userId: order.userId,
    status: PAYMENT_STATUS.PENDING,
  });

  return codRecord;
};

export const getFilteredCashOnDeliveries = async (status?: string, search?: string) => {
  let matchQuery: any = {};

  if (status && status !== 'All') {
    matchQuery.status = status;
  }

  const pipeline: any[] = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'payments',
        localField: 'paymentId',
        foreignField: '_id',
        as: 'payment'
      }
    },
    { $unwind: '$payment' },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order'
      }
    },
    { $unwind: '$order' },
    {
      $lookup: {
        from: 'users',
        localField: 'order.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'users',
        localField: 'collectedBy',
        foreignField: '_id',
        as: 'collector'
      }
    },
    {
      $unwind: {
        path: '$collector',
        preserveNullAndEmptyArrays: true
      }
    }
  ];

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { 'order.orderNo': searchRegex },
          { 'user.name': searchRegex },
          { 'collector.name': searchRegex },
          { notes: searchRegex }
        ]
      }
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const cods = await CashOnDelivery.aggregate(pipeline);
  return cods;
};
