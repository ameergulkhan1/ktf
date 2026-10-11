// src/pages/SearchPage.jsx
// This page read `data`/`isLoading` from hooks that return `products`/`loading`, so it
// showed "No results" for every query. It now calls the product search endpoint and
// matches restaurants locally (the restaurant API has no search parameter).
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { productApi } from '../api/productApi';
import { restaurantApi } from '../api/restaurantApi';
import ProductCard from '../components/products/ProductCard';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { CardGridSkeleton, EmptyState } from '../components/common/States';

const TABS = [
  ['all', 'All'],
  ['restaurants', 'Restaurants'],
  ['products', 'Products'],
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [input, setInput] = useState(query);
  const [tab, setTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setInput(query), [query]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setRestaurants([]);
      return;
    }
    let active = true;
    setLoading(true);
    const q = query.toLowerCase();
    Promise.all([productApi.search(query, { limit: 24 }), restaurantApi.getAll({ limit: 100 })]).then(([p, r]) => {
      if (!active) return;
      setProducts(p?.products || []);
      setRestaurants(
        (r?.restaurants || []).filter((item) =>
          [item.restaurant_name, item.cuisine_type, item.city, item.description].some((v) => v?.toLowerCase().includes(q))
        )
      );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) setSearchParams({ q: input.trim() });
  };

  const showRestaurants = (tab === 'all' || tab === 'restaurants') && restaurants.length > 0;
  const showProducts = (tab === 'all' || tab === 'products') && products.length > 0;
  const total = products.length + restaurants.length;
  const counts = { all: total, restaurants: restaurants.length, products: products.length };

  return (
    <div className="container-custom py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {query ? <>Results for “{query}”</> : 'Search'}
      </h1>

      <form onSubmit={handleSearch} className="relative max-w-2xl mb-6" role="search">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search biryani, nihari, restaurants..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Search"
          className="w-full pl-12 pr-24 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput('');
              setSearchParams({});
            }}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
          Search
        </button>
      </form>

      {!query ? (
        <EmptyState icon="🔍" title="What are you craving?" text="Search for a dish, cuisine or restaurant." />
      ) : loading ? (
        <CardGridSkeleton count={8} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
      ) : total === 0 ? (
        <EmptyState icon="🔍" title="No results found" text="Try a different word, or browse all products." actionTo="/products" actionLabel="Browse products" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>

          <div className="space-y-10">
            {showRestaurants && (
              <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Restaurants</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </section>
            )}
            {showProducts && (
              <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
