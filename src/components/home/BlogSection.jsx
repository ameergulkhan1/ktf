// src/components/home/BlogSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

const blogPosts = [
  {
    id: 1,
    title: '10 Healthy Food Habits to Start Today',
    excerpt: 'Discover simple and effective ways to improve your eating habits for a healthier lifestyle.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Nutrition',
    date: 'Dec 15, 2024',
    category: 'Health',
  },
  {
    id: 2,
    title: 'The Best Pizza Places in Town',
    excerpt: 'Explore our top picks for the most delicious and authentic pizza restaurants near you.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    author: 'Food Critic',
    date: 'Dec 12, 2024',
    category: 'Reviews',
  },
  {
    id: 3,
    title: 'Cooking Tips for Beginners',
    excerpt: 'Essential kitchen tips and techniques to help you cook like a pro from day one.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80',
    author: 'Chef Mike',
    date: 'Dec 10, 2024',
    category: 'Cooking',
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              📝 Food Blog
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Latest food tips, reviews, and recipes
            </p>
          </div>
          <Link
            to="/blog"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1"
          >
            View All Posts
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <span className="inline-flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    {post.author}
                  </span>
                </div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium inline-flex items-center gap-1"
                >
                  Read More
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;