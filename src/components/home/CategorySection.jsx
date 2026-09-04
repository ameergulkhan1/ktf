// src/components/home/CategorySection.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productApi } from '../../api/productApi';

const categories = [
  { id: 1, name: 'Biryani', icon: '🍛', bg: 'bg-amber-100 dark:bg-amber-900/30', slug: 'biryani', category: 'Biryani' },
  { id: 2, name: 'Nihari', icon: '🥘', bg: 'bg-orange-100 dark:bg-orange-900/30', slug: 'nihari', category: 'Nihari' },
  { id: 3, name: 'BBQ', icon: '🍖', bg: 'bg-red-100 dark:bg-red-900/30', slug: 'bbq', category: 'BBQ' },
  { id: 4, name: 'Bread', icon: '🫓', bg: 'bg-yellow-100 dark:bg-yellow-900/30', slug: 'bread', category: 'Bread' },
  { id: 5, name: 'Pulao', icon: '🍚', bg: 'bg-green-100 dark:bg-green-900/30', slug: 'pulao', category: 'Pulao' },
  { id: 6, name: 'Desserts', icon: '🍰', bg: 'bg-purple-100 dark:bg-purple-900/30', slug: 'desserts', category: 'Desserts' },
  { id: 7, name: 'Beverages', icon: '🥤', bg: 'bg-blue-100 dark:bg-blue-900/30', slug: 'beverages', category: 'Beverages' },
  { id: 8, name: 'Street Food', icon: '🌯', bg: 'bg-emerald-100 dark:bg-emerald-900/30', slug: 'street-food', category: 'Street Food' },
  { id: 9, name: 'Karhai', icon: '🍲', bg: 'bg-orange-100 dark:bg-orange-900/30', slug: 'karhai', category: 'Karhai' },
  { id: 10, name: 'Pakistani', icon: '🇵🇰', bg: 'bg-green-100 dark:bg-green-900/30', slug: 'pakistani', category: 'Pakistani' },
];

const CategorySection = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch product counts by category
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll({ limit: 100 });
        
        if (response?.success && response?.products) {
          const counts = {};
          const products = response.products || [];
          
          // Count products by category
          categories.forEach(cat => {
            const count = products.filter(p => 
              p.category?.toLowerCase() === cat.category?.toLowerCase() ||
              p.category?.toLowerCase().includes(cat.slug) ||
              p.sub_category?.toLowerCase().includes(cat.slug)
            ).length;
            counts[cat.id] = count;
          });
          
          setCategoryCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  // Handle category click - navigate to search with category filter
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.category)}`);
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🇵🇰 Browse Categories</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Explore authentic Pakistani cuisine
              </p>
            </div>
            <Link 
              to="/products" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline text-sm font-medium transition-colors"
            >
              View All Products →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="group text-center block">
                  <div className={`${category.bg} w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg relative`}>
                    {category.icon}
                    {categoryCounts[category.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                        {categoryCounts[category.id]}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {categoryCounts[category.id] || 0} products
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;