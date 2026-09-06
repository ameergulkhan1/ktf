// src/components/dashboard/admin/OrdersManagement.jsx
import React, { useState, useEffect } from 'react';
import { getOrders, getOrderById, updateOrderStatus } from '../../../api/adminApi';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search: search
      });
      
      console.log('📥 Orders API Response:', response);

      // ✅ Handle different response structures
      let ordersData = [];
      let paginationData = { page: 1, limit: 20, total: 0, totalPages: 0 };

      // Case 1: Response is the data directly (axios already unwrapped)
      if (response?.success) {
        ordersData = response.orders || [];
        paginationData = response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 };
      } 
      // Case 2: Response has data wrapper
      else if (response?.data?.success) {
        ordersData = response.data.orders || [];
        paginationData = response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 };
      }
      // Case 3: Response is the raw axios response
      else if (response?.data && typeof response.data === 'object') {
        if (response.data.success) {
          ordersData = response.data.orders || [];
          paginationData = response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 };
        }
      }

      console.log('📊 Orders data:', ordersData);
      console.log('📊 Pagination:', paginationData);

      setOrders(ordersData);
      setPagination(paginationData);

      if (ordersData.length === 0) {
        console.log('ℹ️ No orders found');
      }

    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await updateOrderStatus(orderId, newStatus);
      
      console.log('📥 Status update response:', response);

      if (response?.success || response?.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(response?.message || response?.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      console.log('📥 Order details response:', response);

      let orderData = null;
      if (response?.success) {
        orderData = response.order || response.data?.order;
      } else if (response?.data?.success) {
        orderData = response.data.order;
      }

      if (orderData) {
        setSelectedOrder(orderData);
        setShowModal(true);
      } else {
        toast.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {pagination.total} orders</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="picked_up">Picked Up</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-gray-500">Orders will appear here once customers place them.</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.order_number || order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium">{order.customer_name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{order.customer_email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.vendor_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total || order.total_amount || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${getStatusBadge(order.status)}`}
                        disabled={updatingStatus}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(order.payment_status)}`}>
                        {order.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex flex-wrap justify-between items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} orders
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Order #{selectedOrder.order_number || selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(selectedOrder.payment_status)}`}>
                    {selectedOrder.payment_status || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-semibold">{formatCurrency(selectedOrder.total || selectedOrder.total_amount || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="font-medium">{selectedOrder.vendor_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Item</th>
                          <th className="px-4 py-2 text-right">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{item.product_name || item.menu_item_name || 'Item'}</td>
                            <td className="px-4 py-2 text-right">{item.quantity || 1}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(item.price || 0)}</td>
                            <td className="px-4 py-2 text-right font-medium">
                              {formatCurrency((item.price || 0) * (item.quantity || 1))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right font-medium">Total</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {formatCurrency(selectedOrder.total || selectedOrder.total_amount || 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {selectedOrder.delivery_address && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.delivery_address}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Commission</p>
                  <p className="font-semibold">{formatCurrency(selectedOrder.admin_commission || 0)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Vendor Earnings</p>
                  <p className="font-semibold">{formatCurrency(selectedOrder.vendor_earnings || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;