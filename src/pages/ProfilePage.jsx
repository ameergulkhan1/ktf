// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserIcon, EnvelopeIcon, PencilSquareIcon, PhoneIcon, MapPinIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

const FIELDS = [
  { name: 'full_name', label: 'Full name', icon: UserIcon, type: 'text', required: true },
  { name: 'phone', label: 'Phone', icon: PhoneIcon, type: 'tel', placeholder: '03XX XXXXXXX' },
  { name: 'address', label: 'Address', icon: MapPinIcon, type: 'text', placeholder: 'House, street, area' },
  { name: 'city', label: 'City', icon: BuildingOffice2Icon, type: 'text', placeholder: 'e.g. Islamabad' },
];

const toForm = (u) => ({
  full_name: u?.full_name || '',
  phone: u?.phone || '',
  address: u?.address || '',
  city: u?.city || '',
});

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(toForm(user));

  // The stored login user only has id/name/email/role; fetch the full record once.
  useEffect(() => {
    authApi.getProfile().then((response) => {
      if (response?.success && response.user) {
        setProfile((prev) => ({ ...prev, ...response.user }));
        setFormData(toForm(response.user));
      }
    }).catch(() => {
      /* keep showing the stored details */
    });
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateUser(formData);
      if (response?.success) {
        setProfile((prev) => ({ ...prev, ...response.user }));
        toast.success('Profile updated');
        setIsEditing(false);
      } else {
        toast.error(response?.message || 'Could not save your profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setFormData(toForm(profile));
    setIsEditing(false);
  };

  return (
    <div className="container-custom py-6 sm:py-12">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center text-white">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl sm:text-4xl font-bold border-4 border-white/30">
            {profile?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-4">{profile?.full_name || 'Your profile'}</h1>
          <p className="text-white/80 text-sm mt-1 break-all">{profile?.email}</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                <PencilSquareIcon className="h-5 w-5" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="input-label">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="input-field"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your email address can't be changed here. <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact us</Link> if you need to update it.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={cancel}
                  className="flex-1 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="space-y-3">
              {[{ name: 'email', label: 'Email', icon: EnvelopeIcon }, ...FIELDS].map(({ name, label, icon: Icon }) => (
                <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="font-medium text-gray-900 dark:text-white break-words">{profile?.[name] || 'Not set'}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link to="/orders" className="text-center px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium">
              My Orders
            </Link>
            <Link to="/wishlist" className="text-center px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium">
              Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
