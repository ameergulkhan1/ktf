// src/components/home/PopularProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import { FiStar, FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SkeletonProductCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-56 bg-gray-200 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  </div>
);

const safe = (value, fallback = '') => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return fallback;
  }
  return value;
};

const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

const ProductCard = ({ product, user }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isWishlist, setIsWishlist] = useState(false);

  const id = product?.id || 0;
  const name = safe(product?.name, 'Product');
  const price = safeNumber(product?.price);
  const originalPrice = safeNumber(product?.original_price);
  const rating = safeNumber(product?.rating || product?.average_rating);
  const stock = safeNumber(product?.stock || product?.stock_quantity, 10);
  const sold = safeNumber(product?.sold);
  const discount = safeNumber(product?.discount);
  const imageUrl = product?.image_url || product?.image || null;
  const unit = safe(product?.unit);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    await addItem(id, 1, price, name);
  };

  const getStockText = () => {
    if (stock > 10) return { text: 'In Stock', color: 'text-emerald-600' };
    if (stock > 0) return { text: `Only ${stock} left`, color: 'text-amber-600' };
    return { text: 'Out of Stock', color: 'text-rose-600' };
  };

  const stockInfo = getStockText();

  return (
    <Link
      to={`/products/${id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block"
    >
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-6xl opacity-50">📦</span>
          </div>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
        >
          <FiHeart className={`w-4 h-4 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            -{discount}%
          </div>
        )}

        {rating > 0 && (
          <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div>
            {originalPrice > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </span>
            )}
            {unit && <span className="text-xs text-gray-500 dark:text-gray-400"> / {unit}</span>}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className={`text-xs font-medium ${stockInfo.color}`}>
            {stockInfo.text}
          </span>
          <span className="text-xs text-gray-400">{sold} sold</span>
        </div>
      </div>
    </Link>
  );
};

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        console.log('📤 Fetching products...');
        const response = await productApi.getAll({ limit: 4, sort: 'popular' });
        console.log('📥 Products response:', response);

        if (isActive) {
          if (response?.success) {
            setProducts(response.products || []);
          } else {
            setError(response?.message || 'Failed to load products');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        if (isActive) {
          setError(err.message || 'Unable to load products');
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchData, 100);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading && products.length > 0) {
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load products</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">🛍️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products available</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔥 Popular Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most loved items by our customers
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          View All
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} user={user} />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;