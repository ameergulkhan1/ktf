// src/pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedRestaurants from '../components/home/FeaturedRestaurants';
import PopularProducts from '../components/home/PopularProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import HowItWorks from '../components/home/HowItWorks';
import BlogSection from '../components/home/BlogSection';
import SpecialOffers from '../components/home/SpecialOffers';
import StatsSection from '../components/home/StatsSection';
// import DownloadApp from '../components/home/DownloadApp';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <StatsSection />
      <CategorySection />
      <SpecialOffers />
      <PopularProducts />
      <FeaturedRestaurants />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <BlogSection />
      {/* <DownloadApp /> */}
    </motion.div>
  );
};

export default HomePage;