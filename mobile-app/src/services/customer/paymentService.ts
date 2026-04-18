import api from '../api';

export const paymentService = {
  initCardPayment: async (orderId: string) => {
    const response = await api.post(`/payments/card/init/${orderId}`);
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to initialize card payment');
  },

  initBankTransfer: async (orderId: string) => {
    const response = await api.post(`/payments/bank/init/${orderId}`);
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to initialize bank transfer');
  },

  initCOD: async (orderId: string) => {
    const response = await api.post(`/payments/cod/init/${orderId}`);
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to initialize COD');
  },

  getPaymentStatus: async (orderId: string) => {
    const response = await api.get(`/payments/status/${orderId}`);
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to check payment status');
  },

  getSavedCards: async () => {
    const response = await api.get('/payments/cards');
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to fetch saved cards');
  },

  chargeSavedCard: async (orderId: string, cardId: string) => {
    const response = await api.post('/payments/online/payhere/charge-saved-card', {
      orderId,
      cardId
    });
    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to charge saved card');
  }
};

export default paymentService;
