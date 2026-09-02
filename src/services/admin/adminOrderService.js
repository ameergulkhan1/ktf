// src/services/admin/adminOrderService.js
import api from '../../api/adminApi';

const API_URL = '/admin/orders';

export const adminOrderService = {
  getAll: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },
  getById: async (orderId) => {
    const response = await api.get(API_URL + '/' + orderId);
    return response.data;
  },
  updateStatus: async (orderId, status, notes) => {
    const response = await api.put(API_URL + '/' + orderId + '/status', { status, notes });
    return response.data;
  },
  cancel: async (orderId, reason) => {
    const response = await api.put(API_URL + '/' + orderId + '/cancel', { reason });
    return response.data;
  },
  refund: async (orderId, amount, reason) => {
    const response = await api.post(API_URL + '/' + orderId + '/refund', { amount, reason });
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  },
  export: async (params) => {
    const response = await api.get(API_URL + '/export', { params });
    return response.data;
  },
  getTimeline: async (orderId) => {
    const response = await api.get(API_URL + '/' + orderId + '/timeline');
    return response.data;
  }
};