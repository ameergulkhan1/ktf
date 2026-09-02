// src/components/user/PaymentMethods.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';
import { FiCreditCard, FiEdit2, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    method_type: 'card',
    card_last_four: '',
    card_brand: 'visa',
    card_expiry: '',
    bank_account_number: '',
    bank_name: '',
    ifsc_code: '',
    account_holder_name: '',
    is_default: false
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.payment_methods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.method_type === 'card') {
      if (!formData.card_last_four || !formData.card_expiry) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (formData.method_type === 'bank_transfer') {
      if (!formData.bank_account_number || !formData.bank_name || !formData.account_holder_name) {
        toast.error('Please fill in all bank details');
        return;
      }
    }

    try {
      setLoading(true);
      
      if (editingId) {
        // Update payment method
        const response = await axiosInstance.put(`/payment-methods/${editingId}`, formData);
        if (response.data.success) {
          toast.success('Payment method updated successfully');
          fetchPaymentMethods();
        }
      } else {
        // Create payment method
        const response = await axiosInstance.post('/payment-methods', formData);
        if (response.data.success) {
          toast.success('Payment method added successfully');
          fetchPaymentMethods();
        }
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error(error.response?.data?.message || 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) return;

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/payment-methods/${id}`);
      if (response.data.success) {
        toast.success('Payment method deleted');
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await axiosInstance.put(`/payment-methods/${id}/default`);
      if (response.data.success) {
        toast.success('Default payment method updated');
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method');
    }
  };

  const handleEdit = (method) => {
    setFormData(method);
    setEditingId(method.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      method_type: 'card',
      card_last_four: '',
      card_brand: 'visa',
      card_expiry: '',
      bank_account_number: '',
      bank_name: '',
      ifsc_code: '',
      account_holder_name: '',
      is_default: false
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <FiPlus /> Add Payment Method
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit' : 'Add'} Payment Method
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method Type
              </label>
              <select
                name="method_type"
                value={formData.method_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash on Delivery</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            {/* Card Details */}
            {formData.method_type === 'card' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Brand
                    </label>
                    <select
                      name="card_brand"
                      value={formData.card_brand}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                      <option value="amex">American Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last 4 Digits
                    </label>
                    <input
                      type="text"
                      name="card_last_four"
                      value={formData.card_last_four}
                      onChange={handleChange}
                      placeholder="1234"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="card_expiry"
                    value={formData.card_expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Bank Details */}
            {formData.method_type === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    placeholder="e.g., HBL, UBL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={handleChange}
                      placeholder="IBAN or Account No."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Default Method */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">Set as default payment method</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Payment Method
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Methods List */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && paymentMethods.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500">
          <FiCreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No payment methods added yet</p>
        </div>
      )}

      {!loading && paymentMethods.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <div key={method.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {method.method_type.replace('_', ' ')}
                    </h3>
                    {method.card_last_four && (
                      <p className="text-sm text-gray-600">•••• •••• •••• {method.card_last_four}</p>
                    )}
                    {method.bank_name && (
                      <p className="text-sm text-gray-600">{method.bank_name}</p>
                    )}
                  </div>
                </div>
                {method.is_default && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                    <FiCheck className="w-3 h-3" /> Default
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(method)}
                  className="flex-1 text-xs px-3 py-2 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition flex items-center justify-center gap-1"
                >
                  <FiEdit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="flex-1 text-xs px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition flex items-center justify-center gap-1"
                >
                  <FiTrash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
