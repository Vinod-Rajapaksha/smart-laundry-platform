import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const initializeSocket = (userId: string, role: string) => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Web Socket Connected:', socket?.id);
      socket?.emit('join_user_room', userId);

      if (role === 'ADMIN') {
        socket?.emit('join_user_room', 'admin');
      }
    });

    socket.on('disconnect', () => {
      console.log('Web Socket Disconnected');
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
