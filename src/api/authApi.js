// src/api/authApi.js
import axiosInstance from './axiosConfig';

export const authApi = {
  // User login - POST /api/auth/login
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      return response.data; // ✅ Return the data directly
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // Admin login - POST /api/admin/login
  adminLogin: async (email, password) => {
    try {
      const response = await axiosInstance.post('/admin/login', { email, password });
      console.log('✅ Admin login response:', response.data);
      return response.data; // ✅ Return the data directly
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  },

  // Register - POST /api/auth/register
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },

  // Logout - POST /api/auth/logout
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  // Get profile - GET /api/auth/profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  // Refresh token - POST /api/auth/refresh-token
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      throw error;
    }
  },
};