// src/components/home/BlogSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import { blogPosts } from '../../data/blogPosts';

export const BlogCard = ({ post, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
  >
    <Link to={`/blog/${post.id}`} className="block">
      <img src={post.image} alt={post.title} loading="lazy" className="w-full h-48 sm:h-56 object-cover" />
    </Link>
    <div className="p-5 sm:p-6 flex flex-col flex-1">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="inline-flex items-center gap-1">
          <FiCalendar className="w-3 h-3" />
          {post.date}
        </span>
        <span className="inline-flex items-center gap-1">
          <FiUser className="w-3 h-3" />
          {post.author}
        </span>
      </div>
      <span className="self-start text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
        {post.category}
      </span>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2">{post.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
      <Link
        to={`/blog/${post.id}`}
        className="mt-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1"
      >
        Read More
        <FiArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.article>
);

const BlogSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-white dark:bg-gray-800">
      <div className="container-custom">
        <div className="section-header">
          <div>
            <h2 className="section-title">📝 Food Blog</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Latest food tips, reviews, and recipes</p>
          </div>
          <Link
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 shrink-0"
          >
            View All Posts
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
