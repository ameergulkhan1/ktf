// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useRestaurants } from '../hooks/useRestaurant';
import ProductCard from '../components/products/ProductCard';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loader from '../components/common/Loader';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Category mapping
const CATEGORY_MAP = {
  'biryani': 'Biryani',
  'nihari': 'Nihari',
  'bbq': 'BBQ',
  'karhai': 'Karhai',
  'pulao': 'Pulao',
  'desserts': 'Desserts',
  'beverages': 'Beverages',
  'street-food': 'Street Food',
  'pizza': 'Pizza',
  'burger': 'Burger',
  'sushi': 'Sushi',
  'pasta': 'Pasta',
  'healthy': 'Healthy'
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  // Fetch products with category filter
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({ 
    search: query,
    category: category ? CATEGORY_MAP[category] || category : ''
  });
  
  // Fetch restaurants with category filter
  const { data: restaurantsData, isLoading: restaurantsLoading, error: restaurantsError } = useRestaurants({ 
    search: query,
    category: category || ''
  });

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  if (productsLoading || restaurantsLoading) {
    return <Loader fullScreen />;
  }

  const products = productsData?.products || [];
  const restaurants = restaurantsData?.restaurants || [];

  // Filter based on active tab
  const filteredProducts = activeFilter === 'all' || activeFilter === 'products' ? products : [];
  const filteredRestaurants = activeFilter === 'all' || activeFilter === 'restaurants' ? restaurants : [];

  const hasResults = filteredProducts.length > 0 || filteredRestaurants.length > 0;
  const totalResults = filteredProducts.length + filteredRestaurants.length;

  // Get category display name
  const getCategoryDisplayName = (slug) => {
    return CATEGORY_MAP[slug] || slug;
  };

  return (
    <div className="container-custom py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🇵🇰 {category ? `${getCategoryDisplayName(category)}` : 'Search Results'}
          {query && ` for "${query}"`}
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search biryani, nihari, restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 pr-12 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <button type="submit" className="absolute right-4 top-3.5 text-blue-600 hover:text-blue-700 font-medium">
            Search
          </button>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {hasResults ? (
            <>Found <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> results</>
          ) : (
            <>No results found</>
          )}
        </p>
        
        {/* Filter Tabs */}
        {hasResults && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All ({totalResults})
            </button>
            {filteredRestaurants.length > 0 && (
              <button
                onClick={() => handleFilterChange('restaurants')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeFilter === 'restaurants'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Restaurants ({filteredRestaurants.length})
              </button>
            )}
            {filteredProducts.length > 0 && (
              <button
                onClick={() => handleFilterChange('products')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeFilter === 'products'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Products ({filteredProducts.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {!hasResults ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">No Results Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {category 
              ? `No ${getCategoryDisplayName(category)} found. Try a different category or search term.`
              : 'Try adjusting your search or browse our categories above.'}
          </p>
          <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
            Browse All 🇵🇰
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Restaurants */}
          {filteredRestaurants.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                🏪 Restaurants
                {category && ` serving ${getCategoryDisplayName(category)}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                🍽️ Products
                {category && ` in ${getCategoryDisplayName(category)}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;