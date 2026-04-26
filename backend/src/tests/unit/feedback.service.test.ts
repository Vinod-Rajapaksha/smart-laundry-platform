import * as feedbackService from '../../modules/feedback/service.js';
import Feedback from '../../database/models/Feedback.js';
import Order from '../../database/models/Order.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Feedback Service', () => {
  let userId: string;
  let orderId: string;

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

    const order = await Order.create({
      orderNo: 'ORD123',
      userId,
      serviceId: new mongoose.Types.ObjectId().toString(),
      totalAmount: 100,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      status: 'DELIVERED'
    });
    orderId = order._id.toString();
  });

  describe('createFeedback', () => {
    it('should create feedback and update order isReviewed flag', async () => {
      const input = {
        orderId,
        rating: 5,
        comment: 'Great service!'
      };

      const feedback = await feedbackService.createFeedback(userId, input);
      expect(feedback.rating).toBe(5);
      expect(feedback.comment).toBe('Great service!');

      const updatedOrder = await Order.findById(orderId);
      expect(updatedOrder?.isReviewed).toBe(true);
    });

    it('should throw error if order is not delivered', async () => {
      const pendingOrder = await Order.create({
        orderNo: 'ORD456',
        userId,
        serviceId: new mongoose.Types.ObjectId().toString(),
        totalAmount: 100,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        status: 'ORDER_PLACED'
      });

      await expect(feedbackService.createFeedback(userId, { orderId: pendingOrder._id.toString(), rating: 5 }))
        .rejects.toThrow('Feedback can only be given for completed orders');
    });

    it('should throw error if feedback already exists for the order', async () => {
      await feedbackService.createFeedback(userId, { orderId, rating: 4 });
      await expect(feedbackService.createFeedback(userId, { orderId, rating: 5 }))
        .rejects.toThrow('Feedback has already been submitted for this order');
    });
  });

  describe('getFeedbackStats', () => {
    it('should calculate stats correctly', async () => {
      await Feedback.create({ orderId: new mongoose.Types.ObjectId().toString(), userId, rating: 5, status: 'approved' });
      await Feedback.create({ orderId: new mongoose.Types.ObjectId().toString(), userId, rating: 3, status: 'approved' });
      await Feedback.create({ orderId: new mongoose.Types.ObjectId().toString(), userId, rating: 1, status: 'pending' });

      const stats = await feedbackService.getFeedbackStats();
      expect(stats.totalReviews).toBe(3);
      expect(stats.averageRating).toBe(3); // (5+3+1)/3 = 3
      expect(stats.totalApproved).toBe(2);
      expect(stats.approvedAverageRating).toBe(4); // (5+3)/2 = 4
    });
  });
});

import mongoose from 'mongoose';
