// src/components/dashboard/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useAdminAnalytics } from '../../../hooks/admin/useAdminAnalytics';

const Analytics = () => {
  const {
    loading,
    dashboardStats,
    fetchDashboardStats,
    fetchRevenueAnalytics,
    fetchOrderAnalytics,
    fetchUserAnalytics,
    fetchPerformanceMetrics
  } = useAdminAnalytics();

  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardStats(timeRange);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
      <div className="text-center py-8 text-gray-500">
        Analytics dashboard coming soon...
      </div>
    </div>
  );
};

export default Analytics;