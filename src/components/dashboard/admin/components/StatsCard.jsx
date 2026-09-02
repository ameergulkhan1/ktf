// src/components/dashboard/admin/components/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, change, icon, color, subtitle }) => {
  const isPositive = change > 0;
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200',
    teal: 'bg-teal-50 border-teal-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    teal: 'text-teal-600'
  };

  return (
    <div className={"p-6 rounded-xl border " + colors[color] + " hover:shadow-md transition-shadow duration-200"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={"text-2xl " + iconColors[color]}>{icon}</span>
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
        {change !== undefined && change !== null && change !== 0 && (
          <span className={"text-sm font-medium px-2 py-1 rounded " + (isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;