import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

/**
 * Global utility for showing premium notifications, toasts and alerts.
 */
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

  /**
   * Premium Alert Dialog
   */
  alert: (title: string, message: string, onConfirm?: () => void) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  },

  confirm: (title: string, message: string, onConfirm: () => void, confirmText = 'Confirm') => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: confirmText,
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
      { cancelable: false }
    );
  }
};

export default notify;
