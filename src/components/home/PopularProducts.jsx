// src/components/home/PopularProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { productApi } from '../../api/productApi';
import ProductCard from '../products/ProductCard';
import { CardGridSkeleton, EmptyState } from '../common/States';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    productApi.getAll({ limit: 4, sort: 'popular' }).then((response) => {
      if (!active) return;
      setProducts(response?.products || []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Popular Products</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most loved items by our customers</p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium shrink-0"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <CardGridSkeleton count={4} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" />
        ) : products.length === 0 ? (
          <EmptyState icon="🛍️" title="No products available" text="Check back later for new products." />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
