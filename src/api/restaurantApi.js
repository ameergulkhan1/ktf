// src/api/restaurantApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/restaurants';

// ✅ Professional data extraction
const extractRestaurants = (response) => {
  if (!response?.data) return [];
  
  const data = response.data;
  
  // Handle different response formats
  if (data.success && Array.isArray(data.restaurants)) {
    return data.restaurants;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(data)) {
    return data;
  }
  
  return [];
};

export const restaurantApi = {
  getAll: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
      return {
        success: true,
        restaurants: extractRestaurants(response),
      };
    } catch (error) {
      console.error('Error fetching restaurants:', error);
        return { success: false, restaurants: [], message: error.message || 'Failed to fetch restaurants' };
    }
  },

  getFeatured: async (limit = 4) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/featured`, { params: { limit } });
      return {
        success: true,
        restaurants: extractRestaurants(response),
      };
    } catch (error) {
      console.error('Error fetching featured restaurants:', error);
      return { success: true, restaurants: [] };
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response?.data || { success: false, restaurant: null };
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return { success: false, restaurant: null };
    }
  },

  getMenu: async (restaurantId, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${restaurantId}/menu`, { params });
      return response?.data || { success: true, menu: [] };
    } catch (error) {
      console.error('Error fetching menu:', error);
      return { success: true, menu: [] };
    }
  },

  search: async (query, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, { params: { q: query, ...params } });
      return response?.data || { success: true, restaurants: [] };
    } catch (error) {
      console.error('Error searching restaurants:', error);
      return { success: true, restaurants: [] };
    }
  },

  getByCategory: async (category, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/category/${category}`, { params });
      return response?.data || { success: true, restaurants: [] };
    } catch (error) {
      console.error('Error fetching restaurants by category:', error);
      return { success: true, restaurants: [] };
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post(API_URL, data);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, data);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },

  addReview: async (restaurantId, reviewData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${restaurantId}/reviews`, reviewData);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  getReviews: async (restaurantId, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${restaurantId}/reviews`, { params });
      return response?.data || { success: true, reviews: [] };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { success: true, reviews: [] };
    }
  }
};