// src/components/restaurant/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23e5e7eb"/%3E%3Ctext x="200" y="100" font-family="Arial" font-size="20" fill="%239ca3af" text-anchor="middle"%3ERestaurant%3C/text%3E%3C/svg%3E';

const RestaurantCard = ({ restaurant }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ? Check if user is logged in
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

  return (
    <Link to={`/restaurants/${restaurant.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <img
            src={restaurant.image || restaurant.logo_url || PLACEHOLDER_IMAGE}
            alt={restaurant.restaurant_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          
          <div className="absolute top-3 right-3">
            <span className={"px-3 py-1 text-xs font-semibold rounded-full " + (restaurant.is_open !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}>
              {restaurant.is_open !== false ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                {restaurant.restaurant_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {restaurant.description || 'Delicious food awaits you!'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
              <span className="text-yellow-500">?</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {restaurant.average_rating || 4.5}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>?? {restaurant.address || 'Online'}</span>
              <span>?? {restaurant.delivery_time || '30-45 min'}</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition flex items-center gap-1"
            >
              <span>+</span> Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;