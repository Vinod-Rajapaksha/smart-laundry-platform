import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAppSelector } from '../../src/store/hooks';
import { initializeSocket, disconnectSocket } from '../../src/services/socketService';

export default function ProtectedLayout() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(public)/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initializeSocket(user.id);
    } else if (isAuthenticated && user?._id) {
      initializeSocket(user._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  return <Slot />;
}
