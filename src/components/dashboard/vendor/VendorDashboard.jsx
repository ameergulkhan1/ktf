// src/components/dashboard/vendor/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVendor } from '../../../hooks/useVendor';
import { useAuth } from '../../../hooks/useAuth';
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyRupeeIcon,
  WalletIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import vendorApi from '../../../api/vendorApi';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon, color, subtitle, trend }) => {
  const colorVariants = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10',
      border: 'border-indigo-200 dark:border-indigo-800',
      icon: 'text-indigo-600 dark:text-indigo-400',
    }
  };

  const colors = colorVariants[color] || colorVariants.blue;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border ${colors.border}`}>
              <span className={`text-xl ${colors.icon}`}>{icon}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          </div>
          {trend !== undefined && trend !== 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              trend > 0 ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' :
              'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// QUICK ACTION CARD
// ============================================
const QuickActionCard = ({ icon, label, path, color, description }) => {
  const colorMap = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-gradient-to-br from-green-50 to-green-100/70 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100/70 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100/70 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
    red: 'bg-gradient-to-br from-red-50 to-red-100/70 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100/70 dark:from-indigo-900/30 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <Link to={path} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${selectedColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ArrowRightOnRectangleIcon className="h-3 w-3 text-red-600 dark:text-red-400 rotate-90" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============================================
// ORDER STATUS BADGE
// ============================================
const OrderStatusBadge = ({ status }) => {
  const safeStatus = status || 'pending';
  
  const statusMap = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      icon: '⏳',
      label: 'Pending'
    },
    confirmed: { 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      icon: '✅',
      label: 'Confirmed'
    },
    preparing: { 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      icon: '👨‍🍳',
      label: 'Preparing'
    },
    ready: { 
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      icon: '📦',
      label: 'Ready'
    },
    delivered: { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      icon: '🚚',
      label: 'Delivered'
    },
    cancelled: { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      icon: '❌',
      label: 'Cancelled'
    },
    processing: { 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      icon: '🔄',
      label: 'Processing'
    },
    shipped: { 
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      icon: '📦',
      label: 'Shipped'
    }
  };

  const statusInfo = statusMap[safeStatus] || statusMap.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}>
      <span>{statusInfo.icon}</span>
      {statusInfo.label}
    </span>
  );
};

// ============================================
// ACTIVITY TIMELINE ITEM
// ============================================
const ActivityItem = ({ icon, title, time, description, color }) => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.blue}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

// ============================================
// MAIN VENDOR DASHBOARD
// ============================================
const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    profile, 
    products, 
    orders, 
    earnings, 
    wallet, 
    loading 
  } = useVendor();
  const [restaurant, setRestaurant] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    averageRating: 0,
    conversionRate: 0,
    viewsCount: 0
  });

  useEffect(() => {
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const monthly = orders.filter(o => {
      const date = new Date(o.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const views = products.reduce((sum, p) => sum + (p.views_count || 0), 0);

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: pending,
      totalEarnings: parseFloat(earnings?.total || 0),
      monthlyOrders: monthly.length,
      monthlyRevenue: monthly.reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
      totalRevenue: totalRevenue,
      averageRating: profile?.average_rating || 0,
      conversionRate: views > 0 ? (orders.length / views) * 100 : 0,
      viewsCount: views
    });

    const activities = [
      ...orders.slice(0, 3).map(o => ({
        icon: '🛒',
        title: `New order #${o.order_number || o.id}`,
        time: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today',
        description: `Order total: Rs. ${parseFloat(o.total || 0).toFixed(2)}`,
        color: 'green'
      })),
      ...products.slice(0, 2).map(p => ({
        icon: '📦',
        title: `Product added: ${p.product_name || p.name}`,
        time: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today',
        description: `Price: Rs. ${parseFloat(p.price || 0).toFixed(2)}`,
        color: 'blue'
      }))
    ];

    if (activities.length === 0) {
      activities.push({
        icon: '👋',
        title: 'Welcome to your dashboard!',
        time: 'Just now',
        description: 'Start adding products and managing your store',
        color: 'purple'
      });
    }

    setRecentActivity(activities.slice(0, 5));
  }, [products, orders, earnings, profile]);

  useEffect(() => {
    let active = true;

    vendorApi.getRestaurant().then(response => {
      if (active && response?.success) {
        setRestaurant(response.restaurant || null);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && (!user || user?.role !== 'vendor')) {
      toast.error('Access denied. Vendor only.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return 'Rs. ' + num.toFixed(2);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-600 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-red-600 animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/25">
              <BuildingStorefrontIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Vendor Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Welcome back, <span className="font-semibold text-gray-700 dark:text-gray-300">{user?.full_name || 'Vendor'}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
            profile?.is_approved 
              ? 'bg-gradient-to-r from-green-50 to-green-100/70 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-gradient-to-r from-yellow-50 to-yellow-100/70 dark:from-yellow-900/30 dark:to-yellow-800/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
          }`}>
            {profile?.is_approved ? (
              <>
                <ShieldCheckIcon className="h-5 w-5" />
                Verified Vendor
              </>
            ) : (
              <>
                <ClockIcon className="h-5 w-5" />
                Pending Approval
              </>
            )}
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-600 dark:hover:border-red-500 transition-all duration-300 hover:shadow-md"
            title="Refresh dashboard"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transition-all duration-300"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"
      >
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="blue"
          subtitle={`${stats.totalProducts} active listings`}
          trend={5}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="🛒"
          color="green"
          subtitle={`${stats.pendingOrders} pending orders`}
          trend={12}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          color="purple"
          subtitle={`${formatCurrency(stats.monthlyRevenue)} this month`}
          trend={8}
        />
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(wallet?.balance || 0)}
          icon="💳"
          color="orange"
          subtitle={`Pending: ${formatCurrency(wallet?.pending_balance || 0)}`}
          trend={wallet?.balance > 0 ? 3 : -2}
        />
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: 'Monthly Orders', value: stats.monthlyOrders, icon: '📅', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Avg. Rating', value: `${parseFloat(stats.averageRating || 0).toFixed(1)} ★`, icon: '⭐', color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%`, icon: '📊', color: 'text-green-600 dark:text-green-400' },
          { label: 'Total Views', value: stats.viewsCount, icon: '👁️', color: 'text-purple-600 dark:text-purple-400' }
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className={item.color}>{item.icon}</span>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-red-600" />
                Recent Orders
                <span className="ml-2 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full">
                  {stats.pendingOrders} pending
                </span>
              </h2>
              <Link to="/vendor/orders" className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline flex items-center gap-1">
                View All →
              </Link>
            </div>
            <div className="p-5 max-h-96 overflow-y-auto">
              {orders?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCartIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Your orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders?.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order?.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                      onClick={() => navigate(`/vendor/orders/${order.id}`)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 flex items-center justify-center text-sm font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                          #{String(order?.id || 'N/A').slice(-4)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white truncate">
                            {order?.customer_name || 'Customer'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span>{order?.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            <span>{order?.items_count || 0} items</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          {formatCurrency(order?.total || 0)}
                        </span>
                        <OrderStatusBadge status={order?.status} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-5">
              <span className="text-xl">⚡</span>
              Quick Actions
              <span className="ml-auto text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full">
                PRO
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionCard
                icon="📦"
                label="Add Product"
                path="/vendor/products/add"
                color="blue"
                description="New listing"
              />
              <QuickActionCard
                icon="🍽️"
                label="Manage Menu"
                path="/vendor/menu"
                color="green"
                description="Update items"
              />
              <QuickActionCard
                icon="🏪"
                label="Restaurant"
                path="/vendor/restaurant"
                color="purple"
                description="Manage store"
              />
              <QuickActionCard
                icon="💰"
                label="Earnings"
                path="/vendor/earnings"
                color="yellow"
                description="View reports"
              />
              <QuickActionCard
                icon="📋"
                label="Orders"
                path="/vendor/orders"
                color="orange"
                description="Track orders"
              />
              <QuickActionCard
                icon="⚙️"
                label="Settings"
                path="/vendor/settings"
                color="indigo"
                description="Configure"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5"
        >
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <BuildingStorefrontIcon className="h-5 w-5 text-red-600" />
            Your Restaurant
          </h2>
          {restaurant ? (
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 dark:text-white truncate">
                  {restaurant.restaurant_name || 'Your Restaurant'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    restaurant.is_open 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {restaurant.is_open ? '🟢 Open' : '🔴 Closed'}
                  </span>
                  {restaurant.average_rating > 0 && (
                    <span className="text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <StarIcon className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {parseFloat(restaurant.average_rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              <Link
                to="/vendor/restaurant"
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Manage
              </Link>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <BuildingStorefrontIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No restaurant created yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Get started by creating your restaurant</p>
              <Link
                to="/vendor/restaurant"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Create Restaurant
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5"
        >
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <ClockIcon className="h-5 w-5 text-blue-500" />
            Recent Activity
            <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                title={activity.title}
                time={activity.time}
                description={activity.description}
                color={activity.color}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: '💡',
            title: 'Keep Menu Updated',
            description: 'Update your menu items regularly to attract more customers and keep them coming back.'
          },
          {
            icon: '📊',
            title: 'Track Performance',
            description: 'Monitor your sales, customer reviews, and conversion rates to grow your business.'
          },
          {
            icon: '🚀',
            title: 'Promote Your Business',
            description: 'Use promotions, discounts, and special offers to boost your sales and visibility.'
          }
        ].map((tip, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{tip.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VendorDashboard;