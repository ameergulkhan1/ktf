// src/api/axiosConfig.js
import axios from 'axios';
import toast from 'react-hot-toast';
import { getActiveRole, getTokenForRole, clearSession } from '../auth/sessionStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Sign-in requests carry no session: a wrong password answers 401, and that must not be
// mistaken for another role's session expiring.
const isSignInCall = (url = '') => /\/auth\/(login|register)\b/.test(url);

// Request interceptor: send the token of the role this page uses (admin, vendor or
// customer). Requests stamp the role so a 401 clears only that session.
axiosInstance.interceptors.request.use(
  (config) => {
    if (isSignInCall(config.url)) return config;
    const role = getActiveRole();
    const token = getTokenForRole(role);
    config.kftRole = role;
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
    const status = error.response?.status;
    const url = error.config?.url;
    const role = error.config?.kftRole;

    console.error(`❌ Response error: ${status} ${url}`);

    // Vendor endpoints answer 401 in a few non-auth cases, so those never sign out.
    const isVendorCall = url?.includes('/vendors/');
    const sentToken = !!error.config?.headers?.Authorization;

    if (status === 401 && sentToken && role && !isVendorCall && !isLoggingOut) {
      isLoggingOut = true;
      clearSession(role);
      const loginPath = role === 'admin' ? '/admin/login' : '/login';
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = loginPath;
          isLoggingOut = false;
        }, 1000);
      } else {
        isLoggingOut = false;
      }
    }

    if (status === 404) {
      console.error('❌ 404 Error:', url);
    }

    // Callers that show their own message (e.g. the AI advisor) opt out of the generic toasts.
    const quiet = error.config?.skipErrorToast;

    if (status >= 500 && !quiet) {
      console.error('Server error:', error.response?.data);
      toast.error('Server error. Please try again later.');
    }

    if (error.request && !error.response && !quiet) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;