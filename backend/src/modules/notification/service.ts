import Notification from '../../database/models/Notification.js';

export const createNotification = async (userId: string, data: { title: string; message: string; type?: string; data?: any }) => {
  return Notification.create({
    userId,
    ...data,
  });
};

export const getMyNotifications = async (userId: string) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
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
