// src/api/axiosConfig.js
import axios from 'axios';
import toast from 'react-hot-toast';

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

// ✅ Flag to prevent multiple logout triggers
let isLoggingOut = false;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔑 Token present: ${!!token}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ Auth header set for ${config.url}`);
    } else {
      console.log(`⚠️ No token found for ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`❌ Response error: ${status} ${url}`);
    
    // ✅ Handle 401 - but don't show toast immediately
    if (status === 401) {
      console.error('🔒 401 Unauthorized');
      
      // ✅ Check if this is a vendor API call that failed
      const isVendorCall = url?.includes('/vendors/');
      
      // ✅ Only logout if not already logging out and not a vendor call (which might need token refresh)
      if (!isLoggingOut && !isVendorCall) {
        isLoggingOut = true;
        
        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Remove auth header
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // ✅ Only show toast and redirect if not on login page
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
            isLoggingOut = false;
          }, 1000);
        } else {
          isLoggingOut = false;
        }
      } else {
        // ✅ For vendor calls, just return error without logout
        console.log('⏳ Vendor call returned 401 - will retry with new token');
      }
    }

    if (status === 404) {
      console.error('❌ 404 Error:', url);
    }

    if (status >= 500) {
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