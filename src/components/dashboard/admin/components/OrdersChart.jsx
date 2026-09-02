// src/components/dashboard/admin/components/OrdersChart.jsx
import React from 'react';

const OrdersChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No order data available
      </div>
    );
  }

  const statuses = data.statusBreakdown || [];
  const colors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    preparing: 'bg-purple-500',
    ready: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  const totalCount = statuses.reduce((sum, s) => sum + (s.count || 0), 0);

  return (
    <div className="space-y-4">
      {statuses.map((item, index) => {
        const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
        return (
          <div key={index} className="flex items-center gap-4">
            <span className="w-24 text-sm text-gray-600 capitalize">{item.status}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={"h-full transition-all duration-500 " + (colors[item.status] || 'bg-gray-400')}
                style={{ width: Math.min(percentage, 100) + '%' }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersChart;