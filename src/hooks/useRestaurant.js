// src/hooks/useRestaurant.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { restaurantApi } from '../api/restaurantApi';

const cache = new Map();
const CACHE_DURATION = 60000;

export const useRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const fetchedRef = useRef(false);
  const timeoutRef = useRef(null);

  const fetchRestaurants = useCallback(async (params = {}, forceRefresh = false) => {
    const cacheKey = JSON.stringify(params);
    
    // Check cache
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached restaurants');
        setRestaurants(cached.data);
        setLoading(false);
        return { success: true, restaurants: cached.data };
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching restaurants with params:', params);
      
      const response = await restaurantApi.getAll(params);
      console.log('📥 Restaurants response:', response);
      
      if (mounted.current) {
        if (response?.success) {
          const data = response.restaurants || response.data || [];
          setRestaurants(data);
          cache.set(cacheKey, { data, timestamp: Date.now() });
        } else {
          setRestaurants([]);
          setError(null);
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Error fetching restaurants:', err);
      if (mounted.current) {
        setRestaurants([]);
        setError(null);
      }
      return { success: true, restaurants: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getRestaurantById = useCallback(async (id) => {
    return restaurantApi.getById(id);
  }, []);

  const getMenu = useCallback(async (restaurantId, params) => {
    return restaurantApi.getMenu(restaurantId, params);
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // ✅ Force loading to complete after 2 seconds as safety
    timeoutRef.current = setTimeout(() => {
      if (mounted.current) {
        setLoading(false);
      }
    }, 2000);
    
    // ✅ Start fetch after 300ms
    const fetchTimer = setTimeout(() => {
      fetchRestaurants({ limit: 4 });
    }, 300);
    
    return () => {
      mounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(fetchTimer);
    };
  }, [fetchRestaurants]);

  return { restaurants, loading, error, fetchRestaurants, getRestaurantById, getMenu };
};

export const useRestaurants = useRestaurant;