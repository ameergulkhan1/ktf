// src/api/adminApi.js
import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Use the same base URL as other APIs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Cache for admin requests
const adminCache = new Map();

// Request interceptor
adminApiInstance.interceptors.request.use(
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
adminApiInstance.interceptors.response.use(
  (response) => {
    console.log('📦 Admin API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
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

// ============================================
// ADMIN API METHODS
// ============================================

// Auth
export const adminLogin = (email, password) => {
  return adminApiInstance.post('/admin/auth/login', { email, password });
};

export const adminLogout = () => {
  return adminApiInstance.post('/admin/auth/logout');
};

export const adminVerify = () => {
  return adminApiInstance.get('/admin/verify');
};

export const adminProfile = () => {
  return adminApiInstance.get('/admin/profile');
};

// Dashboard
export const getDashboardStats = () => {
  return adminApiInstance.get('/admin/dashboard');
};

// Users
export const getUsers = (params) => {
  return adminApiInstance.get('/admin/users', { params });
};

export const deleteUser = (id) => {
  return adminApiInstance.delete(`/admin/users/${id}`);
};

export const updateUserStatus = (id, is_active) => {
  return adminApiInstance.put(`/admin/users/${id}/status`, { is_active });
};

// Vendors
export const getVendors = (params) => {
  const cacheKey = JSON.stringify(params);
  if (adminCache.has(cacheKey)) {
    console.log('📦 Returning cached vendors');
    return Promise.resolve(adminCache.get(cacheKey));
  }
  return adminApiInstance.get('/admin/vendors', { params }).then(response => {
    adminCache.set(cacheKey, response);
    return response;
  });
};

export const getVendor = (id) => {
  return adminApiInstance.get(`/admin/vendors/${id}`);
};

export const approveVendor = (id) => {
  return adminApiInstance.put(`/admin/vendors/${id}/approve`);
};

export const rejectVendor = (id, reason) => {
  return adminApiInstance.put(`/admin/vendors/${id}/reject`, { reason });
};

export const suspendVendor = (id, reason) => {
  return adminApiInstance.put(`/admin/vendors/${id}/suspend`, { reason });
};

export const unsuspendVendor = (id) => {
  return adminApiInstance.put(`/admin/vendors/${id}/unsuspend`);
};

// Restaurants
export const getRestaurants = (params) => {
  const cacheKey = JSON.stringify(params);
  if (adminCache.has(cacheKey)) {
    console.log('📦 Returning cached restaurants');
    return Promise.resolve(adminCache.get(cacheKey));
  }
  return adminApiInstance.get('/admin/restaurants', { params }).then(response => {
    adminCache.set(cacheKey, response);
    return response;
  });
};

export const approveRestaurant = (id) => {
  return adminApiInstance.put(`/admin/restaurants/${id}/approve`);
};

export const rejectRestaurant = (id, reason) => {
  return adminApiInstance.put(`/admin/restaurants/${id}/reject`, { reason });
};

export const suspendRestaurant = (id, reason) => {
  return adminApiInstance.put(`/admin/restaurants/${id}/suspend`, { reason });
};

export const unsuspendRestaurant = (id) => {
  return adminApiInstance.put(`/admin/restaurants/${id}/unsuspend`);
};

// ✅ ORDERS
export const getOrders = (params) => {
  return adminApiInstance.get('/admin/orders', { params });
};

export const getOrderById = (id) => {
  return adminApiInstance.get(`/admin/orders/${id}`);
};

export const updateOrderStatus = (id, status) => {
  return adminApiInstance.put(`/admin/orders/${id}/status`, { status });
};

// Commissions
export const getCommissions = (params) => {
  return adminApiInstance.get('/admin/commissions', { params });
};

// ✅ Default export for compatibility
export default adminApiInstance;

// ✅ Named export for those who need it
export { adminApiInstance as adminApi };