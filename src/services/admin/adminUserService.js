// src/services/admin/adminUserService.js
import api from '../../api/adminApi';

// ✅ Include /api/admin in the URL path
const API_URL = '/admin/users';

export const adminUserService = {
  getUsers: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },
  getUserById: async (userId) => {
    const response = await api.get(API_URL + '/' + userId);
    return response.data;
  },
  updateUser: async (userId, data) => {
    const response = await api.put(API_URL + '/' + userId, data);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(API_URL + '/' + userId);
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  },
  bulkUpdate: async (data) => {
    const response = await api.post(API_URL + '/bulk-update', data);
    return response.data;
  },
  exportUsers: async (params) => {
    const response = await api.get(API_URL + '/export', { params });
    return response.data;
  }
};