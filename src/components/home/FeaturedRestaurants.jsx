// src/components/home/FeaturedRestaurants.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // ✅ Only ONE import
import { restaurantApi } from '../../api/restaurantApi';
import { FiStar, FiMapPin, FiClock, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-52 bg-gray-200 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    </div>
  </div>
);

const safe = (value, fallback = '') => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return fallback;
  }
  return value;
};

const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

const RestaurantCard = ({ restaurant }) => {
  const id = restaurant?.id || 0;
  const name = safe(restaurant?.restaurant_name, 'Restaurant');
  const cuisine = safe(restaurant?.cuisine_type, '');
  const rating = safeNumber(restaurant?.average_rating);
  const reviews = safeNumber(restaurant?.total_reviews);
  const deliveryFee = safeNumber(restaurant?.delivery_fee);
  const isFeatured = restaurant?.is_featured || false;
  const status = safe(restaurant?.status, 'open');
  const imageUrl = restaurant?.image_url || restaurant?.banner_url || null;

  const getStatusColor = () => {
    const s = status.toLowerCase();
    if (s === 'open' || s === 'opening') return 'bg-emerald-500';
    if (s === 'closing') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getStatusText = () => {
    const s = status.toLowerCase();
    if (s === 'open' || s === 'opening') return 'Open Now';
    if (s === 'closing') return 'Closing Soon';
    return 'Closed';
  };

  return (
    <Link
      to={`/restaurants/${id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block"
    >
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <span className="text-6xl opacity-50">🍽️</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
          <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
            {getStatusText()}
          </span>
        </div>

        {rating > 0 && (
          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FiClock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">15-25 min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FiMapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
            {name}
          </h3>
          {isFeatured && (
            <span className="flex-shrink-0 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
          {cuisine || 'Restaurant'}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <span>⭐</span>
              <span>{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reviews} reviews
            </span>
          </div>
          <span className="text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
            <FiChevronRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        console.log('📤 Fetching restaurants...');
        const response = await restaurantApi.getAll({ limit: 4 });
        console.log('📥 Restaurants response:', response);
        
        if (isActive) {
          if (response?.success) {
            setRestaurants(response.restaurants || []);
          } else {
            setError(response?.message || 'Failed to load restaurants');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching restaurants:', err);
        if (isActive) {
          setError(err.message || 'Unable to load restaurants');
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchData, 100);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading && restaurants.length > 0) {
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load restaurants</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">🏪</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No restaurants available</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back later for new restaurants</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-red-500 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Restaurants
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top-rated restaurants near you
            </p>
          </div>
        </div>
        <Link
          to="/restaurants"
          className="group flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
        >
          View All
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRestaurants;