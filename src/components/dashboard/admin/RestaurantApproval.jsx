// src/components/dashboard/admin/RestaurantApproval.jsx
import React, { useState, useEffect, useCallback } from 'react';
import adminApi from '../../../api/adminApi';
import toast from 'react-hot-toast';

// `status` is the source of truth (see adminDashboardController). Older rows may predate
// it being maintained, so fall back to the booleans.
const restaurantState = (r) => {
  if (r.status === 'suspended' || r.is_suspended) return 'suspended';
  if (r.status === 'rejected') return 'rejected';
  if (r.status === 'approved' || r.is_approved) return 'approved';
  return 'pending';
};

const STATE_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  suspended: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const STATE_LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', suspended: 'Suspended' };

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const btn = 'px-3 py-1 rounded text-xs font-medium text-white disabled:opacity-50';

// Small dialog for the reject/suspend reason (window.prompt is blocked in some browsers
// and cannot be styled for dark mode).
const ReasonDialog = ({ dialog, onCancel, onSubmit, busy }) => {
  const [reason, setReason] = useState('');
  useEffect(() => setReason(''), [dialog]);
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {dialog.action === 'reject' ? 'Reject' : 'Suspend'} “{dialog.restaurant.restaurant_name}”
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The vendor will see this reason in their notifications.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
          autoFocus
          placeholder="Reason (required)"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || !reason.trim()}
            onClick={() => onSubmit(reason.trim())}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {dialog.action === 'reject' ? 'Reject restaurant' : 'Suspend restaurant'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RestaurantApproval = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [busyId, setBusyId] = useState(null);
  const [dialog, setDialog] = useState(null); // { action, restaurant }

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/restaurants', {
        params: {
          page,
          limit,
          status: statusFilter || undefined,
          search: searchTerm || undefined,
        },
      });

      if (response.data.success) {
        setRestaurants(response.data.restaurants || []);
        setTotal(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [fetchRestaurants]);

  // Filter or search changes start again from page 1.
  useEffect(() => setPage(1), [statusFilter, searchTerm]);

  const runAction = async (restaurant, action, reason) => {
    setBusyId(restaurant.id);
    try {
      const response = await adminApi.put(
        `/admin/restaurants/${restaurant.id}/${action}`,
        reason ? { reason } : undefined
      );
      if (response.data.success) {
        const verb = { approve: 'approved', reject: 'rejected', suspend: 'suspended', unsuspend: 'reactivated' }[action];
        toast.success(`${restaurant.restaurant_name} ${verb}`);
        setDialog(null);
        fetchRestaurants();
      }
    } catch (error) {
      console.error(`Error trying to ${action} restaurant:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} restaurant`);
    } finally {
      setBusyId(null);
    }
  };

  const renderActions = (restaurant) => {
    const state = restaurantState(restaurant);
    const busy = busyId === restaurant.id;
    return (
      <div className="flex flex-wrap gap-2">
        {(state === 'pending' || state === 'rejected') && (
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(restaurant, 'approve')}
            className={`${btn} bg-green-600 hover:bg-green-700`}
          >
            Approve
          </button>
        )}
        {state === 'pending' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setDialog({ action: 'reject', restaurant })}
            className={`${btn} bg-red-600 hover:bg-red-700`}
          >
            Reject
          </button>
        )}
        {state === 'approved' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setDialog({ action: 'suspend', restaurant })}
            className={`${btn} bg-yellow-600 hover:bg-yellow-700`}
          >
            Suspend
          </button>
        )}
        {state === 'suspended' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(restaurant, 'unsuspend')}
            className={`${btn} bg-blue-600 hover:bg-blue-700`}
          >
            Reactivate
          </button>
        )}
      </div>
    );
  };

  const locationCell = (restaurant) => {
    const place = [restaurant.address, restaurant.city].filter(Boolean).join(', ') || '—';
    if (restaurant.latitude == null || restaurant.longitude == null) {
      return <span>{place}</span>;
    }
    return (
      <span>
        {place}{' '}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline whitespace-nowrap"
        >
          View map
        </a>
      </span>
    );
  };

  return (
    <div className="m-4 sm:m-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Restaurant Approval</h2>
        <button
          onClick={fetchRestaurants}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by restaurant or vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
          <option value="">All</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No {statusFilter ? STATE_LABELS[statusFilter]?.toLowerCase() : ''} restaurants found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['Name', 'Vendor', 'Cuisine', 'Location', 'Submitted', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {restaurants.map((restaurant) => {
                const state = restaurantState(restaurant);
                const note = state === 'rejected' ? restaurant.rejection_reason : state === 'suspended' ? restaurant.suspension_reason : null;
                return (
                  <tr key={restaurant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 align-top">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{restaurant.restaurant_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {restaurant.vendor_name || 'N/A'}
                      {restaurant.vendor_approved === false && (
                        <span className="block text-xs text-yellow-600 dark:text-yellow-400">Vendor not yet approved</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{restaurant.cuisine_type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[220px]">{locationCell(restaurant)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {restaurant.created_at ? formatDate(restaurant.created_at) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded ${STATE_STYLES[state]}`}>{STATE_LABELS[state]}</span>
                      {note && <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-[180px]">{note}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">{renderActions(restaurant)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="flex justify-between items-center mt-4 gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total: {total} restaurants</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ReasonDialog
        dialog={dialog}
        busy={busyId !== null}
        onCancel={() => setDialog(null)}
        onSubmit={(reason) => runAction(dialog.restaurant, dialog.action, reason)}
      />
    </div>
  );
};

export default RestaurantApproval;
