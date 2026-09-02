// src/hooks/useProducts.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { productApi } from '../api/productApi';

const cache = new Map();
const CACHE_DURATION = 60000;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const fetchedRef = useRef(false);
  const timeoutRef = useRef(null);

  // ✅ Fetch regular products
  const fetchProducts = useCallback(async (params = {}, forceRefresh = false) => {
    const cacheKey = JSON.stringify(params);
    
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached products');
        setProducts(cached.data);
        setLoading(false);
        return { success: true, products: cached.data };
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching products with params:', params);
      
      const response = await productApi.getAll(params);
      console.log('📥 Products response:', response);
      
      if (mounted.current) {
        if (response?.success) {
          const data = response.products || response.data || [];
          setProducts(data);
          cache.set(cacheKey, { data, timestamp: Date.now() });
        } else {
          setProducts([]);
          setError(null);
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      if (mounted.current) {
        setProducts([]);
        setError(null);
      }
      return { success: true, products: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Fetch featured products
  const fetchFeatured = useCallback(async (limit = 4, forceRefresh = false) => {
    const cacheKey = `featured-${limit}`;
    
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached featured products');
        setProducts(cached.data);
        setLoading(false);
        return { success: true, products: cached.data };
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching featured products with limit:', limit);
      
      const response = await productApi.getFeatured(limit);
      console.log('📥 Featured products response:', response);
      
      if (mounted.current) {
        if (response?.success) {
          const data = response.products || response.data || [];
          setProducts(data);
          cache.set(cacheKey, { data, timestamp: Date.now() });
        } else {
          setProducts([]);
          setError(null);
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Error fetching featured products:', err);
      if (mounted.current) {
        setProducts([]);
        setError(null);
      }
      return { success: true, products: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Fetch products by category
  const fetchByCategory = useCallback(async (category, params = {}, forceRefresh = false) => {
    const cacheKey = `category-${category}-${JSON.stringify(params)}`;
    
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached category products');
        setProducts(cached.data);
        setLoading(false);
        return { success: true, products: cached.data };
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching products by category:', category, params);
      
      const response = await productApi.getByCategory(category, params);
      console.log('📥 Category products response:', response);
      
      if (mounted.current) {
        if (response?.success) {
          const data = response.products || response.data || [];
          setProducts(data);
          cache.set(cacheKey, { data, timestamp: Date.now() });
        } else {
          setProducts([]);
          setError(null);
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Error fetching category products:', err);
      if (mounted.current) {
        setProducts([]);
        setError(null);
      }
      return { success: true, products: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Search products
  const searchProducts = useCallback(async (query, params = {}, forceRefresh = false) => {
    const cacheKey = `search-${query}-${JSON.stringify(params)}`;
    
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached search results');
        setProducts(cached.data);
        setLoading(false);
        return { success: true, products: cached.data };
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Searching products:', query, params);
      
      const response = await productApi.search(query, params);
      console.log('📥 Search response:', response);
      
      if (mounted.current) {
        if (response?.success) {
          const data = response.products || response.data || [];
          setProducts(data);
          cache.set(cacheKey, { data, timestamp: Date.now() });
        } else {
          setProducts([]);
          setError(null);
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Error searching products:', err);
      if (mounted.current) {
        setProducts([]);
        setError(null);
      }
      return { success: true, products: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    mounted.current = true;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Force loading to complete after 2 seconds as safety
    timeoutRef.current = setTimeout(() => {
      if (mounted.current) {
        setLoading(false);
      }
    }, 2000);
    
    // Start fetch after 500ms
    const fetchTimer = setTimeout(() => {
      fetchProducts({ limit: 4, sort: 'popular' });
    }, 500);
    
    return () => {
      mounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(fetchTimer);
    };
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    fetchProducts,
    fetchFeatured,
    fetchByCategory,
    searchProducts
  };
};