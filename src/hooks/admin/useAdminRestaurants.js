// src/hooks/admin/useAdminRestaurants.js
import { useState, useCallback } from 'react';
import { adminRestaurantService } from '../../services/admin/adminRestaurantService';

export const useAdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});

  const fetchRestaurants = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminRestaurantService.getAll({
        page,
        limit,
        ...filters,
        ...params
      });
      
      if (response.success) {
        setRestaurants(response.data.restaurants);
        setTotal(response.data.total);
        setPage(response.data.page);
      }
      return response;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const getRestaurantById = useCallback(async (restaurantId) => {
    try {
      const response = await adminRestaurantService.getById(restaurantId);
      return response;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const approveRestaurant = useCallback(async (restaurantId, notes) => {
    try {
      const response = await adminRestaurantService.approve(restaurantId, notes);
      if (response.success) {
        await fetchRestaurants();
      }
      return response;
    } catch (error) {
      console.error('Error approving restaurant:', error);
      return { success: false, message: error.message };
    }
  }, [fetchRestaurants]);

  const rejectRestaurant = useCallback(async (restaurantId, reason) => {
    try {
      const response = await adminRestaurantService.reject(restaurantId, reason);
      if (response.success) {
        await fetchRestaurants();
      }
      return response;
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      return { success: false, message: error.message };
    }
  }, [fetchRestaurants]);

  const suspendRestaurant = useCallback(async (restaurantId, reason) => {
    try {
      const response = await adminRestaurantService.suspend(restaurantId, reason);
      if (response.success) {
        await fetchRestaurants();
      }
      return response;
    } catch (error) {
      console.error('Error suspending restaurant:', error);
      return { success: false, message: error.message };
    }
  }, [fetchRestaurants]);

  const unsuspendRestaurant = useCallback(async (restaurantId) => {
    try {
      const response = await adminRestaurantService.unsuspend(restaurantId);
      if (response.success) {
        await fetchRestaurants();
      }
      return response;
    } catch (error) {
      console.error('Error unsuspending restaurant:', error);
      return { success: false, message: error.message };
    }
  }, [fetchRestaurants]);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminRestaurantService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  return {
    restaurants,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchRestaurants,
    getRestaurantById,
    approveRestaurant,
    rejectRestaurant,
    suspendRestaurant,
    unsuspendRestaurant,
    getStatistics
  };
};