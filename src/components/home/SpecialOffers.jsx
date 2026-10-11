// src/components/home/SpecialOffers.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { offers } from '../../data/offers';

export const OfferCard = ({ offer, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="relative rounded-2xl overflow-hidden group h-56 sm:h-64"
  >
    <img
      src={offer.image}
      alt={offer.title}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className={`absolute inset-0 bg-gradient-to-t ${offer.bg} opacity-80`} />
    <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
          {offer.discount}
        </span>
        {offer.badge && (
          <span className="bg-yellow-400/90 px-3 py-1 rounded-full text-gray-900 text-sm font-semibold">{offer.badge}</span>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white">{offer.title}</h3>
      <p className="text-white/90 text-sm mt-1">{offer.description}</p>
      <Link
        to={offer.link}
        className="mt-4 bg-white text-gray-900 px-5 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors w-fit inline-flex items-center gap-2"
      >
        Order Now
        <FiArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
);

const SpecialOffers = () => {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
      <div className="container-custom">
        <div className="section-header">
          <div>
            <h2 className="section-title">🎉 Special Offers</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Don&apos;t miss out on these amazing desi deals</p>
          </div>
          <Link
            to="/offers"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 shrink-0"
          >
            View All Offers
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
