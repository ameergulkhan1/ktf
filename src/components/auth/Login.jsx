// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { rememberTabRole } from '../../auth/sessionStore';

const ROLE_LABELS = { admin: 'Admin', vendor: 'Vendor', user: 'Customer' };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login, adminLogin, signedInAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user came from
  const from = location.state?.from?.pathname || '/';

  // This page no longer bounces signed-in visitors away: Admin, Vendor and Customer
  // sessions live side by side, so someone already signed in as one role must still be
  // able to sign in as another here. Existing sessions are offered as "Continue" links.
  const handleRedirect = (userData) => {
    if (userData?.role === 'admin' || userData?.role === 'super_admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (userData?.role === 'vendor') {
      navigate('/vendor/dashboard', { replace: true });
      return;
    }
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
        handleRedirect(result.user || result.admin);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 sm:space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl"
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

        {signedInAccounts.length > 0 && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
            <p className="font-medium text-gray-800 dark:text-gray-100">Already signed in</p>
            <ul className="mt-2 space-y-2">
              {signedInAccounts.map(({ role, user: account }) => (
                <li key={role} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-gray-600 dark:text-gray-300">
                    <span className="font-medium">{ROLE_LABELS[role]}:</span> {account.email || account.full_name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      rememberTabRole(role);
                      handleRedirect(account);
                    }}
                    className="flex-shrink-0 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Continue →
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Or sign in below with another account. Each role keeps its own session.
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
                placeholder="Enter your email"
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