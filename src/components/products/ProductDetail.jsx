// src/components/products/ProductDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiClock, FiTruck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

const safeString = (value, fallback = '') => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return fallback;
  }
  return String(value);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const fetchRef = useRef(null);
  const { addItem } = useCart();

  // ✅ Fetch product when ID changes
  useEffect(() => {
    // Cancel any ongoing fetch
    if (fetchRef.current) {
      fetchRef.current = null;
    }

    // Reset state
    setProduct(null);
    setLoading(true);
    setError(null);
    setQuantity(1);

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        console.log('📤 Fetching product ID:', id);
        const response = await productApi.getById(id);
        console.log('📥 Product response:', response);
        
        if (!isMounted) return;
        
        if (response && response.success && response.product) {
          setProduct(response.product);
          console.log('✅ Product loaded:', response.product.name);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        if (isMounted) {
          setError('Unable to load product details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Small delay to ensure state reset
    const timer = setTimeout(() => {
      if (id) {
        fetchProduct();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (fetchRef.current) {
        fetchRef.current = null;
      }
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const response = await addItem(product.id, quantity, price, name);
    if (response?.success) {
      toast.success(`Added ${quantity} ${name} to cart!`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96" />
            </div>
            <div className="lg:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition inline-flex items-center gap-2">
            <FiChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 border border-gray-300 hover:border-red-600 text-gray-700 hover:text-red-600 rounded-xl transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const price = safeNumber(product.price);
  const originalPrice = safeNumber(product.original_price || product.compare_price);
  const rating = safeNumber(product.rating || product.average_rating);
  const reviews = safeNumber(product.total_reviews);
  const stock = safeNumber(product.stock || product.stock_quantity, 10);
  const name = safeString(product.name, 'Product');
  const description = safeString(product.description, '');
  const category = safeString(product.category, '');
  const image = product.image || product.image_url || null;
  const inStock = stock > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-red-600 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-red-600 transition">Products</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden h-96">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-red-500 to-red-700 text-white">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-6">
          {category && (
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-400 rounded-full">
              {category}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {rating > 0 ? rating.toFixed(1) : 'New'}
              </span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 dark:text-gray-400">{reviews} reviews</span>
            <span className="text-gray-400">|</span>
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `✓ In Stock (${stock} available)` : '✗ Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {originalPrice > 0 && (
              <span className="text-xl text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {description && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-l-lg"
              >
                -
              </button>
              <span className="px-6 py-2 text-center min-w-[50px]">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-r-lg"
                disabled={!inStock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl transition flex items-center justify-center gap-2 font-semibold"
            >
              <FiShoppingCart className="w-5 h-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="px-6 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition flex items-center gap-2">
              <FiHeart className="w-5 h-5" />
              Wishlist
            </button>
            <button className="px-6 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition flex items-center gap-2">
              <FiShare2 className="w-5 h-5" />
              Share
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <FiTruck className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Free Delivery</p>
                <p className="text-sm">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <FiClock className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Fast Delivery</p>
                <p className="text-sm">2-4 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <FiShield className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                <p className="text-sm">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;