// src/api/userApi.js
import axiosInstance from './axiosConfig';

// ✅ Remove /api from URL - just use /users
const API_URL = '/users';  // Changed from '/users' (already correct)

export const userApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(API_URL + '/' + id);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(API_URL + '/' + id, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(API_URL + '/' + id);
    return response.data;
  },
};