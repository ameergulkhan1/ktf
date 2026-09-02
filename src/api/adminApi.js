// src/api/adminApi.js - Add cache clearing
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// ✅ Cache for admin requests
const adminCache = new Map();

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    
    console.log('🚀 Admin API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => {
    console.log('📦 Admin API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
    // ✅ Clear cache for vendor endpoints after mutations
    if (response.config.method?.toLowerCase() === 'put' || 
        response.config.method?.toLowerCase() === 'post' ||
        response.config.method?.toLowerCase() === 'delete') {
      // Clear vendor cache
      const vendorKeys = [...adminCache.keys()].filter(key => key.includes('/vendors'));
      vendorKeys.forEach(key => adminCache.delete(key));
      console.log('🧹 Cleared vendor cache');
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Admin API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      toast.error('Session expired. Please login again.');
    }
    
    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'Permission denied');
    }
    
    if (error.response?.status === 404) {
      toast.error(error.response?.data?.message || 'Resource not found');
    }
    
    return Promise.reject(error);
  }
);

export default adminApi;