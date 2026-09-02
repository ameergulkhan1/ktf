// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('adminToken');
        
        console.log('🔍 Auth init - token exists:', !!token);
        console.log('🔍 Auth init - adminToken exists:', !!adminToken);
        
        if (adminToken) {
          const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
          if (userData && userData.role === 'admin') {
            setUser(userData);
            setIsAuthenticated(true);
            api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
            console.log('🔍 Admin user loaded:', userData);
            setLoading(false);
            return;
          }
        }
        
        if (token) {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('🔍 User loaded:', userData);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // ✅ REGISTER FUNCTION - Added
  const register = async (userData) => {
    try {
      console.log('📝 Register attempt for:', userData.email);
      const response = await authApi.register(userData);
      console.log('📦 Register response:', response);
      
      // The response is already the data object
      if (response.success) {
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('❌ Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login for regular users
  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt for:', email);
      const response = await authApi.login(email, password);
      console.log('📦 Login response:', response);
      
      if (response.success) {
        const { token, user } = response;
        setUser(user);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: response.message };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      console.log('🔐 Admin login attempt:', email);
      const response = await authApi.adminLogin(email, password);
      console.log('📦 Admin login response:', response);
      
      if (response.success) {
        const { token, user } = response;
        setUser(user);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        // Also set regular token for compatibility
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: response.message };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Admin login failed'
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,    // ✅ Added register
    login,
    adminLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};