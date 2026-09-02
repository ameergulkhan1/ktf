// src/api/cartApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/cart';

export const cartApi = {
  get: async (userId) => {
    try {
      console.log('📤 Fetching cart for user:', userId);
      const response = await axiosInstance.get(API_URL, { params: { userId } });
      console.log('📥 Raw cart response:', response.data);
      
      // ✅ If the response is { success: true } without items, return empty array
      const data = response.data || {};
      
      // ✅ Always return a consistent structure
      const result = {
        success: true,
        items: Array.isArray(data.items) ? data.items : [],
        total: typeof data.total === 'number' ? data.total : 0,
        count: typeof data.count === 'number' ? data.count : 0
      };
      
      // ✅ Fix count if items exist but count is 0
      if (result.count === 0 && result.items.length > 0) {
        result.count = result.items.length;
      }
      
      // ✅ Fix total if items exist but total is 0
      if (result.total === 0 && result.items.length > 0) {
        result.total = result.items.reduce((sum, item) => {
          return sum + ((item.price || 0) * (item.quantity || 0));
        }, 0);
      }
      
      console.log('📥 Parsed cart response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { success: true, items: [], total: 0, count: 0 };
    }
  },

  add: async (itemData) => {
    try {
      console.log('📤 Adding to cart:', itemData);
      const response = await axiosInstance.post(`${API_URL}/add`, itemData);
      console.log('📥 Add to cart response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  update: async (id, quantity) => {
    try {
      const response = await axiosInstance.put(API_URL + '/update/' + id, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axiosInstance.delete(API_URL + '/remove/' + id);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  clear: async (userId) => {
    try {
      const response = await axiosInstance.delete(API_URL + '/clear', { 
        data: { userId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};