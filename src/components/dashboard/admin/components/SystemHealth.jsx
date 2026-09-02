// src/components/dashboard/admin/components/SystemHealth.jsx
import React from 'react';

const SystemHealth = ({ data }) => {
  const healthData = data || {
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.5%',
    activeUsers: 150
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Uptime</span>
        <span className="text-sm font-medium text-green-600">{healthData.uptime}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Response Time</span>
        <span className="text-sm font-medium text-blue-600">{healthData.responseTime}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Error Rate</span>
        <span className="text-sm font-medium text-yellow-600">{healthData.errorRate}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Active Users</span>
        <span className="text-sm font-medium text-purple-600">{healthData.activeUsers}</span>
      </div>
    </div>
  );
};

export default SystemHealth;