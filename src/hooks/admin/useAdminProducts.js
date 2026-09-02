// src/hooks/admin/useAdminProducts.js
import { useState, useCallback } from 'react';
import { adminProductService } from '../../services/admin/adminProductService';

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminProductService.getAll({
        page,
        limit,
        ...filters,
        ...params
      });
      
      if (response.success) {
        setProducts(response.data.products);
        setTotal(response.data.total);
        setPage(response.data.page);
      }
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  const getProductById = useCallback(async (productId) => {
    try {
      const response = await adminProductService.getById(productId);
      return response;
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const approveProduct = useCallback(async (productId, notes) => {
    try {
      const response = await adminProductService.approve(productId, notes);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error approving product:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const rejectProduct = useCallback(async (productId, reason) => {
    try {
      const response = await adminProductService.reject(productId, reason);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error rejecting product:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (productId, data) => {
    try {
      const response = await adminProductService.update(productId, data);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId) => {
    try {
      const response = await adminProductService.delete(productId);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const bulkApprove = useCallback(async (productIds) => {
    try {
      const response = await adminProductService.bulkApprove(productIds);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error bulk approving products:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const bulkDelete = useCallback(async (productIds) => {
    try {
      const response = await adminProductService.bulkDelete(productIds);
      if (response.success) {
        await fetchProducts();
      }
      return response;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      return { success: false, message: error.message };
    }
  }, [fetchProducts]);

  const getStatistics = useCallback(async () => {
    try {
      const response = await adminProductService.getStatistics();
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  return {
    products,
    loading,
    total,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchProducts,
    getProductById,
    approveProduct,
    rejectProduct,
    updateProduct,
    deleteProduct,
    bulkApprove,
    bulkDelete,
    getStatistics
  };
};