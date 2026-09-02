// hooks/admin/useAdminAnalytics.js
import { useState, useCallback } from 'react';
import api from '../../api/axiosConfig';

export const useAdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);

  const fetchDashboardStats = useCallback(async (timeRange = 'month') => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard', {
        params: { timeRange }
      });
      if (response.data.success) {
        setDashboardStats(response.data.data);
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/revenue', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/orders', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    dashboardStats,
    fetchDashboardStats,
    fetchRevenueAnalytics,
    fetchOrderAnalytics
  };
};