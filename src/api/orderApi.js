// src/api/orderApi.js
import axiosInstance from './axiosConfig';

// ✅ Use /orders without /api prefix
const API_URL = '/orders';

export const orderApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await axiosInstance.post(API_URL, orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await axiosInstance.put(`${API_URL}/${id}/cancel`, { reason });
    return response.data;
  },

  track: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}/track`);
    return response.data;
  },

  getTimeline: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}/timeline`);
    return response.data;
  },

  getVendorOrders: async (params = {}) => {
    const response = await axiosInstance.get(`${API_URL}/vendor`, { params });
    return response.data;
  },

  getCustomerOrders: async (params = {}) => {
    const response = await axiosInstance.get(`${API_URL}/customer`, { params });
    return response.data;
  }
};