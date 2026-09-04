// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart } from 'react-icons/fi';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23e5e7eb"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="20" fill="%239ca3af" text-anchor="middle"%3EProduct%3C/text%3E%3C/svg%3E';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addItem(
      product.id,
      1,
      parseFloat(product.price) || 0,
      product.product_name || product.name
    );
  };

  const getStockStatus = () => {
    const stock = product.stock_quantity || product.stock || 0;
    if (stock > 10) return { text: 'In Stock', color: 'text-emerald-600' };
    if (stock > 0) return { text: `${stock} left`, color: 'text-amber-600' };
    return { text: 'Out of Stock', color: 'text-red-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <img
            src={product.image || product.images?.[0]?.image_url || PLACEHOLDER_IMAGE}
            alt={product.product_name || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          
          {product.compare_price && product.compare_price > product.price && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded shadow-md">
              SALE
            </div>
          )}

          {(product.product_type === 'vendor') && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 text-xs font-bold rounded shadow-md">
              🇵🇰 Desi
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {product.product_name || product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {product.description || 'Delicious desi product!'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${parseFloat(product.price || 0).toFixed(2)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ${parseFloat(product.compare_price).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-yellow-400 w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.average_rating || product.rating || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {product.sold && (
              <span className="text-xs text-gray-400">{product.sold} sold</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;