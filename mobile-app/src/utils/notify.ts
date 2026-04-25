import Toast from 'react-native-toast-message';
import { globalAlert } from '../context/AlertContext';

export const notify = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 5000,
      autoHide: true,
      topOffset: 60,
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  },

  alert: (title: string, message: string, onConfirm?: () => void) => {
    globalAlert.show({
      title,
      message,
      onConfirm
    });
  },

  confirm: (title: string, message: string, onConfirm: () => void, confirmText = 'Confirm') => {
    globalAlert.show({
      title,
      message,
      confirmText,
      onConfirm
    });
  }
};

export default notify;
