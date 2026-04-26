import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import logger from '../config/logger.js';

const expo = new Expo();

export const sendPushNotification = async (pushToken: string, title: string, body: string, data?: any) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    logger.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages: ExpoPushMessage[] = [{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high',
  }];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    logger.debug('Push notification tickets:', tickets);
    return tickets;
  } catch (error) {
    logger.error('Error sending push notification:', error);
  }
};

export default expo;
