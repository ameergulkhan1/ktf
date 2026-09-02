// src/hooks/useVendor.js
import { useState, useEffect, useCallback, useRef } from 'react';
import vendorApi from '../api/vendorApi';
import toast from 'react-hot-toast';

export const useVendor = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, available: 0 });
  const [wallet, setWallet] = useState({ balance: 0, pending: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const fetchedRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await vendorApi.getProfile();
      if (mounted.current && response?.success) {
        setProfile(response.vendor || response.data);
      }
      return response;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return { success: true, vendor: null };
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await vendorApi.getProducts();
      console.log('📥 Fetch products response:', response);
      if (mounted.current && response?.success) {
        const productData = response.products || response.data || [];
        setProducts(productData);
      }
      return response;
    } catch (err) {
      console.error('Error fetching products:', err);
      return { success: true, products: [] };
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await vendorApi.getOrders();
      if (mounted.current && response?.success) {
        setOrders(response.orders || response.data || []);
      }
      return response;
    } catch (err) {
      console.error('Error fetching orders:', err);
      return { success: true, orders: [] };
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const response = await vendorApi.getEarnings();
      if (mounted.current && response?.success) {
        setEarnings(response.earnings || response.data || { total: 0, pending: 0, available: 0 });
      }
      return response;
    } catch (err) {
      console.error('Error fetching earnings:', err);
      return { success: true, earnings: { total: 0, pending: 0, available: 0 } };
    }
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const response = await vendorApi.getWallet();
      if (mounted.current && response?.success) {
        setWallet(response.wallet || response.data || { balance: 0, pending: 0, totalEarned: 0 });
      }
      return response;
    } catch (err) {
      console.error('Error fetching wallet:', err);
      return { success: true, wallet: { balance: 0, pending: 0, totalEarned: 0 } };
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const forceComplete = setTimeout(() => {
      if (mounted.current) {
        console.log('⏰ Force completing vendor loading');
        setLoading(false);
      }
    }, 5000);

    const loadData = async () => {
      try {
        console.log('🚀 Loading vendor data...');
        setLoading(true);
        setError(null);

        // Load data sequentially to prevent overwhelming the server
        await fetchProfile();
        await fetchProducts();
        await fetchOrders();
        await fetchEarnings();
        await fetchWallet();

        console.log('✅ Vendor data loaded successfully');
      } catch (err) {
        console.warn('Error loading vendor data:', err);
        setError(err.message);
      } finally {
        if (mounted.current) {
          console.log('✅ Setting loading to false');
          setLoading(false);
          clearTimeout(forceComplete);
        }
      }
    };

    loadData();

    return () => {
      mounted.current = false;
      clearTimeout(forceComplete);
    };
  }, [fetchProfile, fetchProducts, fetchOrders, fetchEarnings, fetchWallet]);

  const withdraw = useCallback(async (data) => {
    try {
      const response = await vendorApi.withdraw(data);
      if (response?.success) {
        await fetchWallet();
        toast.success('Withdrawal request submitted successfully');
      }
      return response;
    } catch (err) {
      toast.error('Failed to submit withdrawal request');
      return { success: false, message: err.message };
    }
  }, [fetchWallet]);

  const updateProfile = useCallback(async (data) => {
    try {
      const response = await vendorApi.updateProfile(data);
      if (response?.success) {
        setProfile(response.vendor || response.data);
        toast.success('Profile updated successfully');
      }
      return response;
    } catch (err) {
      toast.error('Failed to update profile');
      return { success: false, message: err.message };
    }
  }, []);

  return {
    profile,
    products,
    orders,
    earnings,
    wallet,
    loading,
    error,
    fetchProfile,
    refetchProfile: fetchProfile,
    fetchProducts,
    refetchProducts: fetchProducts,
    fetchOrders,
    refetchOrders: fetchOrders,
    fetchEarnings,
    refetchEarnings: fetchEarnings,
    fetchWallet,
    refetchWallet: fetchWallet,
    updateProfile,
    withdraw
  };
};

export const useVendorEarnings = (userId) => {
  const [data, setData] = useState({ total: 0, monthly: 0, weekly: 0, pending: 0, history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    vendorApi.getEarnings().then(res => {
      if (active && res) {
        setData(res.earnings || res.data || { total: 0, monthly: 0, weekly: 0, pending: 0, history: [] });
        setIsLoading(false);
      }
    }).catch(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [userId]);

  return { data, isLoading };
};

export const useCreateVendor = () => {
  return {
    mutateAsync: async (data) => {
      return await vendorApi.updateProfile(data);
    }
  };
};

export default useVendor;