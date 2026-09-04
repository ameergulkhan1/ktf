// src/components/home/HeroSection.jsx

import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  FiSearch,
  FiArrowRight,
  FiClock,
  FiTruck,
  FiStar,
} from 'react-icons/fi';

// Sub-components for better organization
const FloatingEmoji = ({ emoji, className, animation }) => (
  <motion.div
    animate={animation}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className={`absolute text-5xl sm:text-7xl opacity-30 pointer-events-none select-none ${className}`}
  >
    {emoji}
  </motion.div>
);

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-white/85">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
      <Icon className="text-xl text-yellow-300" />
    </div>
    <span className="text-sm font-semibold sm:text-base">{text}</span>
  </div>
);

const ImageCard = ({ image, index }) => {
  const getPositionClass = useCallback(() => {
    if (index === 0) return 'rotate-2';
    if (index === 1) return '-rotate-2 mt-10';
    return 'col-span-2 mx-auto w-[72%] -rotate-1';
  }, [index]);

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        rotate: index % 2 === 0 ? 1 : -1,
      }}
      transition={{ duration: 0.25 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl ${getPositionClass()}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          e.target.src = '/images/fallback-food.jpg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
      
      {/* Desi badge overlay */}
      {index === 0 && (
        <div className="absolute bottom-3 left-3 bg-yellow-400/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
          🇵🇰 Desi Flavor
        </div>
      )}
    </motion.div>
  );
};

const HeroSection = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized data with Pakistani/Desi food images
  const heroImages = useMemo(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85',
        alt: 'Delicious Biryani - Pakistani cuisine',
      },
      {
        src: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=85',
        alt: 'Fresh Nihari',
      },
      // {
      //   src: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=85',
      //   alt: 'Traditional Halwa Puri',
      // },
    ],
    []
  );

  const features = useMemo(
    () => [
      { icon: FiClock, text: 'Fast Delivery' },
      { icon: FiTruck, text: 'Free Shipping' },
      { icon: FiStar, text: 'Best Quality' },
    ],
    []
  );

  const customers = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `https://i.pravatar.cc/80?img=${i + 10}`),
    []
  );

  // Desi/Pakistani floating emojis
  const floatingEmojis = useMemo(
    () => [
      {
        emoji: '🍛',
        className: 'top-24 left-[5%]',
        animation: { y: [0, -20, 0], rotate: [0, 8, 0] },
      },
      {
        emoji: '🥘',
        className: 'bottom-24 right-[5%]',
        animation: { y: [0, 25, 0], rotate: [0, -8, 0] },
      },
      {
        emoji: '🍖',
        className: 'top-1/3 right-[22%]',
        animation: { y: [0, -15, 0], x: [0, 10, 0] },
      },
      {
        emoji: '🫓',
        className: 'bottom-1/3 left-[20%]',
        animation: { y: [0, 20, 0], rotate: [0, -10, 0] },
      },
      {
        emoji: '☕',
        className: 'top-1/2 left-[45%]',
        animation: { y: [0, -12, 0], x: [0, 8, 0] },
      },
    ],
    []
  );

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <section 
      className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900"
      aria-label="Hero section"
    >
      {/* Background Pattern - Desi inspired */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_25%),radial-gradient(circle_at_80%_80%,white_0,transparent_25%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
        
        {/* Pakistani flag subtle overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 600 400" className="w-full h-full">
            <rect width="600" height="400" fill="#01411C"/>
            <rect x="200" width="400" height="400" fill="#FFFFFF"/>
            <circle cx="300" cy="200" r="80" fill="#01411C"/>
            <circle cx="300" cy="200" r="60" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>

      {/* Floating Food Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {floatingEmojis.map((item, index) => (
          <FloatingEmoji
            key={index}
            emoji={item.emoji}
            className={item.className}
            animation={item.animation}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid min-h-[90vh] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-7"
          >
            {/* Status Badge - with Pakistani touch */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
            >
              <span 
                className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                aria-hidden="true"
              />
              <span>
                {user
                  ? `🇵🇰 Welcome back, ${user.name || 'User'}!`
                  : '🇵🇰 Authentic Pakistani Flavors Delivered'}
              </span>
            </motion.div>

            {/* Heading - with desi vibe */}
            <div>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-yellow-300 text-3xl sm:text-4xl md:text-5xl mb-2">
                  🇵🇰 Traditional Taste
                </span>
                <span className="relative block">
                  Delivered to You
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{
                      delay: 0.8,
                      duration: 0.7,
                      ease: 'easeOut',
                    }}
                    className="absolute -bottom-2 left-0 h-1 rounded-full bg-yellow-300"
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>

            {/* Description - desi food focused */}
            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Experience the rich flavors of Pakistani cuisine with fresh, aromatic biryani, sizzling BBQ, creamy nihari, and authentic desi dishes delivered to your doorstep.
              {!user && (
                <span className="font-semibold text-yellow-300">
                  {' '}
                  🎉 Get 20% off on your first desi feast!
                </span>
              )}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-xl" role="search">
              <label htmlFor="hero-search" className="sr-only">
                Search for food or restaurants
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Search for biryani, nihari, BBQ..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-2xl border border-white/20 bg-white px-6 py-4 pl-14 text-gray-900 shadow-2xl outline-none transition-all placeholder:text-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30"
                aria-label="Search for food or restaurants"
              />
              <FiSearch
                aria-hidden="true"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400"
              />
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/restaurants"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl sm:px-8 sm:py-4"
                aria-label="Start ordering food now"
              >
                Order Now 🇵🇰
                <FiArrowRight 
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-3.5 font-bold text-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl sm:px-8 sm:py-4"
                  aria-label="Sign up and get 20% discount"
                >
                  Sign Up & Save 20%
                </Link>
              )}

              <Link
                to="/vendor-register"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-6 py-3.5 font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:px-8 sm:py-4"
                aria-label="Register as a vendor"
              >
                Become a Vendor
              </Link>
            </div>

            {/* Trust Text */}
            <p className="text-sm text-white/60">
              🇵🇰 Trusted by thousands for authentic Pakistani flavors.
            </p>
          </motion.div>

          {/* Right Food Gallery - Desi focused */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            aria-label="Food gallery"
          >
            <div className="grid grid-cols-2 gap-5">
              {heroImages.map((image, index) => (
                <ImageCard key={image.src} image={image} index={index} />
              ))}
            </div>

            {/* Floating Delivery Card - Desi styled */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-5 -left-8 rounded-2xl border border-white/20 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur-md"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-2xl"
                  aria-hidden="true"
                >
                  🏍️
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Average delivery
                  </p>
                  <p className="font-bold text-gray-900">
                    30–40 minutes
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rating Card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -right-5 top-8 rounded-2xl border border-white/20 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2">
                <FiStar className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <div>
                  <p className="font-bold text-gray-900">4.9/5</p>
                  <p className="text-xs text-gray-500">Customer rating</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="border-t border-white/10 py-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:justify-between">
            {features.map((feature) => (
              <FeatureItem key={feature.text} icon={feature.icon} text={feature.text} />
            ))}

            {/* Happy Customers */}
            <div className="flex items-center gap-3 text-white/85">
              <div className="flex -space-x-3" aria-label="Happy customers">
                {customers.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`Happy customer ${index + 1}`}
                    loading="lazy"
                    className="h-9 w-9 rounded-full border-2 border-blue-700 object-cover sm:h-10 sm:w-10"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.jpg';
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold sm:text-base">
                <span className="text-yellow-300">10K+</span>{' '}
                happy customers
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);