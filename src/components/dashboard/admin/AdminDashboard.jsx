// src/components/dashboard/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLogOut,
  FiRefreshCw,
  FiHome,
  FiSettings,
  FiBell,
  FiUser,
  FiStar,
  FiThumbsUp,
  FiMessageSquare,
  FiPackage,
  FiTruck,
  FiCreditCard
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../../api/adminApi';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import OrdersChart from './components/OrdersChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import TopVendors from './components/TopVendors';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, new: 0 },
    vendors: { total: 0, pending: 0, approved: 0, active: 0 },
    orders: { total: 0, pending: 0, processing: 0, delivered: 0, cancelled: 0 },
    revenue: { total: 0, commission: 0, monthly: 0, growth: 0 },
    recentActivities: [],
    topVendors: [],
    ordersByDay: [],
    revenueByMonth: []
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      
      const response = await api.get('/admin/dashboard');
      
      if (response.data.success) {
        const data = response.data.data || response.data;
        setStats({
          users: {
            total: data.users?.total || 0,
            active: data.users?.active || 0,
            new: data.users?.new || 0
          },
          vendors: {
            total: data.vendors?.total || 0,
            pending: data.vendors?.pending || 0,
            approved: data.vendors?.approved || 0,
            active: data.vendors?.active || 0
          },
          orders: {
            total: data.orders?.total || 0,
            pending: data.orders?.pending || 0,
            processing: data.orders?.processing || 0,
            delivered: data.orders?.delivered || 0,
            cancelled: data.orders?.cancelled || 0
          },
          revenue: {
            total: data.revenue?.total || 0,
            commission: data.revenue?.commission || 0,
            monthly: data.revenue?.monthly || 0,
            growth: data.revenue?.growth || 0
          },
          recentActivities: data.recentActivities || [],
          topVendors: data.topVendors || [],
          ordersByDay: data.ordersByDay || [],
          revenueByMonth: data.revenueByMonth || []
        });
        setLastUpdated(new Date());
        toast.success('Dashboard updated successfully');
      } else {
        setError(response.data.message || 'Failed to load dashboard');
        toast.error(response.data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.message || 'Network error');
      toast.error(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // If not admin, show access denied
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">You don't have permission to view this page.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <FiHome className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Last Updated */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <FiClock className="w-4 h-4" />
                <span>Updated: {formatDate(lastUpdated)}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchDashboardData(false)}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                title="Refresh Dashboard"
              >
                <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.full_name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.full_name || 'Admin'}</span>! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Cards Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue.total)}
            change={stats.revenue.growth}
            icon={<FiDollarSign className="w-6 h-6" />}
            color="blue"
            subtitle={`Monthly: ${formatCurrency(stats.revenue.monthly)}`}
          />
          <StatsCard
            title="Total Orders"
            value={stats.orders.total.toLocaleString()}
            change={12}
            icon={<FiShoppingBag className="w-6 h-6" />}
            color="green"
            subtitle={`Pending: ${stats.orders.pending}`}
          />
          <StatsCard
            title="Total Users"
            value={stats.users.total.toLocaleString()}
            change={8}
            icon={<FiUsers className="w-6 h-6" />}
            color="purple"
            subtitle={`Active: ${stats.users.active}`}
          />
          <StatsCard
            title="Total Vendors"
            value={stats.vendors.total.toLocaleString()}
            change={5}
            icon={<FiStar className="w-6 h-6" />}
            color="orange"
            subtitle={`Pending: ${stats.vendors.pending}`}
          />
        </div>

        {/* Quick Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-500 hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Vendors</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.vendors.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Need approval</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Processing Orders</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.orders.processing || 0}</p>
            <p className="text-xs text-gray-400 mt-1">In progress</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-500 hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Delivered Orders</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.orders.delivered}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-500 hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.orders.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting action</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-purple-500 hover:shadow-md transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Commission</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(stats.revenue.commission)}</p>
            <p className="text-xs text-gray-400 mt-1">Earned</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              Revenue Overview
            </h3>
            <RevenueChart data={stats.revenueByMonth} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-green-600" />
              Order Statistics
            </h3>
            <OrdersChart data={stats.orders} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiClock className="text-purple-600" />
              Recent Activity
            </h3>
            {stats.recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiMessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <RecentActivity activities={stats.recentActivities} />
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiStar className="text-yellow-600" />
              Top Vendors
            </h3>
            {stats.topVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiUser className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No vendors yet</p>
              </div>
            ) : (
              <TopVendors vendors={stats.topVendors} />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <QuickActions className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition" />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;