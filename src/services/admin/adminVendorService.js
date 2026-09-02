// src/services/admin/adminVendorService.js
import api from '../../api/adminApi';

const API_URL = '/admin/vendors';

export const adminVendorService = {
  getVendors: async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },
  getVendorById: async (vendorId) => {
    const response = await api.get(API_URL + '/' + vendorId);
    return response.data;
  },
  approveVendor: async (vendorId, notes) => {
    const response = await api.put(API_URL + '/' + vendorId + '/approve', { notes });
    return response.data;
  },
  rejectVendor: async (vendorId, reason) => {
    const response = await api.put(API_URL + '/' + vendorId + '/reject', { reason });
    return response.data;
  },
  suspendVendor: async (vendorId, reason) => {
    const response = await api.put(API_URL + '/' + vendorId + '/suspend', { reason });
    return response.data;
  },
  unsuspendVendor: async (vendorId) => {
    const response = await api.put(API_URL + '/' + vendorId + '/unsuspend');
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  }
};