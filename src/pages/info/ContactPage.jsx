// src/pages/info/ContactPage.jsx
// There is no contact/support endpoint in the backend, so the form opens the visitor's
// email app with the message pre-filled instead of pretending to submit it somewhere.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import { SITE } from '../../config/site';
import { useAuth } from '../../hooks/useAuth';

const ContactPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(form.subject || 'Website enquiry')}&body=${encodeURIComponent(body)}`;
  };

  const details = [
    [FiPhone, 'Phone', SITE.phone, `tel:${SITE.phone.replace(/\s/g, '')}`],
    [FiMail, 'Email', SITE.email, `mailto:${SITE.email}`],
    [FiMapPin, 'Address', SITE.address],
    [FiClock, 'Hours', SITE.hours],
  ];

  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions about an order, becoming a vendor, or anything else? We're happy to help." />
      <div className="container-custom py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-4">
            {details.map(([Icon, label, value, href]) => (
              <div key={label} className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  {href ? (
                    <a href={href} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <p className="text-sm text-gray-500 dark:text-gray-400 px-1">
              Looking for quick answers? See our <Link to="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ</Link>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="input-label">Your name</label>
                <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="email" className="input-label">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="input-label">Subject</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="e.g. Question about order #1234" />
            </div>
            <div>
              <label htmlFor="message" className="input-label">Message</label>
              <textarea id="message" name="message" required rows={6} value={form.message} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">This opens your email app with your message ready to send.</p>
              <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2">
                <FiSend className="w-4 h-4" />
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
