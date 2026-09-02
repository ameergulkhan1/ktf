// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '../api/orderApi';

// ✅ Main hook for orders list
export const useOrders = (initialFilters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = { ...filters, ...newFilters };
      const response = await orderApi.getAll(params);
      
      if (response.success) {
        setOrders(response.orders || response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getOrderById = useCallback(async (id) => {
    try {
      const response = await orderApi.getById(id);
      if (response.success) {
        setSelectedOrder(response.order || response.data);
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      const response = await orderApi.create(orderData);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      const response = await orderApi.updateStatus(id, status);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (id, reason) => {
    try {
      const response = await orderApi.cancel(id, reason);
      if (response.success) {
        await fetchOrders();
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchOrders]);

  const trackOrder = useCallback(async (id) => {
    try {
      const response = await orderApi.track(id);
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    selectedOrder,
    setFilters,
    fetchOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    setSelectedOrder
  };
};

// ✅ NEW: useOrder hook for single order details
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError('Order ID is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getById(orderId);
      console.log('📦 Order details response:', response);
      
      if (response.success) {
        setOrder(response.order || response.data);
      } else {
        setError(response.message || 'Failed to fetch order');
      }
      return response;
    } catch (err) {
      setError(err.message || 'Network error');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchTimeline = useCallback(async () => {
    if (!orderId) return;
    
    try {
      const response = await orderApi.getTimeline(orderId);
      if (response.success) {
        setTimeline(response.timeline || response.data || []);
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [orderId]);

  const updateStatus = useCallback(async (status) => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      const response = await orderApi.updateStatus(orderId, status);
      if (response.success) {
        setOrder(prev => ({ ...prev, status }));
        await fetchTimeline();
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [orderId, fetchTimeline]);

  const cancelOrder = useCallback(async (reason) => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      const response = await orderApi.cancel(orderId, reason);
      if (response.success) {
        setOrder(prev => ({ ...prev, status: 'cancelled', cancellation_reason: reason }));
        await fetchTimeline();
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [orderId, fetchTimeline]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchTimeline();
    }
  }, [orderId]);

  // ✅ Return format compatible with OrderDetail component
  return { 
    order,
    data: { order },  // For compatibility with existing code
    loading, 
    error,
    timeline,
    fetchOrder,
    fetchTimeline,
    updateStatus,
    cancelOrder,
    isSuccess: !!order && !error,
    isError: !!error,
    isPending: loading
  };
};

// ✅ NEW: useOrderTimeline hook
export const useOrderTimeline = (orderId) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeline = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getTimeline(orderId);
      if (response.success) {
        setTimeline(response.timeline || response.data || []);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchTimeline();
    }
  }, [orderId]);

  return { timeline, loading, error, fetchTimeline };
};

// ✅ NEW: useOrderTracking hook
export const useOrderTracking = (orderId) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.track(orderId);
      if (response.success) {
        setTracking(response.tracking || response.data);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchTracking();
    }
  }, [orderId]);

  return { tracking, loading, error, fetchTracking };
};

// ✅ NEW: useOrderStats hook for dashboard
export const useOrderStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getAll({ limit: 1, stats: true });
      if (response.success) {
        setStats(response.stats || response.data || {});
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, fetchStats };
};

// ✅ Export all hooks
export default {
  useOrders,
  useOrder,
  useOrderTimeline,
  useOrderTracking,
  useOrderStats
};