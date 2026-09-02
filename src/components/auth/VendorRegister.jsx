import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVendor } from '../../hooks/useVendor';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VendorRegister = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const createVendor = useCreateVendor();
  
  const [formData, setFormData] = useState({
    user_id: user?.id || '',
    business_name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ If user is not logged in, redirect to login
  if (!isAuthenticated || !user) {
    console.log('🔒 User not authenticated, redirecting to login');
    navigate('/login');
    return null;
  }

  // ✅ If user is not a vendor, redirect to register
  if (user.role !== 'vendor') {
    console.log('⚠️ User role is not vendor. Current role:', user.role);
    toast.error('Please register as a vendor first.');
    navigate('/register');
    return null;
  }

  console.log('✅ Vendor registration page - User:', user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const vendorData = {
      ...formData,
      user_id: user.id,
    };

    console.log('📤 Submitting vendor data:', vendorData);

    try {
      const result = await createVendor.mutateAsync(vendorData);
      console.log('✅ Vendor registration result:', result);
      toast.success('Vendor registration submitted for review!');
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('❌ Vendor registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Become a Vendor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Complete your business details to start selling
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="business_name" className="input-label">
                Business Name
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="input-label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="address" className="input-label">
                Business Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your business address"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorRegister;