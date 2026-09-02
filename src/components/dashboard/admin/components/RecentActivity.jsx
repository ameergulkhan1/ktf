// src/components/dashboard/admin/components/RecentActivity.jsx
import React from 'react';

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent activities
      </div>
    );
  }

  const getActivityIcon = (action) => {
    const icons = {
      'user_created': '👤',
      'user_updated': '✏️',
      'vendor_approved': '✅',
      'vendor_rejected': '❌',
      'order_placed': '📦',
      'order_status_updated': '🔄',
      'payment_received': '💰',
      'commission_earned': '📊'
    };
    return icons[action] || '📌';
  };

  const formatTime = (date) => {
    if (!date) return 'Recently';
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return minutes + 'm ago';
    if (hours < 24) return hours + 'h ago';
    return days + 'd ago';
  };

  return (
    <div className="space-y-3">
      {activities.slice(0, 10).map((activity, index) => (
        <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
          <span className="text-xl">{getActivityIcon(activity.action)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">
              {activity.description || activity.action || 'Activity'}
            </p>
            <p className="text-xs text-gray-500">
              {activity.admin?.first_name || 'System'} • {formatTime(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;