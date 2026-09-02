import axiosInstance from './axiosConfig';

export const dashboardApi = {
  // Get dashboard stats
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async () => {
    const response = await axiosInstance.get('/dashboard/recent-orders');
    return response.data;
  },

  // Get orders by status
  getOrdersByStatus: async () => {
    const response = await axiosInstance.get('/dashboard/orders-by-status');
    return response.data;
  },

  // Get top products
  getTopProducts: async () => {
    const response = await axiosInstance.get('/dashboard/top-products');
    return response.data;
  },
};