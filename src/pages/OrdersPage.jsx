// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import Loader from '../components/common/Loader';

const OrdersPage = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders?.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  }) || [];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-indigo-500',
      ready: 'bg-purple-500',
      delivered: 'bg-emerald-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">🇵🇰 My Orders</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error ? (
        <div className="text-center py-12 text-red-500">
          <p>Error loading orders: {error}</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start ordering your favorite desi food!</p>
          <Link to="/products" className="mt-4 inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
            Start Shopping 🇵🇰
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.order_number || order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.items?.length || 0} items
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  Rs. {parseFloat(order.total || 0).toFixed(2)}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition"
                >
                  View Details →
                </Link>
                {order.status === 'pending' && (
                  <button className="text-red-500 hover:text-red-600 text-sm font-medium transition">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;