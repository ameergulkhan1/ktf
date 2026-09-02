// components/dashboard/admin/RestaurantApproval.jsx
import React, { useState, useEffect } from 'react';
import { useAdminRestaurants } from '../../../hooks/admin/useAdminRestaurants';
import { format } from 'date-fns';

const RestaurantApproval = () => {
  const {
    restaurants,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchRestaurants,
    approveRestaurant,
    rejectRestaurant,
    getRestaurantById
  } = useAdminRestaurants();

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilters({ status: 'pending', ...(searchTerm && { search: searchTerm }) });
  }, [searchTerm]);

  useEffect(() => {
    fetchRestaurants();
  }, [page, limit, filters]);

  const handleApprove = async (restaurantId) => {
    if (window.confirm('Approve this restaurant?')) {
      const response = await approveRestaurant(restaurantId, 'Restaurant approved');
      if (response.success) {
        await fetchRestaurants();
      }
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      const response = await rejectRestaurant(restaurantId, reason);
      if (response.success) {
        await fetchRestaurants();
      }
    }
  };

  const handleViewDetails = async (restaurantId) => {
    const response = await getRestaurantById(restaurantId);
    if (response.success) {
      setSelectedRestaurant(response.data);
      setShowDetails(true);
    }
  };

  return (
    <div className="restaurant-approval p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Approval</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {total} pending restaurants
          </span>
          <button
            onClick={() => fetchRestaurants()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No pending restaurants
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <img
                  src={restaurant.logo_url || '/default-restaurant.png'}
                  alt={restaurant.restaurant_name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {restaurant.restaurant_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {restaurant.vendor?.business_name || 'Unknown Vendor'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {restaurant.cuisine_type || 'General'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⭐ {restaurant.average_rating || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleViewDetails(restaurant.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(restaurant.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} restaurants
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {page}
            </span>
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

      {/* Restaurant Details Modal */}
      {showDetails && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Restaurant Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedRestaurant.logo_url || '/default-restaurant.png'}
                  alt={selectedRestaurant.restaurant_name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-xl font-bold">{selectedRestaurant.restaurant_name}</h4>
                  <p className="text-gray-500">{selectedRestaurant.vendor?.business_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedRestaurant.cuisine_type} • ⭐ {selectedRestaurant.average_rating || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedRestaurant.address}</p>
                  <p className="text-sm text-gray-500">
                    {selectedRestaurant.city}, {selectedRestaurant.state} {selectedRestaurant.postal_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{selectedRestaurant.phone}</p>
                  <p className="text-sm text-gray-500">{selectedRestaurant.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Opening Hours</p>
                  <p className="font-medium">{selectedRestaurant.opening_hours || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="font-medium">Min Order: ${selectedRestaurant.min_order_amount || 0}</p>
                  <p className="text-sm text-gray-500">Delivery Fee: ${selectedRestaurant.delivery_fee || 0}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedRestaurant.description || 'No description'}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 flex gap-3">
                <button
                  onClick={() => {
                    handleApprove(selectedRestaurant.id);
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve Restaurant
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedRestaurant.id);
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject Restaurant
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantApproval;