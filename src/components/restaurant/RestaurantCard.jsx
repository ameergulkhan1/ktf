// src/components/restaurant/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiPlus } from 'react-icons/fi';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23e5e7eb"/%3E%3Ctext x="200" y="100" font-family="Arial" font-size="20" fill="%239ca3af" text-anchor="middle"%3ERestaurant%3C/text%3E%3C/svg%3E';

const RestaurantCard = ({ restaurant }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addItem(
      restaurant.id,
      1,
      9.99,
      `${restaurant.restaurant_name} Special`
    );
  };

  const rating = restaurant.average_rating || 0;
  const isOpen = restaurant.is_open !== false;

  return (
    <Link to={`/restaurants/${restaurant.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <img
            src={restaurant.image || restaurant.logo_url || PLACEHOLDER_IMAGE}
            alt={restaurant.restaurant_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
              isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isOpen ? '🟢 Open' : '🔴 Closed'}
            </span>
            {restaurant.is_featured && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md bg-blue-500 text-white">
                🇵🇰 Featured
              </span>
            )}
          </div>

          {rating > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {restaurant.restaurant_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {restaurant.description || 'Authentic desi food awaits you! 🇵🇰'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 gap-2">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3.5 h-3.5 text-blue-500" />
                {restaurant.address || 'Online'}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5 text-blue-500" />
                {restaurant.delivery_time || '30-45 min'}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition flex items-center gap-1 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;