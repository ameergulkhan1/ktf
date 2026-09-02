// components/dashboard/admin/ProductApproval.jsx
import React, { useState, useEffect } from 'react';
import { useAdminProducts } from '../../../hooks/admin/useAdminProducts';
import { format } from 'date-fns';

const ProductApproval = () => {
  const {
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
    approveProduct,
    rejectProduct,
    getProductById
  } = useAdminProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilters({ status: 'pending', ...(searchTerm && { search: searchTerm }) });
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [page, limit, filters]);

  const handleApprove = async (productId) => {
    if (window.confirm('Approve this product?')) {
      const response = await approveProduct(productId, 'Product approved');
      if (response.success) {
        await fetchProducts();
      }
    }
  };

  const handleReject = async (productId) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      const response = await rejectProduct(productId, reason);
      if (response.success) {
        await fetchProducts();
      }
    }
  };

  const handleViewDetails = async (productId) => {
    const response = await getProductById(productId);
    if (response.success) {
      setSelectedProduct(response.data);
      setShowDetails(true);
    }
  };

  return (
    <div className="product-approval p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Approval</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {total} pending products
          </span>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No pending products
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.images?.[0]?.image_url || '/default-product.png'}
                  alt={product.product_name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.vendor?.business_name || 'Unknown Vendor'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {product.category || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(product.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Product Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Product Images */}
              <div>
                <img
                  src={selectedProduct.images?.[0]?.image_url || '/default-product.png'}
                  alt={selectedProduct.product_name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex gap-2 mt-2">
                  {selectedProduct.images?.slice(1, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.image_url}
                      alt={`Product ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">{selectedProduct.product_name}</h4>
                  <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${selectedProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedProduct.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-medium">{selectedProduct.stock_quantity || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-medium">{selectedProduct.vendor?.business_name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{format(new Date(selectedProduct.created_at), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleApprove(selectedProduct.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve Product
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProduct.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject Product
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApproval;