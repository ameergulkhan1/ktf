// src/hooks/admin/useAdminAuth.jsx
import React, { useState, useEffect, useContext, createContext } from 'react';
import { adminAuthService } from '../../services/admin/adminAuthService';
import api from '../../api/axiosConfig';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
          
          // Verify token with backend (optional)
          try {
            const response = await adminAuthService.verifyToken();
            if (response.success) {
              setUser(response.user);
              setIsAuthenticated(true);
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              // Token invalid, logout
              logout();
            }
          } catch (error) {
            // If verify endpoint doesn't exist, use stored user data
            if (error.response?.status === 404) {
              console.log('ℹ️ Verify endpoint not found, using stored user data');
              setUser(userData);
              setIsAuthenticated(true);
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              console.error('Token verification failed:', error);
              // Only logout if not a 404
              if (error.response?.status !== 404) {
                logout();
              } else {
                // Use stored data
                setUser(userData);
                setIsAuthenticated(true);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('📤 Sending admin login request...');
      
      const response = await adminAuthService.login(credentials);
      console.log('📥 Admin login response:', response);
      
      if (response.success) {
        const { user, token } = response;
        setUser(user);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true, user };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       error.response.data?.error || 
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Make sure the backend is running.';
      }
      
      return { 
        success: false, 
        message: errorMessage,
        error: error
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    try {
      const response = await adminAuthService.updateProfile(data);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('adminUser', JSON.stringify(response.data));
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const authValue = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin'
  };

  return (
    <AdminAuthContext.Provider value={authValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};