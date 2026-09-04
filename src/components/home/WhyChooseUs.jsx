// src/components/home/WhyChooseUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiClock, FiDollarSign, FiHeart } from 'react-icons/fi';

const features = [
  {
    icon: FiShield,
    title: 'Authentic Desi Food',
    description: 'Real Pakistani flavors from trusted local restaurants',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: FiClock,
    title: 'Fast Delivery',
    description: 'Fresh and hot food delivered right to your doorstep',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    icon: FiDollarSign,
    title: 'Best Prices',
    description: 'Great deals on your favorite desi dishes',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    icon: FiHeart,
    title: 'Made with Love',
    description: 'Every dish prepared with traditional recipes and love',
    color: 'text-rose-600',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
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
            🇵🇰 Why Choose Us
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            We bring the authentic taste of Pakistan to your doorstep
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700/50"
            >
              <div className={`${feature.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`text-2xl ${feature.color}`} />
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