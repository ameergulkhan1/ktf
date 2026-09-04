// src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login, adminLogin, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user came from
  const from = location.state?.from?.pathname || '/';
  console.log('📍 Login page - from:', from);

  // Handle redirect when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      handleRedirect(user);
    }
  }, [user, isAuthenticated]);

  const handleRedirect = (userData) => {
    console.log('📍 Redirecting user with role:', userData?.role);
    console.log('📍 Full user data:', userData);

    // ✅ IMPORTANT: Check role and redirect - PRIORITY ORDER
    if (userData?.role === 'admin' || userData?.role === 'super_admin') {
      console.log('📍 Redirecting to ADMIN dashboard');
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (userData?.role === 'vendor') {
      console.log('📍 Redirecting to VENDOR dashboard');
      navigate('/vendor/dashboard', { replace: true });
      return;
    }

    // For regular users, go to the page they came from or home
    console.log('📍 Redirecting regular user to:', from);
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;

      // ✅ Check if trying to login as admin
      if (loginType === 'admin') {
        console.log('🔐 Admin login attempt for:', email);
        result = await adminLogin(email, password);
        console.log('📦 Admin login result:', result);
      } else {
        console.log('🔐 Regular login attempt for:', email);
        result = await login(email, password);
        console.log('📦 Regular login result:', result);
      }

      if (result.success) {
        toast.success('Welcome back!');
        // Use the user from result
        const userData = result.user || result.admin;
        handleRedirect(userData);
      } else {
        toast.error(result.error || result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* ✅ Login Type Selector */}
        <div className="flex gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              loginType === 'user'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            👤 User
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              loginType === 'admin'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🔐 Admin
          </button>
        </div>

        {loginType === 'admin' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              🔑 Admin Login: Use admin credentials
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Test: admin@kft.com / Admin@123
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="input-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder={loginType === 'admin' ? 'admin@kft.com' : 'Enter your email'}
              />
            </div>
            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 ${
                loginType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                loginType === 'admin' ? 'Sign In as Admin' : 'Sign In'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;