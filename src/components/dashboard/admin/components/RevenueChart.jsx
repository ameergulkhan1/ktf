// src/components/dashboard/admin/components/RevenueChart.jsx
import React from 'react';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No revenue data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.amount || item.revenue || 0), 1);

  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {data.map((item, index) => {
        const value = item.amount || item.revenue || 0;
        const height = Math.max((value / maxValue) * 100, 5);
        const label = item.period || item.date || item.month || '';
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300"
              style={{ height: height + '%' }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueChart;