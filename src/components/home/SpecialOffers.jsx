// src/components/home/SpecialOffers.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiArrowRight } from 'react-icons/fi';

const offers = [
  {
    id: 1,
    title: 'Biryani Special',
    description: 'Get 30% off on all Biryani orders this weekend',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    bg: 'from-blue-600 to-indigo-700',
    discount: '30% OFF',
    badge: '🇵🇰 Desi',
  },
  {
    id: 2,
    title: 'BBQ Feast',
    description: 'Buy 2 get 1 free on all BBQ platters',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    bg: 'from-blue-700 to-purple-700',
    discount: 'Buy 2 Get 1',
    badge: '🔥 Hot Deal',
  },
  {
    id: 3,
    title: 'Nihari Night',
    description: 'Free delivery on all Nihari orders above $15',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    bg: 'from-indigo-600 to-blue-700',
    discount: 'Free Delivery',
    badge: '🇵🇰 Special',
  },
];

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              🎉 Special Offers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Don't miss out on these amazing desi deals
            </p>
          </div>
          <Link
            to="/offers"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          >
            View All Offers
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${offer.bg} opacity-80`} />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                    {offer.discount}
                  </span>
                  {offer.badge && (
                    <span className="bg-yellow-400/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-900 text-sm font-semibold">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                <p className="text-white/90 text-sm mt-1">{offer.description}</p>
                <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors w-fit flex items-center gap-2">
                  Order Now 🇵🇰
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;