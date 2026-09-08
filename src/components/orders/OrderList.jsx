// src/components/orders/OrderList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import Loader from '../common/Loader';
import { format } from 'date-fns';

const OrderList = ({ vendorMode = false }) => {
  const { data, isLoading, error } = useOrders();

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-8 text-red-500">Failed to load orders</div>;

  const orders = data?.orders || [];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start ordering your favorite desi food!</p>
        <Link to="/products" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
          Browse Products 🇵🇰
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const totalAmount = Number(order.total_amount) || 0;
        
        return (
          <Link to={`/orders/${order.id}`} key={order.id}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order #{order.id}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(order.created_at), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {order.status || 'Pending'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {/* The list endpoint returns a SQL item_count rather than a nested
                        items array, so reading items?.length alone always showed 0. */}
                    {order.items?.length ?? Number(order.item_count ?? 0)} items
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default OrderList;