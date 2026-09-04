// src/components/dashboard/admin/VendorApproval.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/adminApi';
import toast from 'react-hot-toast';

const VendorApproval = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [error, setError] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching vendors...');
      
      const params = { 
        page, 
        limit,
        status: statusFilter || undefined,
        search: searchTerm || undefined
      };
      
      console.log('📤 Request params:', params);
      
      const response = await adminApi.get('/admin/vendors', { params });
      
      console.log('📥 Vendors response:', response.data);
      
      if (response.data.success) {
        const vendorsData = response.data.vendors || [];
        setVendors(vendorsData);
        setTotal(response.data.pagination?.total || 0);
        console.log(`✅ Loaded ${vendorsData.length} vendors`);
      } else {
        setError(response.data.message || 'Failed to load vendors');
        toast.error(response.data.message || 'Failed to load vendors');
      }
    } catch (error) {
      console.error('❌ Error fetching vendors:', error);
      const errorMsg = error.response?.data?.message || 'Failed to load vendors. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendors();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, statusFilter, searchTerm]);

  const handleApprove = async (vendorId) => {
    if (!window.confirm('Approve this vendor?')) return;
    
    try {
      const response = await adminApi.put(`/admin/vendors/${vendorId}/approve`);
      if (response.data.success) {
        toast.success('Vendor approved successfully!');
        fetchVendors();
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error(error.response?.data?.message || 'Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    
    try {
      const response = await adminApi.put(`/admin/vendors/${vendorId}/reject`, { reason });
      if (response.data.success) {
        toast.success('Vendor rejected successfully!');
        fetchVendors();
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast.error(error.response?.data?.message || 'Failed to reject vendor');
    }
  };

  const handleSuspend = async (vendorId) => {
    if (!window.confirm('Suspend this vendor?')) return;
    const reason = prompt('Enter suspension reason:');
    if (reason === null) return;
    
    try {
      const response = await adminApi.put(`/admin/vendors/${vendorId}/suspend`, { reason });
      if (response.data.success) {
        toast.success('Vendor suspended successfully!');
        fetchVendors();
      }
    } catch (error) {
      console.error('Error suspending vendor:', error);
      toast.error(error.response?.data?.message || 'Failed to suspend vendor');
    }
  };

  const handleUnsuspend = async (vendorId) => {
    if (!window.confirm('Unsuspend this vendor?')) return;
    
    try {
      const response = await adminApi.put(`/admin/vendors/${vendorId}/unsuspend`);
      if (response.data.success) {
        toast.success('Vendor unsuspended successfully!');
        fetchVendors();
      }
    } catch (error) {
      console.error('Error unsuspending vendor:', error);
      toast.error(error.response?.data?.message || 'Failed to unsuspend vendor');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Vendors</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchVendors}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendor Approval</h2>
          <p className="text-sm text-gray-500">Total: {total} vendors</p>
        </div>
        <button
          onClick={fetchVendors}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vendors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="suspended">⛔ Suspended</option>
          <option value="">📋 All</option>
        </select>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No vendors found</p>
          {statusFilter && <p className="text-sm">Try changing the status filter</p>}
        </div>
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
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {vendor.business_name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {vendor.full_name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {vendor.email || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vendor.is_approved ? 'bg-green-100 text-green-800' : 
                      vendor.is_suspended ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.is_approved ? '✅ Approved' : 
                       vendor.is_suspended ? '⛔ Suspended' : 
                       '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {!vendor.is_approved && !vendor.is_suspended && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {vendor.is_approved && !vendor.is_suspended && (
                      <button
                        onClick={() => handleSuspend(vendor.id)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                      >
                        Suspend
                      </button>
                    )}
                    {vendor.is_suspended && (
                      <button
                        onClick={() => handleUnsuspend(vendor.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Unsuspend
                      </button>
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
          <p className="text-sm text-gray-500">
            Showing {vendors.length} of {total} vendors
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              Page {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
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