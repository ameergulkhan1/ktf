// src/components/restaurant/RestaurantDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurants } from '../../hooks/useRestaurant';
import { useCart } from '../../context/CartContext';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiArrowLeft, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { getRestaurantById, getMenu, fetchRestaurants } = useRestaurants();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const restaurantResponse = await getRestaurantById(id);
        console.log('Restaurant detail response:', restaurantResponse);
        
        if (restaurantResponse?.success) {
          let restaurantData = restaurantResponse.restaurant || restaurantResponse.data;

          if (!restaurantData) {
            const listResponse = await fetchRestaurants({ limit: 100 }, true);
            restaurantData = (listResponse?.restaurants || []).find(
              (item) => String(item.id) === String(id)
            );
          }

          if (!restaurantData) {
            setError('Restaurant not found');
            return;
          }

          setRestaurant(restaurantData);

          const menuResponse = await getMenu(id);
          console.log('Menu response:', menuResponse);
          if (menuResponse?.success) {
            setMenu(menuResponse.menu || menuResponse.items || menuResponse.data || []);
          } else {
            setMenu([]);
          }
        } else {
          setError(restaurantResponse?.message || 'Restaurant not found');
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError('Failed to load restaurant');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRestaurantData();
    }
  }, [id, getRestaurantById, getMenu, fetchRestaurants]);

  const handleAddToCart = (item) => {
    const itemName = item.item_name || item.name || item.product_name || 'Menu item';
    const price = parseFloat(item.price) || 0;

    if (price <= 0) {
      toast.error('This menu item has no valid price');
      return;
    }

    addItem(item.product_id || null, 1, price, itemName, item.id);
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error || !restaurant) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">😅</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error || 'Restaurant not found'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/restaurants"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md inline-flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const rating = restaurant.average_rating || 0;
  const isOpen = restaurant.is_open !== false;
  const reviewCount = restaurant.total_reviews || 0;

  return (
    <div className="container-custom py-8">
      <Link to="/restaurants" className="text-blue-600 hover:text-blue-700 hover:underline mb-4 inline-flex items-center gap-2 transition">
        <FiArrowLeft className="w-4 h-4" />
        Back to Restaurants
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Restaurant Header */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-2 border-white/30">
                🏪
              </div>
              <div>
                <h1 className="text-3xl font-bold">{restaurant.restaurant_name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-white/80">
                    <FiMapPin className="w-4 h-4" />
                    {restaurant.address || 'Address not available'}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <FiClock className="w-4 h-4" />
                    {restaurant.delivery_time || '30-45 min'}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isOpen ? '🟢 Open Now' : '🔴 Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Restaurant Info */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {rating > 0 ? rating.toFixed(1) : 'New'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
            </div>
            {restaurant.cuisine_type && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                {restaurant.cuisine_type}
              </span>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              🇵🇰 Authentic Pakistani Cuisine
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {restaurant.description || 'Experience the authentic taste of Pakistan with our delicious desi dishes.'}
          </p>

          {/* Menu Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              🍽️ Our Menu
            </h2>
            {menu.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No menu items available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later for delicious desi dishes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition hover:border-blue-300 dark:hover:border-blue-700">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {item.item_name || item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.ingredients && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            🧪 {item.ingredients}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${(parseFloat(item.price) || 0).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="block mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition shadow-sm hover:shadow-md w-full"
                        >
                          <FiShoppingCart className="inline mr-1 w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                Free delivery on orders over $50
              </span>
            </div>
            <Link
              to={`/restaurants/${id}/menu`}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg"
            >
              View Full Menu 🇵🇰
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;