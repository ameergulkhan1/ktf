// src/pages/info/BlogPage.jsx
import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { BlogCard } from '../../components/home/BlogSection';
import { blogPosts } from '../../data/blogPosts';

const BlogPage = () => (
  <>
    <PageHeader title="Food Blog" subtitle="Food tips, restaurant picks and recipes from the KTF kitchen." />
    <div className="container-custom py-10 sm:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  </>
);

export default BlogPage;
