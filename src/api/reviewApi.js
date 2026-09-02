// src/api/reviewApi.js
import axiosInstance from './axiosConfig';

// ✅ Remove /api from URL - just use /reviews
const API_URL = '/reviews';  // Changed from '/reviews' (already correct)

export const reviewApi = {
  // Create review
  create: async (reviewData) => {
    const response = await axiosInstance.post(API_URL, reviewData);
    return response.data;
  },

  // Get reviews by product
  getByProduct: async (productId, params = {}) => {
    const response = await axiosInstance.get(`${API_URL}/product/${productId}`, { params });
    return response.data;
  },

  // Get user's own reviews
  getUserReviews: async (params = {}) => {
    const response = await axiosInstance.get(`${API_URL}/user`, { params });
    return response.data;
  },

  // Update review
  update: async (id, reviewData) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  },
};