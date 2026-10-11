// src/pages/OrdersPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiChevronRight } from 'react-icons/fi';
import { useOrders } from '../hooks/useOrders';
import { formatPrice } from '../utils/format';
import { statusBadge, statusLabel, canCustomerCancel } from '../utils/orderStatus';
import { EmptyState } from '../components/common/States';

const TABS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];

const OrdersPage = () => {
  // useOrders loads the list itself on mount.
  const { orders, loading, error, fetchOrders, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const filteredOrders = (orders || []).filter((order) => activeTab === 'all' || order.status === activeTab);

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel order #${order.order_number || order.id}?`)) return;
    setCancelling(order.id);
    const response = await cancelOrder(order.id, 'Cancelled by customer');
    setCancelling(null);
    if (response?.success) toast.success('Order cancelled');
    else toast.error(response?.message || 'This order can no longer be cancelled');
  };

  return (
    <div className="container-custom py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'all' ? 'All' : statusLabel(tab)}
          </button>
        ))}
      </div>

      {loading && !orders?.length ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-white dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <EmptyState icon="😅" title="Could not load your orders" text={String(error)} onAction={() => fetchOrders()} actionLabel="Retry" />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="🛒"
          title={activeTab === 'all' ? 'No orders yet' : `No ${statusLabel(activeTab).toLowerCase()} orders`}
          text="Start ordering your favorite desi food!"
          actionTo="/products"
          actionLabel="Start shopping"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const created = new Date(order.created_at);
            const itemCount = order.items?.length ?? Number(order.item_count ?? 0);
            return (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">Order #{order.order_number || order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {created.toLocaleDateString()} · {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusBadge(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {itemCount} item{itemCount === 1 ? '' : 's'}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(order.total)}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
                  {canCustomerCancel(order.status) ? (
                    <button
                      onClick={() => handleCancel(order)}
                      disabled={cancelling === order.id}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 disabled:opacity-50"
                    >
                      {cancelling === order.id ? 'Cancelling…' : 'Cancel order'}
                    </button>
                  ) : (
                    <span />
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    View details
                    <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
