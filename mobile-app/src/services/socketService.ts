import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

    socket = io(BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Mobile Socket Connected:', socket?.id);
      socket?.emit('join_user_room', userId);
    });

    socket.on('disconnect', () => {
      console.log('Mobile Socket Disconnected');
    });
  }
};

export const subscribeToOrderStatus = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('orderStatusUpdated', callback);
  }
};

export const unsubscribeFromOrderStatus = () => {
  if (socket) {
    socket.off('orderStatusUpdated');
  }
};

export const emitStaffLocation = (orderId: string, location: { lat: number, lng: number }) => {
  if (socket) {
    socket.emit('staff_location_update', { orderId, location });
  }
};

export const subscribeToStaffLocation = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('staff_location_update', callback);
  }
};

export const unsubscribeFromStaffLocation = () => {
  if (socket) {
    socket.off('staff_location_update');
  }
};

export const subscribeToNotifications = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('notification', callback);
  }
};

export const unsubscribeFromNotifications = () => {
  if (socket) {
    socket.off('notification');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
