// src/api/paymentApi.js
import axiosInstance from './axiosConfig';

// ✅ Remove /api from URL - just use /payments
const API_URL = '/payments';  // Changed from '/payments' (already correct)

export const paymentApi = {
  // Create payment
  create: async (paymentData) => {
    const response = await axiosInstance.post(API_URL, paymentData);
    return response.data;
  },

  // Get payment by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Get payments by order
  getByOrder: async (orderId) => {
    const response = await axiosInstance.get(`${API_URL}/order/${orderId}`);
    return response.data;
  },

  // Refund payment
  refund: async (id) => {
    const response = await axiosInstance.post(`${API_URL}/${id}/refund`);
    return response.data;
  },
};