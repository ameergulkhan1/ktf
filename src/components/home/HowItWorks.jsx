// src/components/home/HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiTruck } from 'react-icons/fi';

const steps = [
  {
    icon: FiSearch,
    title: 'Search & Explore',
    description: 'Browse through hundreds of restaurants and food items',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  {
    icon: FiShoppingCart,
    title: 'Order & Pay',
    description: 'Select your favorite food and pay securely online',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  {
    icon: FiTruck,
    title: 'Delivered Hot',
    description: 'Track your order and enjoy delicious food at your door',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Get your favorite food delivered in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
              )}
              <div className="relative inline-block">
                <div className={`${step.color} w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 relative`}>
                  <step.icon />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;