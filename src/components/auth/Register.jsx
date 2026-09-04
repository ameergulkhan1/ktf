// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    business_name: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    // ✅ Build user data based on role
    const userData = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // ✅ Add vendor specific fields if vendor
    if (formData.role === 'vendor') {
      userData.business_name = formData.business_name;
      userData.phone = formData.phone;
      userData.address = formData.address;
    }
    
    console.log('📤 Registering user:', userData);
    
    try {
      const result = await register(userData);
      
      if (result.success) {
        console.log('✅ Registration successful, role:', userData.role);
        
        if (formData.role === 'vendor') {
          toast.success('Vendor account created! Please login.');
        } else {
          toast.success('Registration successful! Please login.');
        }
        
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="input-label">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Create a password (min 6 chars)"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="input-label">
                I want to
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">🍔 Order Food (Customer)</option>
                <option value="vendor">🏪 Sell Food (Vendor)</option>
              </select>
            </div>

            {/* ✅ Vendor Specific Fields */}
            {formData.role === 'vendor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  🏪 Business Details
                </p>
                
                <div>
                  <label htmlFor="business_name" className="input-label">
                    Business Name
                  </label>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    required={formData.role === 'vendor'}
                    value={formData.business_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="input-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={formData.role === 'vendor'}
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="input-label">
                    Business Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required={formData.role === 'vendor'}
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your business address"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                formData.role === 'vendor' ? 'Create Vendor Account' : 'Create Account'
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;