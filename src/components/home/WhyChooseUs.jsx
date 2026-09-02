// src/components/home/WhyChooseUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiClock, FiDollarSign, FiSmile } from 'react-icons/fi';

const features = [
  {
    icon: FiShield,
    title: 'Quality Assurance',
    description: 'We ensure every meal meets our high quality standards',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: FiClock,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery to your doorstep',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    icon: FiDollarSign,
    title: 'Best Prices',
    description: 'Competitive prices and great deals every day',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    icon: FiSmile,
    title: 'Happy Customers',
    description: 'Thousands of satisfied customers across the country',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose Us
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            We make food delivery easy, fast, and reliable
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 text-center transition-shadow hover:shadow-xl"
            >
              <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`${feature.color} text-2xl`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;