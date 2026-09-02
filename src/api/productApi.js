// src/api/productApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/products';

// ✅ Extract products from response
const extractProducts = (response) => {
  if (!response) return [];
  
  // If response is the data object directly
  if (response.success && Array.isArray(response.products)) {
    return response.products;
  }
  // If response has data property
  if (response.data && response.data.success && Array.isArray(response.data.products)) {
    return response.data.products;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) {
    return response;
  }
  
  return [];
};

// ✅ Extract single product from response - FIXED
const extractProduct = (response) => {
  if (!response) return null;
  
  // Case 1: Response is { success: true, product: {...} }
  if (response.success && response.product) {
    return response.product;
  }
  // Case 2: Response is { product: {...} }
  if (response.product) {
    return response.product;
  }
  // Case 3: Response is { data: { product: {...} } }
  if (response.data && response.data.product) {
    return response.data.product;
  }
  // Case 4: Response is { data: { success: true, product: {...} } }
  if (response.data && response.data.success && response.data.product) {
    return response.data.product;
  }
  // Case 5: The response itself is the product
  if (response.id) {
    return response;
  }
  
  console.warn('⚠️ Could not extract product from response:', response);
  return null;
};

export const productApi = {
  getAll: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
      return {
        success: true,
        products: extractProducts(response.data || response),
        pagination: response.data?.pagination || {}
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: true, products: [] };
    }
  },

  getFeatured: async (limit = 4) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/featured`, { params: { limit } });
      return {
        success: true,
        products: extractProducts(response.data || response),
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { success: true, products: [] };
    }
  },

  // ✅ FIXED: getById with proper product extraction
  getById: async (id) => {
    try {
      console.log('📤 Fetching product ID:', id);
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      console.log('📥 Product response status:', response.status);
      console.log('📥 Product response data:', response.data);
      
      // The response.data is { success: true, product: {...} }
      const data = response.data;
      
      // Extract product directly from data
      if (data && data.success && data.product) {
        console.log('✅ Product extracted:', data.product.name);
        return {
          success: true,
          product: data.product
        };
      }
      
      // Try using extractProduct as fallback
      const product = extractProduct(data);
      if (product) {
        console.log('✅ Product extracted (fallback):', product.name);
        return {
          success: true,
          product: product
        };
      }
      
      console.warn('⚠️ No product found in response');
      return {
        success: false,
        product: null,
        message: 'Product not found'
      };
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return { 
        success: false, 
        product: null, 
        message: error.message 
      };
    }
  },

  getByCategory: async (category, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/category/${category}`, { params });
      return {
        success: true,
        products: extractProducts(response.data || response),
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return { success: true, products: [] };
    }
  },

  search: async (query, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, { params: { q: query, ...params } });
      return {
        success: true,
        products: extractProducts(response.data || response),
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return { success: true, products: [] };
    }
  },

  create: async (productData) => {
    try {
      const response = await axiosInstance.post(API_URL, productData);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, productData);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  addReview: async (productId, reviewData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${productId}/reviews`, reviewData);
      return response?.data || { success: false };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  getReviews: async (productId, params) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${productId}/reviews`, { params });
      return {
        success: true,
        reviews: response.data?.reviews || response.data?.data || []
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { success: true, reviews: [] };
    }
  }
};