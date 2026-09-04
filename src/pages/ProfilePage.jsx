// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PencilSquareIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center text-white">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {user?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-2xl font-bold mt-4">{user?.full_name || 'User'}</h2>
          <p className="text-white/80 flex items-center justify-center gap-2">
            <span>{user?.role || 'Customer'}</span>
            {user?.role === 'user' && <span>🇵🇰</span>}
          </p>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="input-label text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="input-label text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className="input-label text-gray-700 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your delivery address"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.full_name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <PhoneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.phone || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <MapPinIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.address || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;