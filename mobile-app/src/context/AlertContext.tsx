import React, { createContext, useContext, useState, useCallback } from 'react';
import AppAlert from '../components/common/Alert';

type AlertOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  onConfirm?: () => void;
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

let alertRef: (options: AlertOptions) => void = () => {
  console.warn('AlertProvider is not initialized');
};

export const globalAlert = {
  show: (options: AlertOptions) => alertRef(options),
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  alertRef = showAlert;

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AppAlert
        visible={visible}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        onClose={hideAlert}
        onConfirm={options.onConfirm}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
