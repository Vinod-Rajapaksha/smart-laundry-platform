import axiosInstance from '../../lib/axios';

export const getAvailablePickups = async () => {
  const response = await axiosInstance.get('/orders/available-pickups');
  return response.data.data;
};

export const getAvailableDeliveries = async () => {
  const response = await axiosInstance.get('/orders/available-deliveries');
  return response.data.data;
};

export const assignJob = async (
  orderId: string,
  jobType: 'PICKUP' | 'DELIVERY'
) => {
  const response = await axiosInstance.post(`/orders/${orderId}/assign`, {
    jobType,
  });
  return response.data.data;
};

export const getMyJobs = async () => {
  const response = await axiosInstance.get('/orders/my-jobs');
  return response.data.data;
};

export const updateJobStatus = async (
  orderId: string,
  status: string
) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
    status,
  });
  return response.data.data;
};

export const updateLocation = async (
  orderId: string,
  latitude: number,
  longitude: number
) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/location`, {
    latitude,
    longitude,
  });
  return response.data.data;
};