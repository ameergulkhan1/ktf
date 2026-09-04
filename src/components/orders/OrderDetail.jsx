// src/components/orders/OrderDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import Loader from '../common/Loader';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const OrderDetail = () => {
  const { id } = useParams();
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Failed to load order</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <Link to="/orders" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h2>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700 hover:underline">Back to orders</Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'shipped': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'delivered': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const totalAmount = Number(order.total) || Number(order.total_amount) || 0;
  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);
  const orderDate = order.created_at || order.createdAt || new Date();

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link 
        to="/orders" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          {/* Order ID and Status */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🇵🇰 Order #{order.order_number || order.id}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(orderDate), 'MMMM dd, yyyy h:mm a')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>

          {/* Status Tracker */}
          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-xs mt-1 capitalize ${
                        index <= currentStep 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`flex-1 h-1 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(order.status === 'cancelled' || order.status === 'refunded') && (
            <div className={`mb-6 p-4 rounded-lg ${
              order.status === 'cancelled' 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : 'bg-gray-50 dark:bg-gray-700/20 border border-gray-200 dark:border-gray-700'
            }`}>
              <p className={`font-medium ${
                order.status === 'cancelled' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {order.status.toUpperCase()}: {order.cancellation_reason || 'No reason provided'}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Items</h2>
            <div className="space-y-3">
              {(order.items || order.order_items || []).map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name || item.product_name || item.item_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>${Number(order.delivery_fee).toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-blue-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {order.delivery_address && (
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                📍 Delivery Information
              </h2>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Address:</span> {order.delivery_address}</p>
                {order.house_no && <p><span className="font-medium">House:</span> {order.house_no}</p>}
                {order.street && <p><span className="font-medium">Street:</span> {order.street}</p>}
                {order.sector && <p><span className="font-medium">Sector:</span> {order.sector}</p>}
                {order.city && <p><span className="font-medium">City:</span> {order.city}</p>}
                {order.state && <p><span className="font-medium">State:</span> {order.state}</p>}
                {order.postal_code && <p><span className="font-medium">Postal Code:</span> {order.postal_code}</p>}
                {order.phone && <p><span className="font-medium">Phone:</span> {order.phone}</p>}
                {order.delivery_instructions && (
                  <p><span className="font-medium">Instructions:</span> {order.delivery_instructions}</p>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.payment_method && (
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                💳 Payment Information
              </h2>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Method:</span> {order.payment_method}</p>
                <p><span className="font-medium">Status:</span> {order.payment_status}</p>
                {order.transaction_id && (
                  <p><span className="font-medium">Transaction ID:</span> {order.transaction_id}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;