export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    OTP_VERIFICATION: '/auth/otp-verification',
  },

  USERS: {
    PROFILE: '/users/profile',
  },

  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  PAYMENTS: {
    INIT: '/payments/init',
    VERIFY: '/payments/verify',
  },

  RESERVATIONS: {
    CREATE: '/reservations',
    GET_ALL: '/reservations',
    GET_BY_ID: (id: string) => `/reservations/${id}`,
  },
} as const;