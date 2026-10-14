// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import {
  readAllSessions,
  saveSession,
  clearSession,
  updateSessionUser,
  roleForPath,
  roleOfUser,
  rememberTabRole,
  migrateLegacySession,
  isSessionStorageKey,
} from '../auth/sessionStore';

export const AuthContext = createContext();

// Admin, vendor and customer logins are kept side by side (see auth/sessionStore.js).
// `user` is whichever of them the current page uses, so every existing consumer of
// useAuth() keeps working unchanged.
export const AuthProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    migrateLegacySession();
    return readAllSessions();
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeRole = roleForPath(pathname, sessions);
  const activeSession = sessions[activeRole];
  const user = activeSession?.user || null;

  useEffect(() => {
    if (activeSession) rememberTabRole(activeRole);
  }, [activeRole, activeSession]);

  // A login or logout in another tab changes localStorage; pick it up here so this tab
  // never keeps showing a session that no longer exists.
  useEffect(() => {
    const onStorage = (e) => {
      if (isSessionStorageKey(e.key)) setSessions(readAllSessions());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const refreshSessions = useCallback(() => setSessions(readAllSessions()), []);

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      if (response.success) {
        toast.success('Registration successful! Please login.');
        return { success: true, user: response.user };
      }
      toast.error(response.message || 'Registration failed');
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Customer and vendor login. The caller decides where to go next.
  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await authApi.login(email, password);
      if (!response.success || !response.token || !response.user) {
        const message = response.message || 'Login failed';
        toast.error(message);
        return { success: false, error: message };
      }
      const role = roleOfUser(response.user);
      saveSession(role, response.token, response.user);
      refreshSessions();
      toast.success(`Welcome back, ${response.user.full_name || 'User'}!`);
      return { success: true, user: response.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoggingIn(false);
    }
  };

  const adminLogin = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await authApi.adminLogin(email, password);
      const adminData = response.admin || response.user;
      if (!response.success || !response.token || !adminData) {
        const message = response.message || 'Admin login failed';
        toast.error(message);
        return { success: false, error: message };
      }
      const admin = { ...adminData, role: adminData.role === 'super_admin' ? 'super_admin' : 'admin' };
      saveSession('admin', response.token, admin);
      refreshSessions();
      toast.success(`Welcome Admin, ${admin.full_name || 'Admin'}!`);
      return { success: true, user: admin };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Signs out of the session this page is using only; other roles stay signed in.
  const logout = async () => {
    const role = activeRole;
    try {
      if (role === 'admin') await authApi.adminLogout();
      else await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession(role);
      refreshSessions();
      toast.success('Logged out successfully');
      navigate(role === 'admin' ? '/admin/login' : '/login', { replace: true });
    }
  };

  // ProfilePage saves through here and the stored copy of the user is refreshed.
  const updateUser = async (changes) => {
    const response = await authApi.updateProfile(changes);
    if (response?.success && response.user) {
      updateSessionUser(activeRole, { ...user, ...response.user });
      refreshSessions();
    }
    return response;
  };

  // Every role that currently has a session, for the "signed in as" switcher on /login.
  const signedInAccounts = useMemo(
    () => Object.entries(sessions).filter(([, s]) => s).map(([role, s]) => ({ role, user: s.user })),
    [sessions]
  );

  const value = {
    updateUser,
    user,
    loading: false,
    isAuthenticated: !!user,
    isLoggingIn,
    register,
    login,
    adminLogin,
    logout,
    activeRole,
    signedInAccounts,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isVendor: user?.role === 'vendor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
