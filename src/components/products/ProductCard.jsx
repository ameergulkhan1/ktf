// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23e5e7eb"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="20" fill="%239ca3af" text-anchor="middle"%3EProduct%3C/text%3E%3C/svg%3E';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ? Check if user is logged in
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

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <img
            src={product.image || product.images?.[0]?.image_url || PLACEHOLDER_IMAGE}
            alt={product.product_name || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          
          {product.compare_price && product.compare_price > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              SALE
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {product.product_name || product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {product.description || 'Delicious product!'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                
              </span>
              {product.compare_price && (
                <span className="text-sm text-gray-400 line-through">
                  
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">?</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.average_rating || 0}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            <span>??</span> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;