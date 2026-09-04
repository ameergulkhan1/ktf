// src/components/home/StatsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiStar, FiTruck } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, value: '50K+', label: 'Happy Customers' },
  { icon: FiShoppingBag, value: '100K+', label: 'Orders Delivered' },
  { icon: FiStar, value: '4.8★', label: 'Average Rating' },
  { icon: FiTruck, value: '500+', label: 'Desi Restaurants' },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
                <stat.icon className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;