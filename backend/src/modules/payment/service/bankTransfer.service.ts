import mongoose from 'mongoose';
import BankTransfer from '../../../database/models/BankTransfer.js';
import Order from '../../../database/models/Order.js';
import Payment from '../../../database/models/Payment.js';
import ApiError from '../../../core/apiError.js';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';
import { processSlipOCR } from '../../../utils/ocrService.js';
import {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  OCR_STATUS,
  BANK_VERIFICATION_STATUS
} from '../../../core/constants.js';

export const getFilteredTransfers = async (status?: string, search?: string, startDate?: string, endDate?: string) => {
  const pipeline: any[] = [];

  const matchQuery: any = {};

  if (status && status !== 'All Transactions') {
    matchQuery.verifyStatus = status.toUpperCase();
  }

  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchQuery.createdAt.$lte = end;
    }
  }

  if (Object.keys(matchQuery).length > 0) {
    pipeline.push({ $match: matchQuery });
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

  // Lookup Service in Order
  pipeline.push({
    $lookup: {
      from: 'services',
      localField: 'paymentId.orderId.serviceId',
      foreignField: '_id',
      as: 'paymentId.orderId.serviceId'
    }
  });
  pipeline.push({
    $unwind: {
      path: '$paymentId.orderId.serviceId',
      preserveNullAndEmptyArrays: true
    }
  });

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
          { 'userId.name': searchRegex },
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
  accountNo: string,
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
    orderId: order._id,
    userId,
    bankName,
    referenceNo,
    accountNo,
    slipImageUrl,
    systemRefId: String(payment.transactionRef || ''),
    ocrStatus: OCR_STATUS.PENDING,
  });

  try {
    const ocrResult = await processSlipOCR(slipFile.buffer, bankTransfer.systemRefId);
    bankTransfer.ocrText = ocrResult.text;
    bankTransfer.ocrConfidence = ocrResult.confidence;
    bankTransfer.ocrStatus = ocrResult.isMatch ? OCR_STATUS.MATCHED : OCR_STATUS.MISMATCHED;
    bankTransfer.extractedAmount = ocrResult.extractedAmount;
    bankTransfer.extractedDate = ocrResult.extractedDate;
    bankTransfer.extractedRef = ocrResult.extractedRef;
    bankTransfer.extractedBank = ocrResult.extractedBank;
    bankTransfer.extractedAccount = ocrResult.extractedAccount;
    await bankTransfer.save();
  } catch (err) {
    bankTransfer.ocrStatus = OCR_STATUS.FAILED;
    await bankTransfer.save();
  }

  order.paymentMethod = PAYMENT_METHODS.BANK_TRANSFER;
  order.paymentStatus = PAYMENT_STATUS.PENDING;
  order.paidAt = new Date();
  order.bankVerificationStatus = BANK_VERIFICATION_STATUS.PENDING;
  await order.save();

  payment.paidAt = new Date();
  await payment.save();

  return bankTransfer;
};

export const verifyTransfer = async (
  transferId: string,
  adminId: string,
  status: typeof BANK_VERIFICATION_STATUS.APPROVED | typeof BANK_VERIFICATION_STATUS.REJECTED,
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
    payment.status = status === BANK_VERIFICATION_STATUS.APPROVED ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED;
    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = status === BANK_VERIFICATION_STATUS.APPROVED ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED;
      order.bankVerificationStatus = status;
      await order.save();
    }
  }

  return transfer;
};
