import OnlineTransaction from '../../../database/models/OnlineTransaction.js';

export const getFilteredOnlineTransactions = async (status?: string, search?: string) => {
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
        localField: 'payment.orderId',
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
  ];

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { gatewayOrderId: searchRegex },
          { gatewayPaymentId: searchRegex },
          { 'order.orderNo': searchRegex },
          { 'user.name': searchRegex },
        ]
      }
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const transactions = await OnlineTransaction.aggregate(pipeline);
  return transactions;
};
