// src/api/wishlistApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/api/wishlist';

export const wishlistApi = {
  // Get wishlist
  get: async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  // Add to wishlist
  add: async (productId) => {
    const response = await axiosInstance.post(`${API_URL}/add`, { productId });
    return response.data;
  },

  // Remove from wishlist
  remove: async (productId) => {
    const response = await axiosInstance.delete(`${API_URL}/remove/${productId}`);
    return response.data;
  },

  // Check if in wishlist
  check: async (productId) => {
    const response = await axiosInstance.get(`${API_URL}/check/${productId}`);
    return response.data;
  }
};