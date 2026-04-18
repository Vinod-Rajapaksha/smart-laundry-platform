import api from '../api';

export interface ScanResult {
  orderId: string;
  orderNo: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceMode: string;
  totalAmount: number;
  itemsCount: number;
  pickupSlot: string;
  deliverySlot: string;
  paymentMethod: string;
  paymentStatus: string;
}

export const scanService = {
  validateQrCode: async (qrData: string): Promise<ScanResult> => {
    let orderId = qrData;
    
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.id) orderId = parsed.id;
    } catch(e) {}

    const response = await api.get(`/orders/${orderId}`);
    if (response.data.success) {
      const order = response.data.data;
      return {
        orderId: order._id,
        orderNo: order.orderNo,
        status: order.status,
        customerName: order.userId?.name || 'Customer',
        customerPhone: order.userId?.telephone || 'N/A',
        customerAddress: order.status === 'READY_FOR_PICKUP' || order.status === 'PENDING' 
          ? order.pickupAddress 
          : order.deliveryAddress,
        serviceMode: order.serviceId?.name || 'Standard',
        totalAmount: order.totalAmount || 0,
        itemsCount: order.options?.length || 0,
        pickupSlot: order.reservedDateTime ? new Date(order.reservedDateTime).toLocaleString() : 'N/A',
        deliverySlot: order.reservedDateTime ? 'Scheduled' : 'N/A',
        paymentMethod: order.paymentMethod || 'CASH',
        paymentStatus: order.paymentStatus || 'PENDING'
      };
    }
    throw new Error(response.data.message || 'Invalid QR Code');
  },

  updateOrderStatus: async (orderId: string, status: string, imageUri?: string): Promise<any> => {
    const payload: any = { status };
    if (imageUri) {
      payload.attachmentUrl = imageUri; 
    }

    const response = await api.patch(`/orders/${orderId}/status`, payload);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update order status');
  },

  decodeQrFromImage: async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    
    // Preparation for React Native file upload
    const filename = imageUri.split('/').pop() || 'scan.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await api.post('/scan/decode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.data;
    }
    throw new Error(response.data.message || 'No QR code found');
  }
};

export default scanService;
