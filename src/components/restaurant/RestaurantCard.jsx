// src/components/restaurant/RestaurantCard.jsx
// The card's "Add" button used to put the *restaurant's id* into the cart as if it were a
// product, priced at a made-up 9.99. A restaurant card now just opens the restaurant.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';
import { formatRating } from '../../utils/format';

const RestaurantCard = ({ restaurant }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const rating = formatRating(restaurant.average_rating);
  const isOpen = restaurant.is_open !== false;
  const image = !imageFailed && (restaurant.banner_url || restaurant.image || restaurant.logo_url);
  const location = [restaurant.city, restaurant.address].filter(Boolean)[0];

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-700">
        {image ? (
          <img
            src={image}
            alt={restaurant.restaurant_name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-blue-500 to-indigo-700">🍽️</div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow ${isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
          {restaurant.is_featured && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full shadow bg-blue-600 text-white">Featured</span>
          )}
        </div>
        {rating && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-sm font-semibold">
            <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {rating}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {restaurant.restaurant_name}
        </h3>
        {restaurant.cuisine_type && <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">{restaurant.cuisine_type}</p>}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {restaurant.description || 'Authentic desi food awaits you!'}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3 min-w-0">
            {location && (
              <span className="flex items-center gap-1 min-w-0">
                <FiMapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate capitalize">{location}</span>
              </span>
            )}
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiClock className="w-3.5 h-3.5 text-blue-500" />
              {restaurant.delivery_time || '30-45 min'}
            </span>
          </div>
          <FiChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
