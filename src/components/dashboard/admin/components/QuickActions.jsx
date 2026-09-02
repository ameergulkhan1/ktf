// src/components/dashboard/admin/components/QuickActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ className }) => {
  const actions = [
    { label: 'Manage Users', icon: '👥', path: '/admin/users' },
    { label: 'Approve Vendors', icon: '✅', path: '/admin/vendors' },
    { label: 'View Orders', icon: '📦', path: '/admin/orders' },
    { label: 'Commission Reports', icon: '💰', path: '/admin/commissions' },
    { label: 'View Reports', icon: '📊', path: '/admin/reports' },
    { label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  return (
    <div className={'bg-white p-6 rounded-xl shadow-sm border border-gray-100 ' + (className || '')}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-200"
          >
            <span className="text-2xl mb-1">{action.icon}</span>
            <span className="text-xs text-gray-600 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;