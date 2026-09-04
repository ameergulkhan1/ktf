// src/api/adminApi.js
import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Use the same base URL as other APIs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,  // ✅ This should be http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Cache for admin requests
const adminCache = new Map();

// Request interceptor
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    
    console.log('🚀 Admin API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => {
    console.log('📦 Admin API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
    // Clear cache for mutations
    if (['put', 'post', 'delete', 'patch'].includes(response.config.method?.toLowerCase())) {
      const keys = [...adminCache.keys()].filter(key => key.includes('/vendors') || key.includes('/restaurants'));
      keys.forEach(key => adminCache.delete(key));
      console.log('🧹 Cleared admin cache');
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Admin API Error:', {
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
        toast.error('Session expired. Please login again.');
      }
    }
    
    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'Permission denied');
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data);
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default adminApi;