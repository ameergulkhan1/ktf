import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// Mock data for demonstration
const wishlistItems = [];

const WishlistPage = () => {
  if (wishlistItems.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeartIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Save your favorite items here!</p>
          <Link to="/products" className="btn-primary inline-block mt-6">
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
              <p className="text-primary font-bold"></p>
              <button className="btn-primary w-full mt-2 text-sm">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
