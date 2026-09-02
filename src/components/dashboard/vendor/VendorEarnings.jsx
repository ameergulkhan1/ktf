import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useVendorEarnings } from '../../../hooks/useVendor';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';

const VendorEarnings = () => {
  const { user } = useAuth();
  const { data: earningsData, isLoading } = useVendorEarnings(user?.id);
  const [period, setPeriod] = useState('all');

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-4 text-gray-500">Loading earnings...</p>
        </div>
      </div>
    );
  }

  const earnings = earningsData || { total: 0, monthly: 0, weekly: 0, pending: 0, history: [] };

  const earningStats = [
    { label: 'Total Earnings', value: `$${earnings.total?.toFixed(2) || '0.00'}`, icon: CurrencyDollarIcon, color: 'bg-green-500' },
    { label: 'This Month', value: `$${earnings.monthly?.toFixed(2) || '0.00'}`, icon: ArrowTrendingUpIcon, color: 'bg-blue-500' },
    { label: 'Pending', value: `$${earnings.pending?.toFixed(2) || '0.00'}`, icon: ClockIcon, color: 'bg-yellow-500' },
  ];

  const history = earnings.history || [];

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Earnings</h1>
        <Link to="/vendor/dashboard" className="btn-outline">← Back</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {earningStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setPeriod('all')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Time
        </button>
        <button 
          onClick={() => setPeriod('month')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          This Month
        </button>
        <button 
          onClick={() => setPeriod('week')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          This Week
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Earnings Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start selling to see your earnings here!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{item.order_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${item.amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${item.commission?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">${item.earnings?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(item.date), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorEarnings;