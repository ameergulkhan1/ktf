// src/components/cart/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiCreditCard, FiTruck, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const safeNumber = (value, fallback = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
};

const safeString = (value, fallback = '') => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return fallback;
  }
  return String(value);
};

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    loading, 
    error, 
    fetchCart, 
    updateItem, 
    removeItem, 
    clearCart, 
    getCartTotal, 
    getItemCount 
  } = useCart();
  
  const [updating, setUpdating] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setInitialLoad(false);
    };
    loadCart();
  }, []);

  const cartItems = Array.isArray(items) ? items : [];
  const cartTotal = getCartTotal ? getCartTotal() : cartItems.reduce((sum, item) => sum + (safeNumber(item.price) * safeNumber(item.quantity)), 0);
  const itemCount = getItemCount ? getItemCount() : cartItems.reduce((sum, item) => sum + safeNumber(item.quantity), 0);

  useEffect(() => {
    console.log('🔄 CartPage render - items:', cartItems.length);
    console.log('🔄 CartPage render - total:', cartTotal);
    console.log('🔄 CartPage render - count:', itemCount);
  }, [cartItems, cartTotal, itemCount]);

  const handleUpdateQuantity = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await updateItem(itemId, newQuantity);
    } catch (err) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        setUpdating(true);
        await removeItem(itemId);
      } catch (err) {
        toast.error('Failed to remove item');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setUpdating(true);
        await clearCart();
      } catch (err) {
        toast.error('Failed to clear cart');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const formatCurrency = (amount) => {
    return '$' + safeNumber(amount).toFixed(2);
  };

  if (loading && initialLoad) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading cart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Cart</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't added any desi items to your cart yet!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md"
          >
            <FiArrowLeft className="w-4 h-4" />
            Start Shopping 🇵🇰
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = cartTotal > 50 ? 0 : 5;
  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + deliveryFee + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiShoppingCart className="w-6 h-6 text-blue-600" />
              Your Cart 🇵🇰 ({itemCount} items)
            </h1>
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition"
              disabled={updating}
            >
              <FiTrash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemId = item.id || item._id;
              const name = safeString(item.name || item.product_name, 'Product');
              const price = safeNumber(item.price);
              const quantity = safeNumber(item.quantity, 1);
              const image = item.image || item.image_url || null;
              const total = price * quantity;

              return (
                <div
                  key={itemId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link to={`/products/${item.product_id || itemId}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition">
                        {name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(price)}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(itemId, quantity, -1)}
                            disabled={updating || quantity <= 1}
                            className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-l-lg disabled:opacity-50"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1.5 text-sm min-w-[30px] text-center text-gray-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(itemId, quantity, 1)}
                            disabled={updating}
                            className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-r-lg disabled:opacity-50"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(itemId)}
                          className="text-gray-400 hover:text-red-500 transition"
                          disabled={updating}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-80 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FiTruck className="w-3.5 h-3.5" />
                  Delivery Fee
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (10%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Free delivery on orders over $50
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={updating || cartItems.length === 0}
              className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
            >
              <FiCreditCard className="w-4 h-4" />
              Proceed to Checkout 🇵🇰
            </button>

            <Link
              to="/products"
              className="block text-center mt-3 text-sm text-gray-500 hover:text-blue-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;