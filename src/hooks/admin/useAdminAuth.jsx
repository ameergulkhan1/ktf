// src/services/admin/adminAuthService.js
import adminApi from '../../api/adminApi';

export const adminAuthService = {
  // ✅ Admin login - Updated endpoint
  login: async (credentials) => {
    try {
      console.log('📤 Admin login request:', credentials.email);
      const response = await adminApi.post('/admin/auth/login', credentials);
      console.log('📥 Admin login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  },

  // ✅ Verify admin token
  verifyToken: async () => {
    try {
      const response = await adminApi.get('/admin/auth/verify');
      return response.data;
    } catch (error) {
      console.error('❌ Verify token error:', error);
      throw error;
    }
  },

  // ✅ Get admin profile
  getProfile: async () => {
    try {
      const response = await adminApi.get('/admin/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  // ✅ Update admin profile
  updateProfile: async (data) => {
    try {
      const response = await adminApi.put('/admin/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  // ✅ Change admin password
  changePassword: async (data) => {
    try {
      const response = await adminApi.put('/admin/auth/password', data);
      return response.data;
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error;
    }
  },

  // ✅ Admin logout
  logout: async () => {
    try {
      const response = await adminApi.post('/admin/auth/logout');
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  // ============================================
  // ADMIN DASHBOARD ENDPOINTS
  // ============================================

  // ✅ Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      throw error;
    }
  },

  // ✅ Get all users
  getUsers: async (params) => {
    try {
      const response = await adminApi.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get users error:', error);
      throw error;
    }
  },

  // ✅ Get all vendors
  getVendors: async (params) => {
    try {
      const response = await adminApi.get('/admin/vendors', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get vendors error:', error);
      throw error;
    }
  },

  // ✅ Get vendor by ID
  getVendorById: async (id) => {
    try {
      const response = await adminApi.get(`/admin/vendors/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get vendor by ID error:', error);
      throw error;
    }
  },

  // ✅ Approve vendor
  approveVendor: async (id) => {
    try {
      const response = await adminApi.put(`/admin/vendors/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('❌ Approve vendor error:', error);
      throw error;
    }
  },

  // ✅ Reject vendor
  rejectVendor: async (id, reason) => {
    try {
      const response = await adminApi.put(`/admin/vendors/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('❌ Reject vendor error:', error);
      throw error;
    }
  },

  // ✅ Suspend vendor
  suspendVendor: async (id, reason) => {
    try {
      const response = await adminApi.put(`/admin/vendors/${id}/suspend`, { reason });
      return response.data;
    } catch (error) {
      console.error('❌ Suspend vendor error:', error);
      throw error;
    }
  },

  // ✅ Unsuspend vendor
  unsuspendVendor: async (id) => {
    try {
      const response = await adminApi.put(`/admin/vendors/${id}/unsuspend`);
      return response.data;
    } catch (error) {
      console.error('❌ Unsuspend vendor error:', error);
      throw error;
    }
  },

  // ✅ Get all restaurants
  getRestaurants: async (params) => {
    try {
      const response = await adminApi.get('/admin/restaurants', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get restaurants error:', error);
      throw error;
    }
  },

  // ✅ Get all orders
  getOrders: async (params) => {
    try {
      const response = await adminApi.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get orders error:', error);
      throw error;
    }
  },

  // ✅ Get commissions
  getCommissions: async (params) => {
    try {
      const response = await adminApi.get('/admin/commissions', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get commissions error:', error);
      throw error;
    }
  },

  // ✅ Delete user
  deleteUser: async (id) => {
    try {
      const response = await adminApi.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Delete user error:', error);
      throw error;
    }
  },

  // ✅ Update user status
  updateUserStatus: async (id, isActive) => {
    try {
      const response = await adminApi.put(`/admin/users/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      console.error('❌ Update user status error:', error);
      throw error;
    }
  },

  // ✅ Approve restaurant
  approveRestaurant: async (id) => {
    try {
      const response = await adminApi.put(`/admin/restaurants/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('❌ Approve restaurant error:', error);
      throw error;
    }
  },

  // ✅ Reject restaurant
  rejectRestaurant: async (id) => {
    try {
      const response = await adminApi.put(`/admin/restaurants/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error('❌ Reject restaurant error:', error);
      throw error;
    }
  },

  // ✅ Suspend restaurant
  suspendRestaurant: async (id, reason) => {
    try {
      const response = await adminApi.put(`/admin/restaurants/${id}/suspend`, { reason });
      return response.data;
    } catch (error) {
      console.error('❌ Suspend restaurant error:', error);
      throw error;
    }
  },

  // ✅ Unsuspend restaurant
  unsuspendRestaurant: async (id) => {
    try {
      const response = await adminApi.put(`/admin/restaurants/${id}/unsuspend`);
      return response.data;
    } catch (error) {
      console.error('❌ Unsuspend restaurant error:', error);
      throw error;
    }
  }
};

export default adminAuthService;