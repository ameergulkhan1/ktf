// src/api/vendorApi.js
import axiosInstance from './axiosConfig';

const API_URL = '/vendors';

// ============================================
// VENDOR API - Complete
// ============================================
const vendorApi = {
  // ============================================
  // PROFILE
  // ============================================
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(API_URL + '/profile');
      console.log('📥 Vendor profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      return { success: true, vendor: null };
    }
  },

  // ============================================
  // RESTAURANT
  // ============================================
  getRestaurant: async () => {
    try {
      const response = await axiosInstance.get(API_URL + '/restaurant');
      console.log('📥 Get restaurant response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor restaurant:', error);
      if (error.response?.status === 404) {
        return { success: true, restaurant: null };
      }
      return { success: true, restaurant: null };
    }
  },

  saveRestaurant: async (data) => {
    try {
      const payload = {
        restaurant_name: (data.restaurant_name || data.name || '').trim(),
        description: (data.description || '').trim(),
        cuisine_type: (data.cuisine_type || 'Fast Food').trim(),
        address: (data.address || '').trim(),
        city: (data.city || '').trim(),
        state: (data.state || '').trim(),
        postal_code: (data.postal_code || '').trim(),
        country: (data.country || 'Pakistan').trim(),
        phone: (data.phone || '').trim(),
        email: (data.email || '').trim(),
        website: (data.website || '').trim(),
        delivery_radius: parseFloat(data.delivery_radius) || 10,
        min_order_amount: parseFloat(data.min_order_amount) || 0,
        delivery_fee: parseFloat(data.delivery_fee) || 0,
        is_open: data.is_open !== undefined ? Boolean(data.is_open) : true,
        opening_hours: data.opening_hours || {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '09:00', close: '22:00' }
        }
      };

      console.log('📤 Saving restaurant with payload:', payload);
      const response = await axiosInstance.post(API_URL + '/restaurant', payload);
      console.log('📥 Save restaurant response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error saving restaurant:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to save restaurant');
      }
      throw error;
    }
  },

  updateRestaurant: async (data) => {
    try {
      const payload = {
        restaurant_name: (data.restaurant_name || '').trim(),
        description: (data.description || '').trim(),
        cuisine_type: (data.cuisine_type || 'Fast Food').trim(),
        address: (data.address || '').trim(),
        city: (data.city || '').trim(),
        state: (data.state || '').trim(),
        postal_code: (data.postal_code || '').trim(),
        country: (data.country || 'Pakistan').trim(),
        phone: (data.phone || '').trim(),
        email: (data.email || '').trim(),
        website: (data.website || '').trim(),
        delivery_radius: parseFloat(data.delivery_radius) || 10,
        min_order_amount: parseFloat(data.min_order_amount) || 0,
        delivery_fee: parseFloat(data.delivery_fee) || 0,
        is_open: data.is_open !== undefined ? Boolean(data.is_open) : true,
        opening_hours: data.opening_hours || {}
      };

      const response = await axiosInstance.put(API_URL + '/restaurant', payload);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating restaurant:', error);
      throw error;
    }
  },

  deleteRestaurant: async () => {
    try {
      const response = await axiosInstance.delete(API_URL + '/restaurant');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting restaurant:', error);
      throw error;
    }
  },

  // ============================================
  // MENU ITEMS
  // ============================================
  getMenu: async () => {
    try {
      const response = await axiosInstance.get(API_URL + '/menu');
      console.log('📥 Get menu response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      return { success: true, menu: [] };
    }
  },

  addMenuItem: async (data) => {
    try {
      if (!data.item_name || !data.item_name.trim()) {
        throw new Error('Item name is required');
      }
      if (!data.price || parseFloat(data.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const payload = {
        item_name: data.item_name.trim(),
        description: (data.description || '').trim(),
        category: (data.category || '').trim(),
        price: parseFloat(data.price) || 0,
        is_available: data.is_available !== undefined ? Boolean(data.is_available) : true,
        is_vegetarian: data.is_vegetarian || false,
        is_vegan: data.is_vegan || false,
        has_gluten: data.has_gluten !== undefined ? Boolean(data.has_gluten) : true,
        calories: data.calories ? parseInt(data.calories) : null,
        preparation_time: data.preparation_time ? parseInt(data.preparation_time) : null,
        image_url: (data.image_url || '').trim()
      };

      console.log('📤 Adding menu item with payload:', payload);
      const response = await axiosInstance.post(API_URL + '/menu', payload);
      console.log('📥 Add menu item response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding menu item:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to add menu item');
      }
      throw error;
    }
  },

  updateMenuItem: async (id, data) => {
    try {
      const payload = {
        item_name: (data.item_name || '').trim(),
        description: (data.description || '').trim(),
        category: (data.category || '').trim(),
        price: parseFloat(data.price) || 0,
        is_available: data.is_available !== undefined ? Boolean(data.is_available) : true,
        is_vegetarian: data.is_vegetarian || false,
        is_vegan: data.is_vegan || false,
        has_gluten: data.has_gluten !== undefined ? Boolean(data.has_gluten) : true,
        calories: data.calories ? parseInt(data.calories) : null,
        preparation_time: data.preparation_time ? parseInt(data.preparation_time) : null,
        image_url: (data.image_url || '').trim()
      };

      const response = await axiosInstance.put(API_URL + '/menu/' + id, payload);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating menu item:', error);
      throw error;
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const response = await axiosInstance.delete(API_URL + '/menu/' + id);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting menu item:', error);
      throw error;
    }
  },

  // ============================================
  // PRODUCTS
  // ============================================
  getProducts: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL + '/products', { params });
      console.log('📥 Vendor products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      return { success: true, products: [] };
    }
  },

  createProduct: async (productData) => {
    try {
      if (!productData.product_name || !productData.product_name.trim()) {
        throw new Error('Product name is required');
      }
      if (!productData.price || parseFloat(productData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const payload = {
        product_name: productData.product_name.trim(),
        description: (productData.description || '').trim(),
        category: (productData.category || '').trim(),
        sub_category: (productData.sub_category || '').trim(),
        price: parseFloat(productData.price) || 0,
        compare_price: productData.compare_price ? parseFloat(productData.compare_price) : null,
        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
        stock_quantity: parseInt(productData.stock_quantity) || 0,
        low_stock_threshold: parseInt(productData.low_stock_threshold) || 10,
        weight: productData.weight ? parseFloat(productData.weight) : null,
        weight_unit: (productData.weight_unit || 'kg').trim(),
        dimensions: productData.dimensions || {},
        is_active: productData.is_active !== undefined ? Boolean(productData.is_active) : true,
        is_featured: productData.is_featured || false,
        product_type: (productData.product_type || 'vendor').trim()
      };

      console.log('📤 Creating product with payload:', payload);
      const response = await axiosInstance.post(API_URL + '/products', payload);
      console.log('📥 Create product response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to create product');
      }
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const payload = {
        product_name: (productData.product_name || '').trim(),
        description: (productData.description || '').trim(),
        category: (productData.category || '').trim(),
        sub_category: (productData.sub_category || '').trim(),
        price: parseFloat(productData.price) || 0,
        compare_price: productData.compare_price ? parseFloat(productData.compare_price) : null,
        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
        stock_quantity: parseInt(productData.stock_quantity) || 0,
        low_stock_threshold: parseInt(productData.low_stock_threshold) || 10,
        weight: productData.weight ? parseFloat(productData.weight) : null,
        weight_unit: (productData.weight_unit || 'kg').trim(),
        dimensions: productData.dimensions || {},
        is_active: productData.is_active !== undefined ? Boolean(productData.is_active) : true,
        is_featured: productData.is_featured || false
      };

      const response = await axiosInstance.put('/products/' + id, payload);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete('/products/' + id);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  },

  // ============================================
  // ORDERS
  // ============================================
  getOrders: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL + '/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      return { success: true, orders: [] };
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    try {
      // statusData can be either a string (status) or an object with status + shipper details
      const payload = typeof statusData === 'string' 
        ? { status: statusData } 
        : statusData;
      
      const response = await axiosInstance.put(API_URL + '/orders/' + orderId + '/status', payload);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  },

  // ============================================
  // EARNINGS & WALLET
  // ============================================
  getEarnings: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL + '/earnings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor earnings:', error);
      return { success: true, earnings: { total: 0, pending: 0, available: 0 } };
    }
  },

  getWallet: async () => {
    try {
      const response = await axiosInstance.get(API_URL + '/wallet');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor wallet:', error);
      return { success: true, wallet: { balance: 0, pending: 0, totalEarned: 0 } };
    }
  },

  withdraw: async (data) => {
    try {
      const payload = {
        amount: parseFloat(data.amount) || 0,
        bank_account_details: data.bank_account_details || {},
        notes: (data.notes || '').trim()
      };

      const response = await axiosInstance.post(API_URL + '/withdraw', payload);
      return response.data;
    } catch (error) {
      console.error('❌ Error withdrawing funds:', error);
      throw error;
    }
  },

  // ============================================
  // STATISTICS
  // ============================================
  getStatistics: async (params) => {
    try {
      const response = await axiosInstance.get(API_URL + '/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: true, statistics: {} };
    }
  }
};

// ============================================
// EXPORT - BOTH named and default
// ============================================
export { vendorApi };
export default vendorApi;