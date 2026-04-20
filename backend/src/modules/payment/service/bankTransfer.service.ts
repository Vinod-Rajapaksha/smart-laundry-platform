import mongoose from 'mongoose';
import BankTransfer from '../../../database/models/BankTransfer.js';
import Order from '../../../database/models/Order.js';
import Payment from '../../../database/models/Payment.js';
import ApiError from '../../../core/apiError.js';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';
import { processSlipOCR } from '../../../utils/ocrService.js';
import { PAYMENT_METHODS } from '../../../core/constants.js';

export const getFilteredTransfers = async (status?: string, search?: string) => {
  const pipeline: any[] = [];

  // Match status if provided
  if (status && status !== 'All Transactions') {
    pipeline.push({ 
      $match: { verifyStatus: status.toUpperCase() } 
    });
  }

  // Lookup User
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'userId'
    }
  });
  pipeline.push({ $unwind: '$userId' });

  // Lookup Payment
  pipeline.push({
    $lookup: {
      from: 'payments',
      localField: 'paymentId',
      foreignField: '_id',
      as: 'paymentId'
    }
  });
  pipeline.push({ $unwind: '$paymentId' });

  // Lookup Order
  pipeline.push({
    $lookup: {
      from: 'orders',
      localField: 'paymentId.orderId',
      foreignField: '_id',
      as: 'paymentId.orderId'
    }
  });
  pipeline.push({ $unwind: '$paymentId.orderId' });

  // Match Search if provided
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { systemRefId: searchRegex },
          { referenceNo: searchRegex },
          { bankName: searchRegex },
          { 'paymentId.orderId.orderNo': searchRegex },
          { 'userId.firstName': searchRegex },
          { 'userId.lastName': searchRegex },
          { 'userId.email': searchRegex },
        ]
      }
    });
  }

  // Sort and execute
  pipeline.push({ $sort: { createdAt: -1 } });

  const validResults = await BankTransfer.aggregate(pipeline);
    
  console.log(`Bank Verification Results: ${validResults.length} records found`);
  return validResults;
};

export const submitBankTransfer = async (
  userId: string,
  orderId: string,
  bankName: string,
  referenceNo: string,
  slipFile: Express.Multer.File
) => {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNo: orderId });
  }

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const payment = await Payment.findOne({
    orderId: order._id,
    method: PAYMENT_METHODS.BANK_TRANSFER,
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not initiated for this order');
  }

  const slipImageUrl = await uploadToCloudinary(slipFile.buffer, 'bank_transfers');

  const bankTransfer = await BankTransfer.create({
    paymentId: payment._id,
    userId,
    bankName,
    referenceNo,
    slipImageUrl,
    systemRefId: String(payment.transactionRef || ''),
    ocrStatus: 'PENDING',
  });

  try {
    const ocrResult = await processSlipOCR(slipFile.buffer, bankTransfer.systemRefId);
    bankTransfer.ocrText = ocrResult.text;
    bankTransfer.ocrConfidence = ocrResult.confidence;
    bankTransfer.ocrStatus = ocrResult.isMatch ? 'MATCHED' : 'MISMATCHED';
    await bankTransfer.save();
  } catch (err) {
    bankTransfer.ocrStatus = 'FAILED';
    await bankTransfer.save();
  }

  order.paymentMethod = 'BANK_TRANSFER';
  order.paymentStatus = 'PENDING';
  await order.save();

  return bankTransfer;
};

export const verifyTransfer = async (
  transferId: string,
  adminId: string,
  status: 'APPROVED' | 'REJECTED',
  isSuspicious: boolean,
  internalNotes?: string,
  rejectReason?: string
) => {
  const transfer = await BankTransfer.findById(transferId).populate('paymentId');
  if (!transfer) {
    throw new ApiError(404, 'Transfer record not found');
  }

  transfer.verifyStatus = status;
  transfer.verifiedBy = adminId as any;
  transfer.verifiedAt = new Date();
  transfer.isSuspicious = isSuspicious;
  if (internalNotes) transfer.internalNotes = internalNotes;
  if (rejectReason) transfer.rejectReason = rejectReason;

  await transfer.save();

  const payment = await Payment.findById(transfer.paymentId);
  if (payment) {
    payment.status = status === 'APPROVED' ? 'PAID' : 'FAILED';
    if (status === 'APPROVED') payment.paidAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = status === 'APPROVED' ? 'PAID' : 'FAILED';
      if (status === 'APPROVED' && order.status === 'PENDING') {
        order.status = 'CONFIRMED';
      }
      await order.save();
    }
  }

  return transfer;
};
