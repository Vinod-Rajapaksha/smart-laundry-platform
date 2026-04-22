import { jest } from '@jest/globals';
import * as orderService from '../../modules/order/service.js';
import Order from '../../database/models/Order.js';
import Service from '../../database/models/Service.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

jest.mock('../../core/expo.js', () => ({
  sendPushNotification: jest.fn(() => Promise.resolve()),
  default: jest.fn()
}));

jest.mock('../../modules/notification/service.js', () => ({
  createNotification: jest.fn()
}));

describe('Order Service', () => {
  let userId: string;
  let serviceId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: 'Customer',
      email: 'c@example.com',
      password: 'password123',
      telephone: '0771234567'
    });
    userId = user._id.toString();

    const service = await Service.create({
      name: 'Wash & Fold',
      price: 150,
      categoryId: new mongoose.Types.ObjectId().toString()
    });
    serviceId = service._id.toString();
  });

  describe('createOrder', () => {
    it('should calculate total amount correctly without options', async () => {
      const input: any = {
        serviceId,
        weightKg: 2,
        paymentMethod: 'COD',
        deliveryFee: 50
      };

      const order = await orderService.createOrder(userId, input);

      expect(order.totalAmount).toBe(350);
      expect(order.status).toBe('ORDER_PLACED');
    });

    it('should throw 404 if service does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(orderService.createOrder(userId, { serviceId: fakeId, paymentMethod: 'COD' }))
        .rejects.toThrow('Service not found');
    });
  });

  describe('cancelOrder', () => {
    it('should allow cancellation for PLACED orders', async () => {
      const order = await Order.create({
        orderNo: 'ORD001',
        userId,
        serviceId,
        totalAmount: 100,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        status: 'ORDER_PLACED'
      });

      const cancelled = await orderService.cancelOrder(order._id.toString(), userId);
      expect(cancelled.status).toBe('CANCELLED');
    });

    it('should prevent cancellation for DELIVERED orders', async () => {
      const order = await Order.create({
        orderNo: 'ORD002',
        userId,
        serviceId,
        totalAmount: 100,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        status: 'DELIVERED'
      });

      await expect(orderService.cancelOrder(order._id.toString(), userId))
        .rejects.toThrow('Order cannot be cancelled at this stage');
    });
  });
});

import mongoose from 'mongoose';
