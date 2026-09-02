// src/components/dashboard/admin/CommissionManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAdminCommission } from '../../../hooks/admin/useAdminCommission';

const CommissionManagement = () => {
  const {
    loading,
    overview,
    withdrawals,
    fetchOverview,
    fetchWithdrawals,
    processWithdrawal
  } = useAdminCommission();

  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchOverview(period);
    fetchWithdrawals('pending');
  }, [period]);

  const handleProcessWithdrawal = async (withdrawalId, status) => {
    // ✅ FIX: Add quotes around the confirm message
    if (window.confirm('Process this withdrawal as ' + status + '?')) {
      const response = await processWithdrawal(withdrawalId, status);
      if (response && response.success) {
        await fetchWithdrawals('pending');
        await fetchOverview(period);
      }
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Commission Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Total Commission</p>
          <p className="text-2xl font-bold text-blue-700"></p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">This Period</p>
          <p className="text-2xl font-bold text-green-700"></p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Pending Withdrawals</p>
          <p className="text-2xl font-bold text-yellow-700">{withdrawals?.length || 0}</p>
        </div>
      </div>

      {withdrawals && withdrawals.length > 0 ? (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Withdrawals</h3>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{w.vendor_name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800"></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleProcessWithdrawal(w.id, 'completed')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleProcessWithdrawal(w.id, 'failed')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Fail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No pending withdrawals</div>
      )}
    </div>
  );
};

export default CommissionManagement;