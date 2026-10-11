// src/pages/info/BlogPostPage.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import { BlogCard } from '../../components/home/BlogSection';
import { blogPosts, getBlogPost } from '../../data/blogPosts';

const BlogPostPage = () => {
  const { id } = useParams();
  const post = getBlogPost(id);

  if (!post) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">Back to the blog</Link>
      </div>
    );
  }

  const more = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="container-custom py-8 sm:py-12">
      <article className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6">
          <FiArrowLeft className="w-4 h-4" />
          All posts
        </Link>
        <span className="block w-fit text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full mb-3">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-4">
          <span className="inline-flex items-center gap-1"><FiCalendar className="w-4 h-4" />{post.date}</span>
          <span className="inline-flex items-center gap-1"><FiUser className="w-4 h-4" />{post.author}</span>
        </div>
        <img src={post.image} alt={post.title} className="w-full h-56 sm:h-96 object-cover rounded-2xl mt-6" />
        <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      {more.length > 0 && (
        <section className="max-w-5xl mx-auto mt-14">
          <h2 className="section-title mb-6">More from the blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {more.map((p, i) => (
              <BlogCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
