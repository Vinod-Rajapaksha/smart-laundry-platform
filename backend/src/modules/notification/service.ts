import Notification from '../../database/models/Notification.js';
import User from '../../database/models/User.js';
import { getIO } from '../../core/socket.js';
import { sendPushNotification } from '../../core/expo.js';
import logger from '../../config/logger.js';
import { NotificationType } from '../../core/constants.js';

export const createNotification = async (userId: string, data: { title: string; message: string; type?: NotificationType; data?: any }) => {
  try {
    const notification = await Notification.create({
      userId,
      ...data,
    });

    try {
      const io = getIO();
      io.to(`user_${userId}`).emit('notification', notification);
    } catch (socketError) {
      logger.error('Failed to emit socket notification:', socketError);
    }

    const user = await User.findById(userId).select('pushToken');
    if (user?.pushToken) {
      await sendPushNotification(user.pushToken, data.title, data.message, data.data);
    }

    return notification;
  } catch (error) {
    logger.error('Error in createNotification service:', error);
    throw error;
  }
};

export const getMyNotifications = async (userId: string) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId: string) => {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  return Notification.findOneAndDelete({ _id: notificationId, userId });
};

export const updatePushToken = async (userId: string, token: string) => {
  return User.findByIdAndUpdate(userId, { pushToken: token });
};

