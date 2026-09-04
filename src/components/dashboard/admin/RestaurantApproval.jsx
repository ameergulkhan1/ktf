// src/components/dashboard/admin/RestaurantApproval.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/adminApi';
import toast from 'react-hot-toast';

const RestaurantApproval = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/restaurants', {
        params: { 
          page, 
          limit, 
          status: statusFilter,
          search: searchTerm || undefined
        }
      });
      
      console.log('📥 Restaurants response:', response.data);
      
      if (response.data.success) {
        setRestaurants(response.data.restaurants || []);
        setTotal(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [page, statusFilter, searchTerm]);

  const handleApprove = async (restaurantId) => {
    if (!window.confirm('Approve this restaurant?')) return;
    
    try {
      const response = await adminApi.put(`/admin/restaurants/${restaurantId}/approve`);
      if (response.data.success) {
        toast.success('Restaurant approved successfully!');
        fetchRestaurants();
      }
    } catch (error) {
      console.error('Error approving restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to approve restaurant');
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    
    try {
      const response = await adminApi.put(`/admin/restaurants/${restaurantId}/reject`, { reason });
      if (response.data.success) {
        toast.success('Restaurant rejected successfully!');
        fetchRestaurants();
      }
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to reject restaurant');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Approval</h2>
        <button
          onClick={fetchRestaurants}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="">All</option>
        </select>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No restaurants found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cuisine</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{restaurant.restaurant_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{restaurant.vendor_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{restaurant.cuisine_type || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${
                      restaurant.is_approved ? 'bg-green-100 text-green-800' : 
                      restaurant.is_suspended ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {restaurant.is_approved ? 'Approved' : restaurant.is_suspended ? 'Suspended' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {!restaurant.is_approved && !restaurant.is_suspended && (
                      <>
                        <button
                          onClick={() => handleApprove(restaurant.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(restaurant.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">Total: {total} restaurants</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantApproval;