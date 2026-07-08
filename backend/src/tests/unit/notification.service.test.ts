import { jest } from '@jest/globals';

jest.unstable_mockModule('../../core/socket.js', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn(() => ({
      emit: jest.fn()
    }))
  }))
}));

jest.unstable_mockModule('../../core/expo.js', () => ({
  sendPushNotification: jest.fn(() => Promise.resolve()),
}));

const notificationService = await import('../../modules/notification/service.js');
const expoModule = await import('../../core/expo.js');
const Notification = (await import('../../database/models/Notification.js')).default;
const User = (await import('../../database/models/User.js')).default;
const { connectTestDB, disconnectTestDB, clearTestDB } = await import('../testHelpers.js');

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