// src/services/admin/adminCommissionService.js
import api from '../../api/adminApi';

const API_URL = '/admin/commissions';

export const adminCommissionService = {
  getOverview: async (period) => {
    const response = await api.get(API_URL + '/overview', { params: { period } });
    return response.data;
  },
  getDetails: async (vendorId) => {
    const response = await api.get(API_URL + '/' + vendorId + '/details');
    return response.data;
  },
  getReports: async (params) => {
    const response = await api.get(API_URL + '/reports', { params });
    return response.data;
  },
  getVendorWallet: async (vendorId) => {
    const response = await api.get(API_URL + '/' + vendorId + '/wallet');
    return response.data;
  },
  updateRate: async (vendorId, rate, reason) => {
    const response = await api.put(API_URL + '/' + vendorId + '/rate', { rate, reason });
    return response.data;
  },
  getWithdrawals: async (status) => {
    const response = await api.get(API_URL + '/withdrawals', { params: { status } });
    return response.data;
  },
  processWithdrawal: async (withdrawalId, status, notes) => {
    const response = await api.put(API_URL + '/withdrawals/' + withdrawalId, { status, notes });
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get(API_URL + '/statistics');
    return response.data;
  }
};