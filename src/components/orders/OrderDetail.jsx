// src/components/orders/OrderDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import Loader from '../common/Loader';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ORDER_STEPS, statusBadge, statusLabel, stepIndex, canCustomerCancel } from '../../utils/orderStatus';
import { formatPrice, formatDiscount } from '../../utils/format';

const OrderDetail = () => {
  const { id } = useParams();
  const { order, loading, error, cancelOrder } = useOrder(id);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    const response = await cancelOrder('Cancelled by customer');
    setCancelling(false);
    if (response?.success) toast.success('Order cancelled');
    else toast.error(response?.message || 'This order can no longer be cancelled');
  };


  if (loading && !order) {
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

  const totalAmount = Number(order.total) || Number(order.total_amount) || 0;
  const currentStep = stepIndex(order.status || 'pending');
  const subtotal = Number(order.subtotal) || totalAmount - (Number(order.delivery_fee) || 0) - (Number(order.tax) || 0);
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
        <div className="p-4 sm:p-6">
          {/* Order ID and Status */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Order #{order.order_number || order.id}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(orderDate), 'MMMM dd, yyyy h:mm a')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusBadge(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>

          {canCustomerCancel(order.status) && (
            <div className="-mt-2 mb-6">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling…' : 'Cancel this order'}
              </button>
            </div>
          )}

          {/* Status Tracker */}
          {order.status !== 'cancelled' && order.status !== 'refunded' && currentStep >= 0 && (
            <div className="mb-8">
              {/* Phones: a single progress bar with the current step named */}
              <div className="sm:hidden">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{statusLabel(ORDER_STEPS[currentStep])}</span>
                  <span className="text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {ORDER_STEPS.length}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${((currentStep + 1) / ORDER_STEPS.length) * 100}%` }} />
                </div>
              </div>
              {/* Larger screens: every step */}
              <ol className="hidden sm:flex items-start">
                {ORDER_STEPS.map((step, index) => (
                  <li key={step} className="flex-1 flex flex-col items-center relative">
                    {index > 0 && (
                      <span className={`absolute top-4 right-1/2 w-full h-1 -translate-y-1/2 ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`} />
                    )}
                    <span
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-xs mt-1.5 text-center ${index <= currentStep ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {statusLabel(step)}
                    </span>
                  </li>
                ))}
              </ol>
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
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
                  <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}
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
                <span>{formatPrice(subtotal)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(order.delivery_fee)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>{formatDiscount(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-blue-600">
                  {formatPrice(totalAmount)}
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
                <p><span className="font-medium">Method:</span> {String(order.payment_method).replace(/_/g, ' ')}</p>
                <p><span className="font-medium">Status:</span> {order.payment_status || 'pending'}</p>
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