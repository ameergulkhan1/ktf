// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');
        
        console.log('🔍 Auth init - token exists:', !!token);
        console.log('🔍 Auth init - adminToken exists:', !!adminToken);
        
        if (adminToken) {
          try {
            const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
            if (userData && (userData.role === 'admin' || userData.role === 'super_admin')) {
              setUser(userData);
              setIsAuthenticated(true);
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
              console.log('🔍 Admin user loaded:', userData);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing admin user:', e);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        }
        
        if (token) {
          try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData && userData.id) {
              setUser(userData);
              setIsAuthenticated(true);
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              console.log('🔍 User loaded:', userData);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing user:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        
        delete axiosInstance.defaults.headers.common['Authorization'];
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      console.log('📝 Register attempt for:', userData.email);
      const response = await authApi.register(userData);
      console.log('📦 Register response:', response);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        return { success: true, user: response.user };
      }
      toast.error(response.message || 'Registration failed');
      return { success: false, message: response.message };
    } catch (error) {
      console.error('❌ Register error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return {
        success: false,
        message: message
      };
    }
  };

  // ✅ FIXED: Login with proper token handling
  const login = async (email, password) => {
    try {
      setIsLoggingIn(true);
      console.log('🔐 Login attempt for:', email);
      
      const response = await authApi.login(email, password);
      console.log('📦 Login response:', response);
      
      if (response.success) {
        const { token, user } = response;
        
        if (!token) {
          console.error('❌ No token in response!');
          toast.error('Login failed: No token received');
          setIsLoggingIn(false);
          return { success: false, error: 'No token received' };
        }
        
        console.log('✅ Token received:', token.substring(0, 20) + '...');
        console.log('✅ User role:', user?.role);
        
        // ✅ Clear any existing tokens first
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // ✅ Store token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // ✅ Set axios header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // ✅ Verify storage
        const storedToken = localStorage.getItem('token');
        console.log('✅ Token stored:', storedToken ? 'Yes (length: ' + storedToken.length + ')' : 'No');
        
        // ✅ Set state
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${user.full_name || 'User'}!`);
        
        setIsLoggingIn(false);
        
        // ✅ Navigate based on role - WITHOUT page refresh
        // ✅ Use a small delay to ensure everything is set
        setTimeout(() => {
          if (user.role === 'admin' || user.role === 'super_admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (user.role === 'vendor') {
            navigate('/vendor/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 100);
        
        return { success: true, user };
      }
      
      toast.error(response.message || 'Login failed');
      setIsLoggingIn(false);
      return { success: false, error: response.message };
    } catch (error) {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      setIsLoggingIn(false);
      return {
        success: false,
        error: message
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setIsLoggingIn(true);
      console.log('🔐 Admin login attempt for:', email);
      
      const response = await authApi.adminLogin(email, password);
      console.log('📦 Admin login response:', response);
      
      if (response.success) {
        const adminData = response.admin || response.user;
        
        if (!adminData) {
          console.error('❌ No admin data in response:', response);
          toast.error('No admin data received');
          setIsLoggingIn(false);
          return { success: false, error: 'No admin data received' };
        }
        
        console.log('✅ Admin data received:', adminData);
        
        const token = response.token;
        
        // ✅ Clear regular tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // ✅ Store admin token
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        
        // ✅ Set axios header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // ✅ Set state
        setUser(adminData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome Admin, ${adminData.full_name || 'Admin'}!`);
        
        setIsLoggingIn(false);
        
        // ✅ Navigate without page refresh
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100);
        
        return { success: true, user: adminData };
      }
      
      toast.error(response.message || 'Admin login failed');
      setIsLoggingIn(false);
      return { success: false, error: response.message || 'Admin login failed' };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
      setIsLoggingIn(false);
      return {
        success: false,
        error: message
      };
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('adminToken')) {
        await authApi.adminLogout();
      } else {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ✅ Clear all state FIRST
      setUser(null);
      setIsAuthenticated(false);
      
      // ✅ Remove token from axios
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // ✅ Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      toast.success('Logged out successfully');
      console.log('✅ Logged out, token cleared');
      
      // ✅ Navigate to login without page refresh
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isLoggingIn,
    register,
    login,
    adminLogin,
    logout,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isVendor: user?.role === 'vendor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;