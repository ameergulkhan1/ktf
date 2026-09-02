// src/components/dashboard/admin/ActivityLogs.jsx
import React, { useState, useEffect } from 'react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logs
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h2>
      <div className="text-center py-8 text-gray-500">
        Activity logs coming soon...
      </div>
    </div>
  );
};

export default ActivityLogs;