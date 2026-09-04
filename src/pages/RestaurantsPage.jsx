// src/pages/RestaurantsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurants } from '../hooks/useRestaurant';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading && restaurants.length === 0) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">😅</div>
          <p className="text-red-500 text-lg">Error loading restaurants: {error}</p>
          <button
            onClick={() => fetchRestaurants({ limit: 12 })}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">🇵🇰 All Restaurants</h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search restaurants by name or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2.5 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <FiSearch className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md whitespace-nowrap"
        >
          Search
        </button>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              fetchRestaurants({ limit: 12 });
            }}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {restaurants.length} restaurants found
        </p>
      )}

      {/* Restaurants Grid */}
      {restaurants.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No restaurants found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
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
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchRestaurants({ page: pagination.page + 1, limit: 12 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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