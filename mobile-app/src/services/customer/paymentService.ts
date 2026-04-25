import api from '../api';

export const paymentService = {
  initCardPayment: async (orderId: string, saveCard: boolean = false) => {
    const response = await api.post(`/payments/card/init/${orderId}`, { saveCard });
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
  },

  submitBankTransfer: async (orderId: string, bankName: string, referenceNo: string, slipUri: string) => {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('bankName', bankName);
    formData.append('referenceNo', referenceNo);

    formData.append('slipFile', {
      uri: slipUri,
      type: 'image/jpeg',
      name: 'slip.jpg',
    } as any);

    const response = await api.post('/payments/bank/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) return response.data.data;
    throw new Error(response.data.message || 'Failed to submit bank transfer');
  }
};

export default paymentService;
