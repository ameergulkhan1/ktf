// src/hooks/admin/useAdminOrders.js
import { useState, useCallback } from 'react';
import { adminOrderService } from '../../services/admin/adminOrderService';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminOrderService.getAll({
        page,
        limit,
        ...filters,
        ...params
      });
      
      if (response.success) {
        setOrders(response.data.orders);
        setTotal(response.data.total);
        setPage(response.data.page);
      }
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const getOrderById = useCallback(async (orderId) => {
    try {
      const response = await adminOrderService.getById(orderId);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const updateStatus = useCallback(async (orderId, status, notes) => {
    try {
      const response = await adminOrderService.updateStatus(orderId, status, notes);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: error.message };
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      const response = await adminOrderService.cancel(orderId, reason);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return { success: false, message: error.message };
    }
  }, [fetchOrders]);

  const refundOrder = useCallback(async (orderId, amount, reason) => {
    try {
      const response = await adminOrderService.refund(orderId, amount, reason);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (error) {
      console.error('Error refunding order:', error);
      return { success: false, message: error.message };
    }
  }, [fetchOrders]);

  const getTimeline = useCallback(async (orderId) => {
    try {
      const response = await adminOrderService.getTimeline(orderId);
      return response;
    } catch (error) {
      console.error('Error fetching timeline:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminOrderService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  return {
    orders,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchOrders,
    getOrderById,
    updateStatus,
    cancelOrder,
    refundOrder,
    getTimeline,
    getStatistics
  };
};