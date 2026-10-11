// src/components/dashboard/vendor/VendorOrders.jsx
import React, { useState, useEffect } from 'react';
import { useVendor } from '../../../hooks/useVendor';
import toast from 'react-hot-toast';
import vendorApi from '../../../api/vendorApi';
import { FiTruck, FiCheck, FiX } from 'react-icons/fi';
import { formatPrice } from '../../../utils/format';
import { statusBadge } from '../../../utils/orderStatus';

const VendorOrders = () => {
  const { orders, loading, refetchOrders } = useVendor();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showShipperModal, setShowShipperModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'confirmed'
  });

  const [shipperDetails, setShipperDetails] = useState({
    shipper_name: '',
    shipper_phone: '',
    shipper_vehicle: '',
    tracking_number: ''
  });

  useEffect(() => {
    if (orders) {
      if (filter === 'all') {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(orders.filter(o => o.status === filter));
      }
    }
  }, [orders, filter]);

  const formatCurrency = formatPrice;

  const getStatusColor = statusBadge;

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'picked_up',
      picked_up: 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const canUpdateStatus = (status) => {
    return !['delivered', 'cancelled'].includes(status);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    const nextStatus = getNextStatus(order.status);
    setStatusUpdate({ status: nextStatus || 'delivered' });
    setShowStatusModal(true);
  };

  const handleOpenShipperModal = (order) => {
    setSelectedOrder(order);
    setShipperDetails({
      shipper_name: order.shipper_name || '',
      shipper_phone: order.shipper_phone || '',
      shipper_vehicle: order.shipper_vehicle || '',
      tracking_number: order.tracking_number || ''
    });
    setShowShipperModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      
      const payload = {
        status: statusUpdate.status,
        ...shipperDetails
      };

      const response = await vendorApi.updateOrderStatus(selectedOrder.id, payload);

      if (response && response.success) {
        toast.success(`Order status updated to ${statusUpdate.status}!`);
        setShowStatusModal(false);
        setShowShipperModal(false);
        if (refetchOrders) refetchOrders();
      } else {
        toast.error(response?.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading orders...</span>
      </div>
    );
  }

  const FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];

  const actions = (order) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleOpenStatusModal(order)}
        disabled={!canUpdateStatus(order.status)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
          canUpdateStatus(order.status)
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
        }`}
      >
        <FiCheck className="inline mr-1" /> Update status
      </button>
      {(order.status === 'ready' || order.status === 'picked_up') && (
        <button
          onClick={() => handleOpenShipperModal(order)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 transition"
        >
          <FiTruck className="inline mr-1" /> Rider details
        </button>
      )}
    </div>
  );

  const statusPill = (status) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(status)}`}>
      {(status || 'pending').replace('_', ' ').toUpperCase()}
    </span>
  );

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Orders</h1>
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
        {FILTERS.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap capitalize ${
              filter === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {key === 'all' ? 'All' : key.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredOrders?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        </div>
      ) : (
        <>
          {/* Phones: one card per order */}
          <div className="space-y-3 md:hidden">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white break-all">#{order.order_number || order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  {statusPill(order.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 dark:text-gray-200 truncate">{order.customer_name || 'Customer'}</p>
                    {order.customer_phone && (
                      <a href={`tel:${order.customer_phone}`} className="text-xs text-blue-600 dark:text-blue-400">{order.customer_phone}</a>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.total_items || order.item_count || 0} items</p>
                  </div>
                </div>
                {actions(order)}
              </div>
            ))}
          </div>

          {/* Tablets and up: table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Action'].map((h) => (
                      <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition dark:hover:bg-gray-700">
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{order.order_number || order.id}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="font-medium">{order.customer_name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{order.customer_phone || ''}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {order.total_items || order.item_count || 0} items
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">{statusPill(order.status)}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm">{actions(order)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Update Order Status</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">Current Status: <span className="font-semibold text-gray-900 dark:text-white">{(selectedOrder.status || 'pending').replace('_', ' ').toUpperCase()}</span></p>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                New Status
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
              >
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="picked_up">Picked Up</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {statusUpdate.status === 'ready' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  📝 Tip: After marking as "Ready", you can add shipper details to track delivery.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipper Details Modal */}
      {showShipperModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">
              <FiTruck className="inline mr-2" />Add Shipper Details
            </h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Shipper Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ahmed Khan"
                  value={shipperDetails.shipper_name}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Shipper Phone *
                </label>
                <input
                  type="tel"
                  placeholder="e.g., 03001234567"
                  value={shipperDetails.shipper_phone}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Vehicle Info (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., White Bike, ABC-123"
                  value={shipperDetails.shipper_vehicle}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_vehicle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., TRK-123456"
                  value={shipperDetails.tracking_number}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, tracking_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShipperModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setStatusUpdate({ status: 'delivered' });
                  handleUpdateStatus();
                }}
                disabled={updatingStatus || !shipperDetails.shipper_name || !shipperDetails.shipper_phone}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {updatingStatus ? 'Saving...' : 'Mark Delivered'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;