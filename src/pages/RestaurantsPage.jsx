// src/pages/RestaurantsPage.jsx
import React, { useEffect, useState } from 'react';
import { useRestaurants } from '../hooks/useRestaurant';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';

const RestaurantsPage = () => {
  const { restaurants, loading, error, fetchRestaurants, pagination } = useRestaurants({ limit: 12 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants({ limit: 12 });
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchRestaurants({ search: searchTerm, limit: 12 });
    } else {
      fetchRestaurants({ limit: 12 });
    }
  };

  if (loading && restaurants.length === 0) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading restaurants: {error}</p>
          <button
            onClick={() => fetchRestaurants({ limit: 12 })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Restaurants</h1>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Search
        </button>
      </div>

      {/* Restaurants Grid */}
      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No restaurants found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => fetchRestaurants({ page: pagination.page - 1, limit: 12 })}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchRestaurants({ page: pagination.page + 1, limit: 12 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;