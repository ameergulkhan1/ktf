// src/pages/ProductsPage.jsx
// Everything (search text, category, sort, page) now lives in the URL. Previously the
// search box drove a fetch on every keystroke and the whole page was replaced by a loading
// skeleton, so the input lost focus after each letter; the sort options also sent values
// (price_low/price_high) the API does not recognise, so price sorting did nothing.
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { productApi } from '../api/productApi';
import ProductCard from '../components/products/ProductCard';
import { CardGridSkeleton, EmptyState } from '../components/common/States';

const PAGE_SIZE = 12;

const CATEGORIES = ['Biryani', 'Nihari', 'BBQ', 'Karhai', 'Curry', 'Pulao', 'Bread', 'Street Food', 'Desserts', 'Drinks', 'Beverages'];

const SORTS = [
  ['popular', 'Popular'],
  ['newest', 'Newest'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['rating', 'Highest Rated'],
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'popular';
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [input, setInput] = useState(query);

  useEffect(() => setInput(query), [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const request = query
      ? productApi.search(query, { page, limit: PAGE_SIZE })
      : productApi.getAll({ page, limit: PAGE_SIZE, sort, ...(category && { category }) });

    request.then((response) => {
      if (!active) return;
      const list = response?.products || [];
      setProducts(list);
      const p = response?.pagination || {};
      setTotalPages(p.totalPages || 1);
      setTotalItems(p.total ?? list.length);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [page, category, sort, query]);

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

  const hasFilters = Boolean(category || query || sort !== 'popular');
  const title = query ? `Results for “${query}”` : category ? `${category}` : 'All Products';

  const pageNumbers = (() => {
    const count = Math.min(totalPages, 5);
    let start = Math.max(1, Math.min(page - 2, totalPages - count + 1));
    return Array.from({ length: count }, (_, i) => start + i);
  })();

  return (
    <div className="container-custom py-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {loading ? 'Loading…' : `${totalItems} product${totalItems === 1 ? '' : 's'} found`}
        </p>
      </div>

      {/* Search + sort + view */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2" role="search">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search biryani, nihari, BBQ..."
              aria-label="Search products"
              className="input-field pl-11 rounded-xl"
            />
          </div>
          <button type="submit" className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium">
            Search
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value === 'popular' ? '' : e.target.value, page: '' })}
            disabled={Boolean(query)}
            aria-label="Sort products"
            title={query ? 'Sorting is not available for search results' : undefined}
            className="input-field rounded-xl flex-1 md:w-52 disabled:opacity-60"
          >
            {SORTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
            {[
              ['grid', FiGrid, 'Grid view'],
              ['list', FiList, 'List view'],
            ].map(([mode, Icon, label]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-label={label}
                aria-pressed={viewMode === mode}
                className={`p-2 rounded-lg transition text-gray-700 dark:text-gray-200 ${
                  viewMode === mode ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-white/60 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category chips - scroll sideways on phones */}
      {!query && (
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {['', ...CATEGORIES].map((cat) => (
            <button
              key={cat || 'all'}
              onClick={() => updateParams({ category: cat, page: '' })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${
                category === cat
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500'
              }`}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
      )}

      {hasFilters && (
        <button
          onClick={() => setSearchParams({})}
          className="inline-flex items-center gap-1 mb-5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FiX className="w-4 h-4" />
          Clear all filters
        </button>
      )}

      {loading ? (
        <CardGridSkeleton count={8} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
      ) : products.length === 0 ? (
        <EmptyState icon="🔍" title="No products found" text="Try a different search or category." />
      ) : (
        <div
          className={
            viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} layout={viewMode} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <nav className="flex justify-center items-center gap-1 sm:gap-2 mt-8" aria-label="Pagination">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => goToPage(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`min-w-[2.5rem] px-3 py-2 rounded-lg ${
                n === page
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default ProductsPage;
