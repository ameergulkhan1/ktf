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
  FiRefreshCw,
  FiSettings,
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
import { formatPrice } from '../../../utils/format';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
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

  // PanelLayout already guarantees an authenticated admin before this renders.
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

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
        // Only confirm a manual refresh; a toast on every page load is just noise.
        if (!showLoading) toast.success('Dashboard updated');
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

  const formatCurrency = formatPrice;

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
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // If not admin, show access denied
  if (!isAuthenticated || !isAdmin) {
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header. Navigation, profile and logout live in PanelLayout. */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
            <FiClock className="w-4 h-4" />
            Updated {formatDate(lastUpdated)}
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(false)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.full_name || 'Admin'}</span>! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Cards Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
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
            icon={<FiShoppingBag className="w-6 h-6" />}
            color="green"
            subtitle={`Pending: ${stats.orders.pending}`}
          />
          <StatsCard
            title="Total Users"
            value={stats.users.total.toLocaleString()}
            icon={<FiUsers className="w-6 h-6" />}
            color="purple"
            subtitle={`Active: ${stats.users.active}`}
          />
          <StatsCard
            title="Total Vendors"
            value={stats.vendors.total.toLocaleString()}
            icon={<FiStar className="w-6 h-6" />}
            color="orange"
            subtitle={`Pending: ${stats.vendors.pending}`}
          />
        </div>

        {/* Quick Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
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