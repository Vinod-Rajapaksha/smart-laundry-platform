import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  updatePushTokenOnServer,
  handleForegroundNotification,
  handleNotificationResponse
} from '../../services/notifications/notificationService';
import { subscribeToNotifications, unsubscribeFromNotifications } from '../../services/socketService';
import { addNotification } from '../../store/slices/customer/notification.slice';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const NotificationWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          updatePushTokenOnServer(token);
        }
      });

      const foregroundSubscription = Notifications.addNotificationReceivedListener(handleForegroundNotification);
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

      subscribeToNotifications((notification) => {
        dispatch(addNotification(notification));
        Toast.show({
          type: 'info',
          text1: notification.title,
          text2: notification.message,
          visibilityTime: 4000,
        });
      });

      return () => {
        foregroundSubscription.remove();
        responseSubscription.remove();
        unsubscribeFromNotifications();
      };
    }
  }, [user, dispatch]);

  return <>{children}</>;
};
