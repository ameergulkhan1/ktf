// src/utils/orderStatus.js
// Order statuses as vendors and admins actually set them (vendorController and
// adminDashboardController both validate against this list). The customer pages used a
// different, invented set (processing/shipped), so a "preparing" order showed no progress.

export const ORDER_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];

const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  picked_up: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  // Legacy values the customer order API also accepts.
  processing: 'Processing',
  shipped: 'On the way',
};

const BADGES = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  preparing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  ready: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  picked_up: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  shipped: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const statusLabel = (status) => LABELS[status] || (status ? status.replace(/_/g, ' ') : 'Pending');

export const statusBadge = (status) => BADGES[status] || BADGES.refunded;

// Map legacy values onto the step list so the progress tracker still shows something sensible.
export const stepIndex = (status) => {
  const normalised = { processing: 'preparing', shipped: 'picked_up' }[status] || status;
  return ORDER_STEPS.indexOf(normalised);
};

// A customer may cancel only before the kitchen starts on the order.
export const canCustomerCancel = (status) => !status || status === 'pending';
