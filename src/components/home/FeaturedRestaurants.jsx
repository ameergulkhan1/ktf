// src/components/home/FeaturedRestaurants.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { restaurantApi } from '../../api/restaurantApi';
import RestaurantCard from '../restaurant/RestaurantCard';
import { CardGridSkeleton, EmptyState } from '../common/States';

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    restaurantApi
      .getAll({ limit: 4 })
      .then((response) => {
        if (active) setRestaurants(response?.restaurants || []);
      })
      .catch(() => {
        if (active) setRestaurants([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
      <div className="container-custom">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Restaurants</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top-rated desi restaurants near you</p>
          </div>
          <Link
            to="/restaurants"
            className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium shrink-0"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <CardGridSkeleton count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" />
        ) : restaurants.length === 0 ? (
          <EmptyState icon="🏪" title="No restaurants available" text="Check back later for new restaurants." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
