// src/hooks/admin/useAdminReport.js
import { useState, useCallback } from 'react';
import { adminReportService } from '../../services/admin/adminReportService';

export const useAdminReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [templates, setTemplates] = useState([]);

  const generateSalesReport = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateSalesReport(params);
      if (response.success) {
        setReportData(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error generating sales report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateVendorReport = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateVendorReport(params);
      if (response.success) {
        setReportData(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error generating vendor report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateProductReport = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateProductReport(params);
      if (response.success) {
        setReportData(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error generating product report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateUserReport = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateUserReport(params);
      if (response.success) {
        setReportData(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error generating user report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCommissionReport = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateCommissionReport(params);
      if (response.success) {
        setReportData(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error generating commission report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplates = useCallback(async () => {
    try {
      const response = await adminReportService.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const generateCustomReport = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await adminReportService.generateCustom(data);
      return response;
    } catch (error) {
      console.error('Error generating custom report:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    reportData,
    templates,
    generateSalesReport,
    generateVendorReport,
    generateProductReport,
    generateUserReport,
    generateCommissionReport,
    getTemplates,
    generateCustomReport
  };
};