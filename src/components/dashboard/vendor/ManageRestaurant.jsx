// src/components/dashboard/vendor/ManageRestaurant.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useVendor } from '../../../hooks/useVendor';
import vendorApi from '../../../api/vendorApi';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import { hasCoordinates } from '../../../utils/maps';

// Leaflet only loads on this page, not in the main bundle.
const LocationPicker = lazy(() => import('../../common/LocationPicker'));

const APPROVAL_BANNERS = {
  pending: {
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    title: 'Waiting for admin approval',
    text: 'Your restaurant is not visible to customers until an admin approves it. You can keep editing the details and menu meanwhile.',
  },
  approved: {
    className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    title: 'Approved',
    text: 'Your restaurant is live on KFT.',
  },
  rejected: {
    className: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    title: 'Not approved',
    text: 'Update your details and save to send the restaurant for review again.',
  },
  suspended: {
    className: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200',
    title: 'Suspended',
    text: 'Your restaurant is hidden from customers. Contact KFT support to resolve this.',
  },
};

const approvalState = (r) => {
  if (!r) return null;
  if (r.status === 'suspended' || r.is_suspended) return 'suspended';
  if (r.status === 'rejected') return 'rejected';
  if (r.status === 'approved') return 'approved';
  return 'pending';
};

const ManageRestaurant = () => {
  const { profile } = useVendor();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [errors, setErrors] = useState({});
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  
  const [formData, setFormData] = useState({
    restaurant_name: '',
    description: '',
    cuisine_type: 'Fast Food',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    phone: '',
    email: '',
    website: '',
    delivery_radius: 10,
    min_order_amount: 0,
    delivery_fee: 0,
    is_open: true,
    latitude: null,
    longitude: null,
    opening_hours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '22:00' }
    }
  });

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getRestaurant();
      console.log('📥 Fetch restaurant response:', response);
      
      if (response && response.success && response.restaurant) {
        const restData = response.restaurant;
        setRestaurant(restData);
        setFormData(prev => ({
          ...prev,
          restaurant_name: restData.restaurant_name || '',
          description: restData.description || '',
          cuisine_type: restData.cuisine_type || 'Fast Food',
          address: restData.address || '',
          city: restData.city || '',
          state: restData.state || '',
          postal_code: restData.postal_code || '',
          country: restData.country || 'Pakistan',
          phone: restData.phone || '',
          email: restData.email || '',
          website: restData.website || '',
          delivery_radius: restData.delivery_radius || 10,
          min_order_amount: restData.min_order_amount || 0,
          delivery_fee: restData.delivery_fee || 0,
          is_open: restData.is_open !== undefined ? restData.is_open : true,
          latitude: restData.latitude ?? null,
          longitude: restData.longitude ?? null,
          opening_hours: restData.opening_hours || prev.opening_hours
        }));
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load restaurant data');
      }
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.restaurant_name?.trim()) {
      newErrors.restaurant_name = 'Restaurant name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!hasCoordinates(formData.latitude, formData.longitude)) {
      newErrors.location = 'Pin your restaurant on the map so customers can find it';
    }
    
    if (formData.delivery_radius < 0) {
      newErrors.delivery_radius = 'Delivery radius must be greater than 0';
    }
    
    if (formData.min_order_amount < 0) {
      newErrors.min_order_amount = 'Minimum order amount must be greater than 0';
    }
    
    if (formData.delivery_fee < 0) {
      newErrors.delivery_fee = 'Delivery fee must be greater than 0';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (saving) return;
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setSaving(true);
    setErrors({});

    try {
      console.log('📤 Submitting restaurant form data:', formData);
      
      const response = restaurant
        ? await vendorApi.updateRestaurant(formData)
        : await vendorApi.saveRestaurant(formData);
      console.log('📥 Save restaurant response:', response);
      
      if (response && response.success) {
        toast.success(
          restaurant
            ? 'Restaurant updated successfully!'
            : 'Restaurant created! It will appear to customers once an admin approves it.'
        );
        setRestaurant(response.restaurant);
        
        if (response.restaurant) {
          setFormData(prev => ({
            ...prev,
            ...response.restaurant,
            delivery_radius: response.restaurant.delivery_radius || 10,
            min_order_amount: response.restaurant.min_order_amount || 0,
            delivery_fee: response.restaurant.delivery_fee || 0
          }));
        }
      } else {
        toast.error(response?.message || 'Failed to save restaurant');
      }
    } catch (error) {
      console.error('❌ Error saving restaurant:', error);
      
      let errorMessage = 'Failed to save restaurant';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Restaurant</h1>
            <p className="text-gray-500 dark:text-gray-400">Set up and manage your restaurant details</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm rounded-full ${
              formData.is_open ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {formData.is_open ? '🟢 Open' : '🔴 Closed'}
            </span>
          </div>
        </div>

        {restaurant && APPROVAL_BANNERS[approvalState(restaurant)] && (
          <div className={`mb-6 rounded-xl border p-4 ${APPROVAL_BANNERS[approvalState(restaurant)].className}`} role="status">
            <p className="font-semibold">{APPROVAL_BANNERS[approvalState(restaurant)].title}</p>
            <p className="text-sm mt-1">{APPROVAL_BANNERS[approvalState(restaurant)].text}</p>
            {approvalState(restaurant) === 'rejected' && restaurant.rejection_reason && (
              <p className="text-sm mt-1"><span className="font-medium">Reason:</span> {restaurant.rejection_reason}</p>
            )}
            {approvalState(restaurant) === 'suspended' && restaurant.suspension_reason && (
              <p className="text-sm mt-1"><span className="font-medium">Reason:</span> {restaurant.suspension_reason}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6 dark:bg-gray-800">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-300">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.restaurant_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Chicken Biryani House"
                />
                {errors.restaurant_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.restaurant_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Cuisine Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cuisine_type"
                  value={formData.cuisine_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:border-gray-600"
                >
                  <option value="Fast Food">🍔 Fast Food</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Chinese">🇨🇳 Chinese</option>
                  <option value="Italian">🇮🇹 Italian</option>
                  <option value="Continental">🌍 Continental</option>
                  <option value="Biryani">🍛 Biryani</option>
                  <option value="BBQ">🔥 BBQ</option>
                  <option value="Desserts">🍰 Desserts</option>
                  <option value="Beverages">🥤 Beverages</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-600"
                  placeholder="Describe your restaurant, specialties, and ambiance..."
                />
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-300">Location & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:border-gray-600"
                  placeholder="e.g., Islamabad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:border-gray-600"
                  placeholder="e.g., Punjab"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:border-gray-600"
                  placeholder="e.g., 44000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 03XX-XXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="restaurant@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:border-gray-600"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Map location */}
          <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-1 dark:text-gray-300">
              Restaurant Location <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Customers see this pin with a "Get Directions" button, and it is used to check delivery distance.
            </p>
            <Suspense fallback={<div className="h-72 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />}>
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={({ latitude, longitude }) => {
                  setFormData((prev) => ({ ...prev, latitude, longitude }));
                  setErrors((prev) => ({ ...prev, location: '' }));
                }}
                onAddressFound={setSuggestedAddress}
              />
            </Suspense>
            {errors.location && <p className="text-red-500 text-xs mt-2">{errors.location}</p>}
            {suggestedAddress?.address && (
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                <span className="flex-1 text-gray-700 dark:text-gray-300">
                  Address at this pin: <span className="font-medium">{suggestedAddress.display_name || suggestedAddress.address}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      address: suggestedAddress.address || prev.address,
                      city: suggestedAddress.city || prev.city,
                      state: suggestedAddress.state || prev.state,
                      postal_code: suggestedAddress.postal_code || prev.postal_code,
                      country: suggestedAddress.country || prev.country,
                    }));
                    setErrors((prev) => ({ ...prev, address: '' }));
                    setSuggestedAddress(null);
                  }}
                  className="flex-shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                >
                  Use this address
                </button>
              </div>
            )}
          </div>

          {/* Delivery Settings */}
          <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-300">Delivery Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  name="delivery_radius"
                  value={formData.delivery_radius}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.delivery_radius ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 10"
                  min="0"
                  step="0.5"
                />
                {errors.delivery_radius && (
                  <p className="text-red-500 text-xs mt-1">{errors.delivery_radius}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Min Order Amount (Rs.)
                </label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={formData.min_order_amount}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.min_order_amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 500"
                  min="0"
                  step="0.01"
                />
                {errors.min_order_amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.min_order_amount}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Delivery Fee (Rs.)
                </label>
                <input
                  type="number"
                  name="delivery_fee"
                  value={formData.delivery_fee}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.delivery_fee ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 100"
                  min="0"
                  step="0.01"
                />
                {errors.delivery_fee && (
                  <p className="text-red-500 text-xs mt-1">{errors.delivery_fee}</p>
                )}
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-300">Opening Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg dark:bg-gray-900">
                  <span className="w-full sm:w-24 text-sm font-medium text-gray-700 capitalize dark:text-gray-300">{day}</span>
                  <input
                    type="time"
                    value={formData.opening_hours?.[day]?.open || '09:00'}
                    onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={formData.opening_hours?.[day]?.close || '22:00'}
                    onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_open"
                checked={formData.is_open}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant is open for business</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  {restaurant ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                restaurant ? 'Update Restaurant' : 'Create Restaurant'
              )}
            </button>
            
            {restaurant && (
              <>
                <button
                  type="button"
                  onClick={() => window.location.href = '/vendor/menu'}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Manage Menu →
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  🔄 Refresh
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageRestaurant;