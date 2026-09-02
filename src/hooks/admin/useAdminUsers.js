// src/hooks/admin/useAdminUsers.js
import { useState, useCallback } from 'react';
import { adminUserService } from '../../services/admin/adminUserService';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminUserService.getUsers({
        page,
        limit,
        ...filters,
        ...params
      });
      
      console.log('Users API Response:', response);
      
      // Handle the response - backend returns { success: true, users: [...], pagination: {...} }
      if (response && response.success) {
        setUsers(response.users || []);
        if (response.pagination) {
          setTotal(response.pagination.total || 0);
          setPage(response.pagination.page || 1);
        }
      } else if (response && response.users) {
        setUsers(response.users || []);
        setTotal(response.total || 0);
      } else {
        setUsers([]);
        setTotal(0);
      }
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotal(0);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const getUserById = useCallback(async (userId) => {
    try {
      const response = await adminUserService.getUserById(userId);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const updateUser = useCallback(async (userId, data) => {
    try {
      const response = await adminUserService.updateUser(userId, data);
      if (response && response.success) {
        await fetchUsers();
      }
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: error.message };
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await adminUserService.deleteUser(userId);
      if (response && response.success) {
        await fetchUsers();
      }
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: error.message };
    }
  }, [fetchUsers]);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminUserService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const bulkUpdate = useCallback(async (userIds, updateData) => {
    try {
      const response = await adminUserService.bulkUpdate({
        userIds,
        updateData
      });
      if (response && response.success) {
        await fetchUsers();
      }
      return response;
    } catch (error) {
      console.error('Error bulk updating users:', error);
      return { success: false, message: error.message };
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    getStatistics,
    bulkUpdate
  };
};