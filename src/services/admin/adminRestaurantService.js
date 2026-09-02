// src/services/admin/adminRestaurantService.js
import api from '../../api/adminApi';

const API_URL = '/admin/restaurants';

export const adminRestaurantService = {
  getAll: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },
  getById: async (restaurantId) => {
    const response = await api.get(API_URL + '/' + restaurantId);
    return response.data;
  },
  approve: async (restaurantId, notes) => {
    const response = await api.put(API_URL + '/' + restaurantId + '/approve', { notes });
    return response.data;
  },
  reject: async (restaurantId, reason) => {
    const response = await api.put(API_URL + '/' + restaurantId + '/reject', { reason });
    return response.data;
  },
  suspend: async (restaurantId, reason) => {
    const response = await api.put(API_URL + '/' + restaurantId + '/suspend', { reason });
    return response.data;
  },
  unsuspend: async (restaurantId) => {
    const response = await api.put(API_URL + '/' + restaurantId + '/unsuspend');
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  }
};