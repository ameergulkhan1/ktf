// src/services/admin/adminSettingsService.js
import api from '../../api/adminApi';

const API_URL = '/admin/settings';

export const adminSettingsService = {
  getSettings: async (group) => {
    const response = await api.get(API_URL, { params: { group } });
    return response.data;
  },
  updateSettings: async (data) => {
    const response = await api.put(API_URL, data);
    return response.data;
  },
  getPlatformSettings: async () => {
    const response = await api.get(API_URL + '/platform');
    return response.data;
  },
  updatePlatformSettings: async (data) => {
    const response = await api.put(API_URL + '/platform', data);
    return response.data;
  },
  getPaymentSettings: async () => {
    const response = await api.get(API_URL + '/payment');
    return response.data;
  },
  updatePaymentSettings: async (data) => {
    const response = await api.put(API_URL + '/payment', data);
    return response.data;
  },
  getEmailSettings: async () => {
    const response = await api.get(API_URL + '/email');
    return response.data;
  },
  updateEmailSettings: async (data) => {
    const response = await api.put(API_URL + '/email', data);
    return response.data;
  },
  getNotificationSettings: async () => {
    const response = await api.get(API_URL + '/notifications');
    return response.data;
  },
  updateNotificationSettings: async (data) => {
    const response = await api.put(API_URL + '/notifications', data);
    return response.data;
  }
};