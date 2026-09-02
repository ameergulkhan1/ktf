// src/services/admin/adminProductService.js
import api from '../../api/adminApi';

const API_URL = '/admin/products';

export const adminProductService = {
  getAll: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },
  getById: async (productId) => {
    const response = await api.get(API_URL + '/' + productId);
    return response.data;
  },
  approve: async (productId, notes) => {
    const response = await api.put(API_URL + '/' + productId + '/approve', { notes });
    return response.data;
  },
  reject: async (productId, reason) => {
    const response = await api.put(API_URL + '/' + productId + '/reject', { reason });
    return response.data;
  },
  update: async (productId, data) => {
    const response = await api.put(API_URL + '/' + productId, data);
    return response.data;
  },
  delete: async (productId) => {
    const response = await api.delete(API_URL + '/' + productId);
    return response.data;
  },
  bulkApprove: async (productIds) => {
    const response = await api.post(API_URL + '/bulk-approve', { productIds });
    return response.data;
  },
  bulkDelete: async (productIds) => {
    const response = await api.post(API_URL + '/bulk-delete', { productIds });
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  }
};