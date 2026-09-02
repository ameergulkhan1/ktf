// src/components/dashboard/admin/components/TopVendors.jsx
import React from 'react';

const TopVendors = ({ vendors }) => {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vendor data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vendors.slice(0, 5).map((vendor, index) => (
        <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {vendor.business_name || vendor.name || 'Unknown Vendor'}
            </p>
            <p className="text-xs text-gray-500">
              Revenue: 
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-600">
              
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopVendors;