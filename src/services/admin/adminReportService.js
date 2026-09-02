// src/services/admin/adminReportService.js
import api from '../../api/adminApi';

const API_URL = '/admin/reports';

export const adminReportService = {
  generateSalesReport: async (params) => {
    const response = await api.get(API_URL + '/sales', { params });
    return response.data;
  },
  generateVendorReport: async (params) => {
    const response = await api.get(API_URL + '/vendor', { params });
    return response.data;
  },
  generateProductReport: async (params) => {
    const response = await api.get(API_URL + '/products', { params });
    return response.data;
  },
  generateUserReport: async (params) => {
    const response = await api.get(API_URL + '/users', { params });
    return response.data;
  },
  generateCommissionReport: async (params) => {
    const response = await api.get(API_URL + '/commission', { params });
    return response.data;
  },
  getTemplates: async () => {
    const response = await api.get(API_URL + '/templates');
    return response.data;
  },
  generateCustom: async (data) => {
    const response = await api.post(API_URL + '/custom', data);
    return response.data;
  }
};