// src/pages/RestaurantsPage.jsx
// The backend restaurant list has no search parameter and returns no pagination, and the
// shared useRestaurants hook fired its own delayed { limit: 4 } fetch that could overwrite
// this page's results. The page now loads the list once and searches/pages it locally.
// Move search and paging server-side once the number of restaurants grows.
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import { CardGridSkeleton, EmptyState } from '../components/common/States';

const PAGE_SIZE = 12;

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [input, setInput] = useState(query);

  const load = async () => {
    setLoading(true);
    setFailed(false);
    const response = await restaurantApi.getAll({ limit: 100 });
    setRestaurants(response?.restaurants || []);
    setFailed(response?.success === false);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => setInput(query), [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter((r) =>
      [r.restaurant_name, r.cuisine_type, r.city, r.description].some((v) => v?.toLowerCase().includes(q))
    );
  }, [restaurants, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateParams = (next) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(next).forEach(([k, v]) => (v ? (params[k] = String(v)) : delete params[k]));
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ q: input.trim(), page: '' });
  };

  const goToPage = (p) => {
    updateParams({ page: p > 1 ? p : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-custom py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Restaurants</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Order from the best desi kitchens in town</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6" role="search">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name, cuisine or city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Search restaurants"
            className="input-field pl-11 rounded-xl"
          />
        </div>
        <button type="submit" className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium">
          Search
        </button>
      </form>

      {query && (
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {filtered.length} result{filtered.length === 1 ? '' : 's'} for
          </span>
          <button
            onClick={() => updateParams({ q: '', page: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
          >
            “{query}” <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        <CardGridSkeleton count={8} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" />
      ) : failed ? (
        <EmptyState icon="😅" title="Could not load restaurants" text="Please check your connection and try again." onAction={load} actionLabel="Retry" />
      ) : visible.length === 0 ? (
        <EmptyState icon="🏪" title="No restaurants found" text={query ? 'Try a different search.' : 'Check back soon.'} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {visible.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
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
