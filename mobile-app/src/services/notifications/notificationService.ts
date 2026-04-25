import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '../api';
import logger from '../../../utils/logger'; // Assuming logger exists or I'll create one

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.default.expoConfig?.extra?.eas?.projectId
    })).data;
    console.log('Push Token:', token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
};

export const updatePushTokenOnServer = async (token: string) => {
  try {
    await api.patch('/notifications/token', { token });
    console.log('Push token updated on server');
  } catch (error) {
    console.error('Failed to update push token on server:', error);
  }
};

export const handleForegroundNotification = (notification: Notifications.Notification) => {
  console.log('Foreground notification:', notification);
  // You can show a custom toast or update UI here
};

export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  console.log('Notification response:', response);
  // Handle navigation here (e.g., go to order details)
};
