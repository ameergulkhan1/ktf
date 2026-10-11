// src/pages/WishlistPage.jsx
// Previously rendered a hardcoded empty array ("Mock data for demonstration"), so saved
// items never appeared. It now shows the customer's wishlist from /api/wishlist.
import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';
import { CardGridSkeleton, EmptyState } from '../components/common/States';

const WishlistPage = () => {
  const { items, loading } = useWishlist();

  // Wishlist rows carry the product fields under slightly different names.
  const products = items
    .filter((item) => item.product_id)
    .map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock,
    }));

  return (
    <div className="container-custom py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6">
        <HeartIcon className="h-7 w-7 text-red-500" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          {!loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {products.length} saved item{products.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
      </div>

      {loading && products.length === 0 ? (
        <CardGridSkeleton count={4} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
      ) : products.length === 0 ? (
        <EmptyState
          icon="💙"
          title="Your wishlist is empty"
          text="Tap the heart on any dish to save it here."
          actionTo="/products"
          actionLabel="Browse products"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
