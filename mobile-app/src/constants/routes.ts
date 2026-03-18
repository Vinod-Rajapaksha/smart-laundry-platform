export const ROUTES = {
  // Root
  INDEX: '/',
  NOT_FOUND: '*',

  // Public
  ONBOARDING: '/(public)/onboarding',

  AUTH_LOGIN: '/(public)/auth/login',
  AUTH_REGISTER: '/(public)/auth/register',
  AUTH_FORGOT_PASSWORD: '/(public)/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/(public)/auth/reset-password',
  AUTH_OTP_VERIFICATION: '/(public)/auth/otp-verification',

  // Customer tabs
  CUSTOMER_HOME: '/(protected)/(customer)/(tabs)/home',
  CUSTOMER_ORDERS: '/(protected)/(customer)/(tabs)/orders',
  CUSTOMER_PROFILE: '/(protected)/(customer)/(tabs)/profile',
  CUSTOMER_WALLET: '/(protected)/(customer)/(tabs)/wallet',

  // Customer extra screens
  CUSTOMER_NOTIFICATIONS: '/(protected)/(customer)/notifications',
  CUSTOMER_ORDER_DETAILS: '/(protected)/(customer)/orders',
  CUSTOMER_PROFILE_DETAILS: '/(protected)/(customer)/profile',
  CUSTOMER_RESERVATION: '/(protected)/(customer)/reservation',
  CUSTOMER_VOUCHERS: '/(protected)/(customer)/vouchers',
  CUSTOMER_WALLET_DETAILS: '/(protected)/(customer)/wallet',

  // Customer checkout
  CUSTOMER_CHECKOUT: '/(protected)/(customer)/checkout',
  CUSTOMER_CHECKOUT_BANK_TRANSFER: '/(protected)/(customer)/checkout/bank-transfer',
  CUSTOMER_CHECKOUT_CARD_PAYMENT: '/(protected)/(customer)/checkout/card-payment',
  CUSTOMER_CHECKOUT_CASH_ON_DELIVERY: '/(protected)/(customer)/checkout/cash-on-delivery',

  // Staff tabs
  STAFF_HOME: '/(protected)/(staff)/(tabs)/home',
  STAFF_ORDERS: '/(protected)/(staff)/(tabs)/orders',
  STAFF_PROFILE: '/(protected)/(staff)/(tabs)/profile',
  STAFF_SCAN: '/(protected)/(staff)/(tabs)/scan',

  // Staff extra screens
  STAFF_NOTIFICATIONS: '/(protected)/(staff)/notifications',
  STAFF_ORDER_DETAILS: '/(protected)/(staff)/orders',
  STAFF_PROFILE_DETAILS: '/(protected)/(staff)/profile',
  STAFF_SCAN_DETAILS: '/(protected)/(staff)/scan',
} as const;