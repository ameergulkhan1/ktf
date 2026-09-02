// src/hooks/useNotifications.js
import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20, isRead = null) => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (isRead !== null) {
        params.is_read = isRead;
      }

      const response = await axiosInstance.get('/notifications', { params });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread/count');
      if (response.data.success) {
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const response = await axiosInstance.put(`/notifications/${id}/read`);
      if (response.data.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        // Update unread count
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await axiosInstance.put('/notifications/read/all');
      if (response.data.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${id}`);
      if (response.data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [fetchUnreadCount]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;
