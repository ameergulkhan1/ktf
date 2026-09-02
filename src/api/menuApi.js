// src/api/menuApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/menus';

export const menuApi = {
  // ✅ Get vendor menu
  getVendorMenu: async () => {
    try {
      const response = await axiosInstance.get(API_URL + '/vendor');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor menu:', error);
      return { success: true, menu: [] };
    }
  },

  // ✅ Get menu by restaurant (public)
  getByRestaurant: async (restaurantId) => {
    try {
      const response = await axiosInstance.get(API_URL + '/restaurant/' + restaurantId);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      return { success: true, menu: [] };
    }
  },

  // ✅ Create menu item
  create: async (menuData) => {
    try {
      const response = await axiosInstance.post(API_URL, menuData);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // ✅ Update menu item
  update: async (id, menuData) => {
    try {
      const response = await axiosInstance.put(API_URL + '/' + id, menuData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // ✅ Delete menu item
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(API_URL + '/' + id);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
};