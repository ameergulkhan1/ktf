// src/hooks/admin/useAdminCommission.js
import { useState, useCallback } from 'react';
import { adminCommissionService } from '../../services/admin/adminCommissionService';

export const useAdminCommission = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [reports, setReports] = useState([]);

  const fetchOverview = useCallback(async (period = 'monthly') => {
    try {
      setLoading(true);
      const response = await adminCommissionService.getOverview(period);
      console.log('Commission Overview Response:', response);
      
      if (response && response.success) {
        setOverview(response.data || response.commissions || response);
      } else {
        setOverview(response);
      }
      return response;
    } catch (error) {
      console.error('Error fetching overview:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWithdrawals = useCallback(async (status = 'pending') => {
    try {
      setLoading(true);
      const response = await adminCommissionService.getWithdrawals(status);
      console.log('Withdrawals Response:', response);
      
      if (response && response.success) {
        setWithdrawals(response.withdrawals || response.data || []);
      } else if (response && response.withdrawals) {
        setWithdrawals(response.withdrawals);
      } else {
        setWithdrawals([]);
      }
      return response;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setWithdrawals([]);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminCommissionService.getReports(params);
      if (response && response.success) {
        setReports(response.data || response.reports || []);
      }
      return response;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCommissionRate = useCallback(async (vendorId, rate, reason) => {
    try {
      const response = await adminCommissionService.updateRate(vendorId, rate, reason);
      return response;
    } catch (error) {
      console.error('Error updating commission rate:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const processWithdrawal = useCallback(async (withdrawalId, status, notes) => {
    try {
      const response = await adminCommissionService.processWithdrawal(withdrawalId, status, notes);
      if (response && response.success) {
        await fetchWithdrawals();
      }
      return response;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return { success: false, message: error.message };
    }
  }, [fetchWithdrawals]);

  const getVendorWallet = useCallback(async (vendorId) => {
    try {
      const response = await adminCommissionService.getVendorWallet(vendorId);
      return response;
    } catch (error) {
      console.error('Error fetching vendor wallet:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminCommissionService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  return {
    loading,
    overview,
    withdrawals,
    reports,
    fetchOverview,
    fetchWithdrawals,
    fetchReports,
    updateCommissionRate,
    processWithdrawal,
    getVendorWallet,
    getStatistics
  };
};