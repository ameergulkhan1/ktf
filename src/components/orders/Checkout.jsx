// src/components/orders/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { orderApi } from '../../api/orderApi';
import { FiArrowLeft, FiCreditCard, FiMapPin, FiUser, FiPhone, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';

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

const Checkout = () => {
  const navigate = useNavigate();
  // authLoading matters as much as the cart's own flag: on a hard load of /checkout,
  // AuthContext hydrates `user` from localStorage in an effect, and until it does
  // useCart's fetchCart sees no user, returns an empty cart and clears its loading
  // flag. Without waiting for auth the guard below saw an "empty" cart and bounced
  // the customer back to /cart even though the cart had items.
  const { user, loading: authLoading } = useAuth();
  // cartLoading is the cart's own fetch flag. The guard below used to read the local
  // `loading` state instead, which is the order-submission flag and starts false, so on
  // a fresh load of /checkout the cart was still empty and the page bounced straight
  // back to /cart with "Your cart is empty" before fetchCart() had returned.
  const { items, total, count, clearCart, fetchCart, loading: cartLoading } = useCart();
  
  const cartItems = Array.isArray(items) ? items : [];
  const cartTotal = safeNumber(total) || cartItems.reduce((sum, item) => sum + (safeNumber(item.price) * safeNumber(item.quantity)), 0);
  const itemCount = safeNumber(count) || cartItems.length;

  // One source of truth for the money. The order summary rendered a delivery fee of
  // "Free" above 50 and 5.00 otherwise, while the payload posted to /api/orders added a
  // flat 2.99 -- so the customer was always charged a different amount from the total
  // they had just agreed to (2.99 more on a free-delivery order). Both now read these.
  const DELIVERY_FEE_THRESHOLD = 50;
  const DELIVERY_FEE = 5;
  const TAX_RATE = 0.1;
  const deliveryFee = cartTotal > DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + deliveryFee + taxAmount;
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  
  const [formData, setFormData] = useState({
    house_no: '',
    street: '',
    sector: '',
    city: '',
    state: '',
    postal_code: '',
    landmark: '',
    phone: user?.phone || '',
    notes: '',
    payment_method: 'cash'
  });

  useEffect(() => {
    // Re-run once the user is known: the original mount-only effect fired while
    // AuthContext was still hydrating, so it fetched an empty cart and never retried.
    if (authLoading) return;
    fetchCart();
    fetchPaymentMethods();
  }, [authLoading, user?.id]);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true);
      const response = await axiosInstance.get('/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.payment_methods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !cartLoading && !loading && cartItems.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems.length, navigate, authLoading, cartLoading, loading, orderPlaced]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.house_no || !formData.street || !formData.sector || !formData.city || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const deliveryAddress = [
        formData.house_no,
        formData.street,
        formData.sector,
        formData.city,
        formData.state,
        formData.postal_code
      ].filter(Boolean).join(', ');

      const orderData = {
        user_id: user?.id,
        items: cartItems.map(item => ({
          ...(item.menu_item_id
            ? { menu_item_id: item.menu_item_id }
            : { product_id: item.product_id || item.productId }),
          quantity: item.quantity || 1,
          price: safeNumber(item.price)
        })),
        total: safeNumber(grandTotal),
        subtotal: safeNumber(cartTotal),
        delivery_fee: safeNumber(deliveryFee),
        tax: safeNumber(taxAmount),
        delivery_address: deliveryAddress,
        house_no: formData.house_no,
        street: formData.street,
        sector: formData.sector,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        landmark: formData.landmark,
        phone: formData.phone,
        delivery_instructions: formData.notes
      };

      console.log('📦 Order data:', orderData);

      const response = await orderApi.create(orderData);
      console.log('📥 Order response:', response);

      if (response && response.success) {
        await clearCart();
        setOrderNumber(response.order?.order_number || 'ORD-' + Date.now());
        setOrderPlaced(true);
        toast.success('Order placed successfully! 🎉');
      } else {
        toast.error(response?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Placed Successfully! 🇵🇰
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your order. Your order number is:
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            {orderNumber}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We'll send you a confirmation email with the order details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-xl transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading && !cartLoading && !authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md"
          >
            <FiArrowLeft className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/cart" className="text-gray-500 hover:text-blue-600 transition">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🇵🇰 Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {safeString(item.name, 'Product')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {safeNumber(item.quantity)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(safeNumber(item.price) * safeNumber(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-blue-600" />
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    House/Flat No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="house_no"
                    value={formData.house_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., House #12, Flat 3B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., Street 5, Main Boulevard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sector/Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., G-11, F-7, DHA Phase 5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                      placeholder="e.g., Islamabad, Lahore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    >
                      <option value="">Select Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="AJK">Azad Kashmir</option>
                      <option value="Islamabad">Islamabad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., 44000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., Near Centaurus Mall"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="e.g., 03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <FiCreditCard className="inline mr-2" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition"
                      style={{borderColor: formData.payment_method === 'cash' ? '#2563EB' : '', backgroundColor: formData.payment_method === 'cash' ? '#eff6ff' : ''}}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash"
                        checked={formData.payment_method === 'cash'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </label>

                    {paymentMethods.filter(m => m.method_type === 'card').length > 0 && (
                      <optgroup label="Card Payments" className="block">
                        {paymentMethods.filter(m => m.method_type === 'card').map((method) => (
                          <label key={method.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition"
                            style={{borderColor: formData.payment_method === `card-${method.id}` ? '#2563EB' : '', backgroundColor: formData.payment_method === `card-${method.id}` ? '#eff6ff' : ''}}
                          >
                            <input
                              type="radio"
                              name="payment_method"
                              value={`card-${method.id}`}
                              checked={formData.payment_method === `card-${method.id}`}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="ml-3 flex-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {method.card_brand?.toUpperCase()} •••• {method.card_last_four}
                              </span>
                              <p className="text-xs text-gray-500">Expires {method.card_expiry}</p>
                            </div>
                            {method.is_default && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>}
                          </label>
                        ))}
                      </optgroup>
                    )}

                    {paymentMethods.filter(m => m.method_type === 'bank_transfer').length > 0 && (
                      <optgroup label="Bank Transfers" className="block">
                        {paymentMethods.filter(m => m.method_type === 'bank_transfer').map((method) => (
                          <label key={method.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition"
                            style={{borderColor: formData.payment_method === `bank-${method.id}` ? '#2563EB' : '', backgroundColor: formData.payment_method === `bank-${method.id}` ? '#eff6ff' : ''}}
                          >
                            <input
                              type="radio"
                              name="payment_method"
                              value={`bank-${method.id}`}
                              checked={formData.payment_method === `bank-${method.id}`}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="ml-3 flex-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {method.bank_name} - {method.account_holder_name}
                              </span>
                              <p className="text-xs text-gray-500">Transfer to bank account</p>
                            </div>
                          </label>
                        ))}
                      </optgroup>
                    )}
                  </div>

                  {paymentMethods.length === 0 && formData.payment_method !== 'cash' && (
                    <p className="text-xs text-gray-500 mt-3">
                      No payment methods added. <Link to="/profile/payment-methods" className="text-blue-600 hover:text-blue-700">Add payment method</Link>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition flex items-center justify-center gap-2 font-semibold shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    Place Order 🇵🇰
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By placing this order, you agree to our terms and conditions.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;