import api from '../api';

export interface ScanResult {
  orderId: string;
  status: string;
  customerName: string;
  serviceMode: string;
  totalPrice: number;
}

export const scanService = {
  validateQrCode: async (qrData: string): Promise<ScanResult> => {
    // In our implementation, qrData might just be the orderId itself, 
    // or a JSON string like {"type":"ORDER","id":"12345"}
    let orderId = qrData;
    
    // Attempt parsing if it's JSON
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.id) orderId = parsed.id;
    } catch(e) {
      // It's a plain string ID
    }

    const response = await api.get(`/orders/${orderId}`);
    if (response.data.success) {
      const order = response.data.data;
      return {
        orderId: order._id,
        status: order.status,
        customerName: order.customer?.name || 'Customer',
        serviceMode: order.serviceMode,
        totalPrice: order.totalPrice
      };
    }
    throw new Error(response.data.message || 'Invalid QR Code');
  },

  updateOrderStatus: async (orderId: string, status: string, imageUri?: string): Promise<any> => {
    // If we have an imageUri, in a production app we'd upload it to AWS S3/Firebase Storage,
    // and pass the URL to the backend. For now, we simulate image attachment.
    const payload: any = { status };
    if (imageUri) {
      payload.attachmentUrl = imageUri; // The backend order schema would need to support this
    }

    const response = await api.patch(`/orders/${orderId}/status`, payload);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update order status');
  }
};

export default scanService;
