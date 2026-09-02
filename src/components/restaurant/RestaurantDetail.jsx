// src/components/restaurant/RestaurantDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurants } from '../../hooks/useRestaurant';
import { useCart } from '../../context/CartContext';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error || 'Restaurant not found'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/restaurants"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link to="/restaurants" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Restaurants
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {restaurant.restaurant_name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {restaurant.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                📍 {restaurant.address || 'Address not available'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                ⭐ {restaurant.average_rating || 0} ({restaurant.total_reviews || 0} reviews)
              </span>
              <span className={"text-sm px-2 py-1 rounded " + (restaurant.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                {restaurant.is_open ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Menu</h2>
          {menu.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No menu items available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{item.item_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">${(parseFloat(item.price) || 0).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="block mt-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;