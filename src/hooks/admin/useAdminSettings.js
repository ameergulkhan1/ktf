// src/hooks/admin/useAdminSettings.js
import { useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosConfig';

export const useAdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/settings');
      return res.data || { success: true, data: {} };
    } catch (err) {
      setError(err.message);
      return { success: true, data: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (settings) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put('/admin/settings', settings);
      return res.data || { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getSettings,
    updateSettings,
    loading,
    error
  };
};

export default useAdminSettings;

