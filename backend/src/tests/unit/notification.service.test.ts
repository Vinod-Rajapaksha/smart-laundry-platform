import { jest } from '@jest/globals';
import * as notificationService from '../../modules/notification/service.js';
import * as expoModule from '../../core/expo.js';
import Notification from '../../database/models/Notification.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

jest.mock('../../core/socket.js', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn(() => ({
      emit: jest.fn()
    }))
  }))
}));

jest.mock('../../core/expo.js', () => ({
  sendPushNotification: jest.fn(() => Promise.resolve()),
}));

describe('Notification Service', () => {
  let userId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: 'User',
      email: 'u@example.com',
      password: 'password123',
      telephone: '0771234567',
      pushToken: 'expo-token'
    });

    userId = user._id.toString();
  });

  describe('createNotification', () => {
    it('should create notification and trigger push notification', async () => {
      const data = { title: 'Test', message: 'Msg', type: 'SYSTEM' as any };

      const notification = await notificationService.createNotification(userId, data);

      expect(notification.title).toBe('Test');

      expect(jest.mocked(expoModule.sendPushNotification)).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should update notification read status', async () => {
      const n = await Notification.create({ userId, title: 'T', message: 'M' });

      const updated = await notificationService.markAsRead(n._id.toString(), userId);

      expect(updated?.isRead).toBe(true);
    });
  });
});