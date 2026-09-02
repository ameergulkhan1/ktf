// src/hooks/admin/useAdminVendors.js
import { useState, useCallback } from 'react';
import { adminVendorService } from '../../services/admin/adminVendorService';

export const useAdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});

  const fetchVendors = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminVendorService.getVendors({
        page,
        limit,
        ...filters,
        ...params
      });
      
      console.log('Vendors API Response:', response);
      
      if (response && response.success) {
        setVendors(response.vendors || []);
        if (response.pagination) {
          setTotal(response.pagination.total || 0);
          setPage(response.pagination.page || 1);
        }
      } else if (response && response.vendors) {
        setVendors(response.vendors || []);
        setTotal(response.total || 0);
      } else {
        setVendors([]);
        setTotal(0);
      }
      return response;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
      setTotal(0);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const getVendorById = useCallback(async (vendorId) => {
    try {
      const response = await adminVendorService.getVendorById(vendorId);
      return response;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const approveVendor = useCallback(async (vendorId, notes) => {
    try {
      const response = await adminVendorService.approveVendor(vendorId, notes);
      if (response && response.success) {
        // ✅ Fetch updated list after approval
        await fetchVendors();
        toast.success('Vendor approved successfully!');
      }
      return response;
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error('Failed to approve vendor');
      return { success: false, message: error.message };
    }
  }, [fetchVendors]);

  const rejectVendor = useCallback(async (vendorId, reason) => {
    try {
      const response = await adminVendorService.rejectVendor(vendorId, reason);
      if (response && response.success) {
        await fetchVendors();
        toast.success('Vendor rejected successfully');
      }
      return response;
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast.error('Failed to reject vendor');
      return { success: false, message: error.message };
    }
  }, [fetchVendors]);

  const suspendVendor = useCallback(async (vendorId, reason) => {
    try {
      const response = await adminVendorService.suspendVendor(vendorId, reason);
      if (response && response.success) {
        await fetchVendors();
        toast.success('Vendor suspended successfully');
      }
      return response;
    } catch (error) {
      console.error('Error suspending vendor:', error);
      toast.error('Failed to suspend vendor');
      return { success: false, message: error.message };
    }
  }, [fetchVendors]);

  const unsuspendVendor = useCallback(async (vendorId) => {
    try {
      const response = await adminVendorService.unsuspendVendor(vendorId);
      if (response && response.success) {
        await fetchVendors();
        toast.success('Vendor unsuspended successfully');
      }
      return response;
    } catch (error) {
      console.error('Error unsuspending vendor:', error);
      toast.error('Failed to unsuspend vendor');
      return { success: false, message: error.message };
    }
  }, [fetchVendors]);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminVendorService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  return {
    vendors,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    suspendVendor,
    unsuspendVendor,
    getStatistics
  };
};