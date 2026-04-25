import { Request, Response } from 'express';
import { AuthRequest } from '../../../types/auth.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { generatePayHereHash, chargeSavedCard } from '../service/payhere.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';
import env from '../../../config/env.js';
import Order from '../../../database/models/Order.js';
import Payment from '../../../database/models/Payment.js';
import OnlineTransaction from '../../../database/models/OnlineTransaction.js';
import SavedCard from '../../../database/models/SavedCard.js';
import User from '../../../database/models/User.js';
import ApiError from '../../../core/apiError.js';
import { createNotification } from '../../notification/service.js';
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

  const amount = 30.00;
  const currency = 'LKR';
  const hash = generatePayHereHash(orderNo, amount, currency);

  const [firstName, ...rest] = user.name.split(' ');
  const lastName = rest.join(' ') || 'User';

  return ApiResponse(res, 200, 'Pre-approval hash generated successfully', {
    hash,
    merchantId: env.PAYHERE_MERCHANT_ID,
    amount: "30.00",
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
    order.paidAt = new Date();
    await order.save();

    const payment = await Payment.create({
      orderId: order._id,
      userId: order.userId,
      amount: order.totalAmount,
      method: 'CARD',
      status: 'PAID',
      provider: 'PAYHERE_SAVED_CARD',
      transactionRef: result.payment_id || 'SAVED_CARD_' + Date.now(),
      paidAt: new Date(),
    });

    await OnlineTransaction.create({
      paymentId: payment._id,
      orderId: order._id,
      userId: order.userId,
      gatewayOrderId: order.orderNo,
      gatewayPaymentId: result.payment_id || 'N/A',
      status: 'PAID',
      rawResponse: result
    });

    try {
      await createNotification(order.userId.toString(), {
        title: 'Payment Successful',
        message: `Your card payment for order ${order.orderNo} was successful.`,
        type: 'PAYMENT',
        data: { orderId: order._id, status: 'PAID' }
      });
    } catch (e) {
      console.error('Failed to send payment notification:', e);
    }

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

  // Find Payment by transactionRef
  const payment = await Payment.findOne({ transactionRef: order_id });
  if (!payment) {
    console.error(`Payment not found for reference: ${order_id}`);
    return res.status(200).send('OK');
  }

  const order = await Order.findById(payment.orderId);
  if (!order) {
    console.error(`Order not found for payment: ${order_id}`);
    return res.status(200).send('OK');
  }

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
        order.paidAt = new Date();
        await order.save();

        const updatedPayment = await Payment.findOneAndUpdate(
          { orderId: order._id, transactionRef: order_id },
          { $set: { status: 'PAID', paidAt: new Date() } },
          { new: true }
        );

        if (updatedPayment) {
          await OnlineTransaction.create({
            paymentId: updatedPayment._id,
            orderId: order._id,
            userId: order.userId,
            gatewayOrderId: order_id,
            gatewayPaymentId: chargeResult.payment_id || 'AUTO_CHARGE_' + Date.now(),
            status: 'PAID',
            rawResponse: chargeResult
          });
        }

        // Award points
        try {
          const { awardLoyaltyPoints } = await import('../../loyalty/loyalty.service.js');
          await awardLoyaltyPoints(order.userId.toString(), 10, order._id.toString());
        } catch (e) {
          console.error('Failed to award points on auto-charge:', e);
        }
      }
    }
  }

  // SUCCESS PAYMENT
  if (status_code == 2 && order.paymentStatus !== 'PAID') {
    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';
    order.paidAt = new Date();
    await order.save();

    await Payment.findOneAndUpdate(
      { orderId: order._id, transactionRef: order_id },
      { $set: { status: 'PAID', paidAt: new Date() } }
    );

    await OnlineTransaction.create({
      paymentId: payment._id,
      orderId: order._id,
      userId: order.userId,
      gatewayOrderId: order_id,
      gatewayPaymentId: req.body.payment_id || 'N/A',
      status: 'PAID',
      rawResponse: req.body
    });

    // Award loyalty points
    try {
      const { awardLoyaltyPoints } = await import('../../loyalty/loyalty.service.js');
      await awardLoyaltyPoints(order.userId.toString(), 10, order._id.toString());
    } catch (e) {
      console.error('Failed to award loyalty points:', e);
    }

    await createNotification(order.userId.toString(), {
      title: 'Payment Successful',
      message: `Your card payment for order ${order.orderNo} was successful.`,
      type: 'PAYMENT',
      data: { orderId: order._id, status: 'PAID' }
    });
  }

  return res.status(200).send('OK');
});