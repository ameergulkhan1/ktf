// src/components/dashboard/admin/VendorApproval.jsx
import React, { useState, useEffect } from 'react';
import { useAdminVendors } from '../../../hooks/admin/useAdminVendors';

const VendorApproval = () => {
  const {
    vendors,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchVendors,
    approveVendor,
    rejectVendor
  } = useAdminVendors();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    setFilters({
      search: searchTerm,
      status: statusFilter
    });
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchVendors();
  }, [page, limit, filters]);

  const handleApprove = async (vendorId) => {
    if (window.confirm('Approve this vendor?')) {
      const response = await approveVendor(vendorId, 'Approved by admin');
      if (response && response.success) {
        await fetchVendors();
      }
    }
  };

  const handleReject = async (vendorId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      const response = await rejectVendor(vendorId, reason);
      if (response && response.success) {
        await fetchVendors();
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Approval</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="">All</option>
        </select>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No vendors found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Business</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Owner</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{vendor.business_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.full_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={"px-2 py-1 text-xs rounded " + (
                      vendor.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    )}>
                      {vendor.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {!vendor.is_approved && (
                      <>
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">Total: {total} vendors</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApproval;