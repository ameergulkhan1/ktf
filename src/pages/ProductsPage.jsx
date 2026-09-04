// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { FiSearch, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiStar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Safe number formatter
const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

// Safe string getter
const safeString = (value, fallback = '') => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return fallback;
  }
  return String(value);
};

const ProductCard = ({ product }) => {
  // Safely extract all product data
  const id = product?.id || 0;
  const name = safeString(product?.name, 'Product');
  const price = safeNumber(product?.price);
  const originalPrice = safeNumber(product?.original_price || product?.compare_price);
  const rating = safeNumber(product?.rating || product?.average_rating);
  const stock = safeNumber(product?.stock || product?.stock_quantity, 10);
  const discount = safeNumber(product?.discount);
  const image = product?.image || product?.image_url || null;
  const description = safeString(product?.description, '');

  return (
    <Link to={`/products/${id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              📦
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
          {rating > 0 && (
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-sm">
              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div>
              {originalPrice > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${price.toFixed(2)}
                </span>
              )}
              {stock <= 5 && stock > 0 && (
                <span className="text-xs text-amber-600 ml-2">Only {stock} left!</span>
              )}
              {stock === 0 && (
                <span className="text-xs text-red-500 ml-2">Out of stock</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toast.success('Added to cart!');
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg"
              disabled={stock === 0}
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8" />
      </div>
    </div>
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'popular';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: pagination.itemsPerPage,
          sort: sort,
          ...(category && { category }),
          ...(searchTerm && { q: searchTerm }),
        };

        const response = await productApi.getAll(params);
        
        if (response?.success) {
          const data = response.products || [];
          setProducts(data);
          if (response.pagination) {
            setPagination(prev => ({
              ...prev,
              currentPage: response.pagination.page || currentPage,
              totalPages: response.pagination.totalPages || 1,
              totalItems: response.pagination.total || data.length,
            }));
          }
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, category, sort, searchTerm]);

  const handlePageChange = (page) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...Object.fromEntries(searchParams), q: searchTerm, page: '1' });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort: newSort, page: '1' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🇵🇰 {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {pagination.totalItems} products found
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search biryani, nihari, BBQ..."
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition flex items-center gap-2 shadow-md"
          >
            <FiSearch className="w-4 h-4" />
            Search
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-white/50'}`}
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-white/50'}`}
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>

        {(category || searchTerm || sort !== 'popular') && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-400"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
          : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          
          {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;