import api from '../api';

export const voucherService = {
  /**
   * Validates a voucher code for the current order
   */
  validateVoucher: async (code: string, amount: number) => {
    const response = await api.post(`/promotions/validate`, { 
      code, 
      orderAmount: amount 
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Invalid or expired voucher code');
  },

  /**
   * Fetches all available vouchers for the user
   */
  getAvailableVouchers: async () => {
    const response = await api.get(`/promotions`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch vouchers');
  },

  /**
   * Applies a voucher to an existing order
   */
  applyVoucherToOrder: async (orderId: string, voucherCode: string) => {
    const response = await api.post(`/promotions/apply`, { orderId, voucherCode });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to apply voucher to order');
  }
};

export default voucherService;
