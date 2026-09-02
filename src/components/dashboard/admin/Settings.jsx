// src/components/dashboard/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAdminSettings } from '../../../hooks/admin/useAdminSettings';

const Settings = () => {
  const { getSettings, updateSettings } = useAdminSettings();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const response = await getSettings();
    if (response && response.success) {
      setSettings(response.data || {});
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const response = await updateSettings(settings);
    if (response && response.success) {
      alert('Settings saved successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="text-center py-8 text-gray-500">
        Settings management coming soon...
      </div>
    </div>
  );
};

export default Settings;