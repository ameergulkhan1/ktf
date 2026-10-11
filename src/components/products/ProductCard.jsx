// src/components/products/ProductCard.jsx
// The one product card used by the home page, the products list and search results.
// Those used to be three different cards: one's cart button only showed a "Added to
// cart!" toast without adding anything, and the wishlist hearts never saved.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, formatRating, toNumber } from '../../utils/format';

const ProductCard = ({ product, layout = 'grid' }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggle } = useWishlist();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const id = product.id;
  const name = product.product_name || product.name || 'Product';
  const price = toNumber(product.price);
  const comparePrice = toNumber(product.compare_price || product.original_price);
  const onSale = comparePrice > price;
  const rating = formatRating(product.average_rating || product.rating);
  const stock = toNumber(product.stock_quantity ?? product.stock);
  const inStock = stock > 0;
  const image = !imageFailed && (product.image || product.image_url || product.images?.[0]?.image_url);
  const saved = isInWishlist(id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only customer accounts can order');
      return;
    }
    setAdding(true);
    try {
      await addItem(id, 1, price, name);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  const isList = layout === 'list';

  return (
    <Link
      to={`/products/${id}`}
      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700 overflow-hidden flex ${
        isList ? 'flex-row' : 'flex-col'
      }`}
    >
      <div className={`relative bg-gray-100 dark:bg-gray-700 flex-shrink-0 ${isList ? 'w-28 sm:w-44' : 'aspect-[4/3]'}`}>
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-blue-500 to-blue-700">🍽️</div>
        )}

        {onSale && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">SALE</span>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 shadow hover:scale-110 transition-transform"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={saved}
        >
          <FiHeart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>

        {rating && !isList && (
          <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 text-white text-xs font-semibold">
            <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {rating}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {name}
        </h3>
        {product.description && (
          <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ${isList ? 'line-clamp-2' : 'line-clamp-1'}`}>
            {product.description}
          </p>
        )}
        {product.vendor_name && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{product.vendor_name}</p>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">{formatPrice(price)}</p>
            {onSale && <p className="text-xs text-gray-400 line-through whitespace-nowrap">{formatPrice(comparePrice)}</p>}
            {!inStock ? (
              <p className="text-xs font-medium text-red-600">Out of stock</p>
            ) : stock <= 5 ? (
              <p className="text-xs font-medium text-amber-600">Only {stock} left</p>
            ) : null}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className="flex-shrink-0 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl shadow-sm transition-colors"
            aria-label={`Add ${name} to cart`}
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
