// src/services/admin/adminAuthService.js
import adminApi from '../../api/adminApi';

// ✅ Use correct API endpoints (without /api prefix since it's in baseURL)
export const adminAuthService = {
  login: async (credentials) => {
    try {
      console.log('📤 Admin login attempt:', credentials.email);
      
      // ✅ Use '/admin/login' endpoint (matches your backend route)
      const response = await adminApi.post('/admin/login', credentials);
      console.log('📥 Admin login response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        // Also store in regular auth for compatibility
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Admin login service error:', error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      // ✅ Use '/admin/register' endpoint
      const response = await adminApi.post('/admin/register', data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // ✅ Use '/auth/logout' endpoint
      await adminApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    try {
      // ✅ Use '/auth/profile' endpoint
      const response = await adminApi.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      // ✅ Use '/auth/profile' endpoint with PUT
      const response = await adminApi.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },
  
  verifyToken: async () => {
    try {
      // ✅ Use '/auth/verify' endpoint
      const response = await adminApi.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('❌ Verify token error:', error);
      throw error;
    }
  },

  // ✅ New: Get admin dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      throw error;
    }
  },

  // ✅ New: Get all users (admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await adminApi.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get all users error:', error);
      throw error;
    }
  },

  // ✅ New: Get all vendors (admin only)
  getAllVendors: async (params = {}) => {
    try {
      const response = await adminApi.get('/admin/vendors', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get all vendors error:', error);
      throw error;
    }
  },

  // ✅ New: Get all orders (admin only)
  getAllOrders: async (params = {}) => {
    try {
      const response = await adminApi.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get all orders error:', error);
      throw error;
    }
  },

  // ✅ New: Update vendor approval status
  updateVendorStatus: async (vendorId, data) => {
    try {
      const response = await adminApi.put(`/admin/vendors/${vendorId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Update vendor status error:', error);
      throw error;
    }
  },

  // ✅ New: Get commission details
  getCommissions: async (params = {}) => {
    try {
      const response = await adminApi.get('/admin/commissions', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get commissions error:', error);
      throw error;
    }
  },

  // ✅ New: Process withdrawal request
  processWithdrawal: async (withdrawalId, data) => {
    try {
      const response = await adminApi.put(`/admin/withdrawals/${withdrawalId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Process withdrawal error:', error);
      throw error;
    }
  }
};

export default adminAuthService;