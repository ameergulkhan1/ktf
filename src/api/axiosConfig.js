// src/api/axiosConfig.js
import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ HARDCODED URL - THIS FIXES THE 404 ERROR
const API_URL = 'http://localhost:5000/api';

console.log('🔍 API_URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.error('Session expired. Please login again.');
        setTimeout(() => window.location.href = '/login', 1000);
      }
    }

    if (error.response?.status === 404) {
      console.error('❌ 404 Error:', error.config?.url);
      // Don't show toast for 404s
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
      toast.error('Server error. Please try again later.');
    }

    if (error.request && !error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;