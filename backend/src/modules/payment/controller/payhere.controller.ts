import { Request, Response } from 'express';
import { AuthRequest } from '../../../types/auth.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { generatePayHereHash, chargeSavedCard } from '../service/payhere.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';
import env from '../../../config/env.js';
import Order from '../../../database/models/Order.js';
import SavedCard from '../../../database/models/SavedCard.js';
import User from '../../../database/models/User.js';
import ApiError from '../../../core/apiError.js';
import crypto from 'crypto';

//  GET HASH (NORMAL PAYMENT)
export const getPayHereHashHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orderNo = String(req.params.orderId);

  const order = await Order.findOne({ orderNo });
  if (!order) throw new ApiError(404, 'Order not found');

  const hash = generatePayHereHash(orderNo, order.totalAmount, 'LKR');

  return ApiResponse(res, 200, 'Hash generated successfully', {
    hash,
    merchantId: env.PAYHERE_MERCHANT_ID,
    appId: env.PAYHERE_APP_ID,
    amount: order.totalAmount.toFixed(2),
    currency: 'LKR',
  });
});

// PRE-APPROVAL (SAVE CARD)
export const getPayHerePreApprovalHashHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orderNo = String(req.params.orderId);
  const authUser = req.user;

  if (!authUser) throw new ApiError(401, 'Unauthorized');

  const user = await User.findById(authUser.id);
  if (!user) throw new ApiError(404, 'User not found');

  const amount = 1.00;
  const currency = 'LKR';
  const hash = generatePayHereHash(orderNo, amount, currency);

  const [firstName, ...rest] = user.name.split(' ');
  const lastName = rest.join(' ') || 'User';

  return ApiResponse(res, 200, 'Pre-approval hash generated successfully', {
    hash,
    merchantId: env.PAYHERE_MERCHANT_ID,
    amount: "1.00",
    currency: "LKR",
    orderId: orderNo,
    customer: {
      firstName: firstName,
      lastName,
      email: user.email,
      phone: user.telephone,
    }
  });
});

//  CHARGE SAVED CARD
export const chargeSavedCardHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId, cardId } = req.body;
  const userId = req.user?.id;

  if (!orderId || !cardId) {
    throw new ApiError(400, 'OrderId and cardId are required');
  }

  const orderNo = String(orderId);
  const order = await Order.findOne({ orderNo });
  if (!order) throw new ApiError(404, 'Order not found');

  const card = await SavedCard.findOne({ _id: cardId, userId });
  if (!card) throw new ApiError(404, 'Saved card not found or unauthorized');

  const result = await chargeSavedCard(
    card.cardToken,
    order.totalAmount,
    order.orderNo
  );

  if (result.status === 1) {
    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';
    await order.save();

    return ApiResponse(res, 200, 'Payment successful via saved card', result);
  }

  return ApiResponse(res, 400, result.msg || 'Payment failed', result);
});

// PAYHERE NOTIFY
export const payhereNotifyHandler = asyncHandler(async (req: Request, res: Response) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    customer_token,
    card_masked
  } = req.body;

  // Signature verification
  const secret = env.PAYHERE_SECRET || '';
  const hashedSecret = crypto.createHash('md5').update(secret).digest('hex').toUpperCase();

  const localSignature = crypto.createHash('md5')
    .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
    .digest('hex')
    .toUpperCase();

  if (localSignature !== md5sig) {
    console.error(`Invalid signature for order ${order_id}`);
    return res.status(400).send('Invalid signature');
  }

  const order = await Order.findOne({ orderNo: order_id });
  if (!order) return res.status(200).send('OK');

  // SAVE CARD
  if (customer_token) {
    const brand = card_masked?.startsWith('4') ? 'Visa' : 'Mastercard';

    await SavedCard.findOneAndUpdate(
      { cardToken: customer_token },
      {
        userId: order.userId,
        cardToken: customer_token,
        last4: card_masked?.slice(-4) || 'XXXX',
        brand,
        expiryMonth: 12,
        expiryYear: 2030,
        provider: 'PayHere',
        isDefault: true
      },
      { upsert: true, new: true }
    );

    // Auto charge after save
    if (order.paymentStatus === 'PENDING') {
      const chargeResult = await chargeSavedCard(customer_token, order.totalAmount, order.orderNo);

      if (chargeResult.status === 1) {
        order.paymentStatus = 'PAID';
        order.status = 'PROCESSING';
        await order.save();
      }
    }
  }

  // SUCCESS PAYMENT
  if (status_code == 2 && order.paymentStatus !== 'PAID') {
    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';
    await order.save();
  }

  return res.status(200).send('OK');
});