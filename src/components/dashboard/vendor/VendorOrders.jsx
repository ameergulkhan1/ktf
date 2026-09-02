// src/components/dashboard/vendor/VendorOrders.jsx
import React, { useState, useEffect } from 'react';
import { useVendor } from '../../../hooks/useVendor';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import vendorApi from '../../../api/vendorApi';
import { FiTruck, FiCheck, FiX } from 'react-icons/fi';

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

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return 'Rs. ' + num.toFixed(2);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${filter === 'ready' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Ready
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${filter === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.order_number || order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.customer_name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{order.customer_phone || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.total_items || order.item_count || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {(order.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        disabled={!canUpdateStatus(order.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          canUpdateStatus(order.status)
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiCheck className="inline mr-1" /> Update
                      </button>
                      {(order.status === 'ready' || order.status === 'picked_up') && (
                        <button
                          onClick={() => handleOpenShipperModal(order)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                        >
                          <FiTruck className="inline mr-1" /> Shipper
                        </button>
                      )}
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Status: <span className="font-semibold text-gray-900">{(selectedOrder.status || 'pending').replace('_', ' ').toUpperCase()}</span></p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="picked_up">Picked Up</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {statusUpdate.status === 'ready' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  📝 Tip: After marking as "Ready", you can add shipper details to track delivery.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <FiTruck className="inline mr-2" />Add Shipper Details
            </h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipper Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ahmed Khan"
                  value={shipperDetails.shipper_name}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipper Phone *
                </label>
                <input
                  type="tel"
                  placeholder="e.g., 03001234567"
                  value={shipperDetails.shipper_phone}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Info (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., White Bike, ABC-123"
                  value={shipperDetails.shipper_vehicle}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, shipper_vehicle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., TRK-123456"
                  value={shipperDetails.tracking_number}
                  onChange={(e) => setShipperDetails({ ...shipperDetails, tracking_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShipperModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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