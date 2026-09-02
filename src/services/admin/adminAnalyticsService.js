// src/services/admin/adminAnalyticsService.js
import api from '../../api/adminApi';

const API_URL = '/admin/analytics';

export const adminAnalyticsService = {
  getDashboardStats: async (timeRange) => {
    const response = await api.get(API_URL + '/dashboard', { params: { timeRange } });
    return response.data;
  },
  getRevenueAnalytics: async (params) => {
    const response = await api.get(API_URL + '/revenue', { params });
    return response.data;
  },
  getOrderAnalytics: async (params) => {
    const response = await api.get(API_URL + '/orders', { params });
    return response.data;
  },
  getUserAnalytics: async (params) => {
    const response = await api.get(API_URL + '/users', { params });
    return response.data;
  },
  getPerformanceMetrics: async (timeframe) => {
    const response = await api.get(API_URL + '/performance', { params: { timeframe } });
    return response.data;
  },
  getCustomReport: async (params) => {
    const response = await api.get(API_URL + '/custom-report', { params });
    return response.data;
  }
};