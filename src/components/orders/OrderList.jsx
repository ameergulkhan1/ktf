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
    pending: 'badge-warning',
    processing: 'badge-info',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        // ✅ Convert total_amount to number
        const totalAmount = Number(order.total_amount) || 0;
        
        return (
          <Link to={`/orders/${order.id}`} key={order.id}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order #{order.id}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(order.created_at), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge ${statusColors[order.status] || 'badge-info'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {order.items?.length || 0} items
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