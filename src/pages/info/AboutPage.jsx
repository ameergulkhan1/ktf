// src/pages/info/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiClock, FiHeart, FiUsers } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import { SITE } from '../../config/site';

const values = [
  [FiHeart, 'Authentic food', 'Real Pakistani flavours from local kitchens and restaurants we know and trust.'],
  [FiClock, 'Reliable delivery', 'Clear delivery estimates and order tracking from the kitchen to your door.'],
  [FiShield, 'Fair for vendors', 'Simple tools for restaurants to manage menus, orders and earnings.'],
  [FiUsers, 'Built for the community', 'A local platform that supports local businesses and the people who run them.'],
];

const AboutPage = () => (
  <>
    <PageHeader title={`About ${SITE.name}`} subtitle={SITE.tagline} />
    <div className="container-custom py-10 sm:py-14 space-y-12">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          <h2 className="section-title">Our story</h2>
          <p>
            {SITE.fullName} started with a simple idea: the best biryani, nihari and BBQ in town should be a few taps
            away. We bring together home-grown restaurants and food vendors on one easy platform so customers can
            discover them and order with confidence.
          </p>
          <p>
            Vendors list their menus, manage orders and track earnings from their own dashboard, while customers
            browse, order and follow their food until it arrives.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80"
          alt="A plate of biryani"
          loading="lazy"
          className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
        />
      </section>

      <section>
        <h2 className="section-title text-center mb-8">What we stand for</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map(([Icon, title, text]) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-blue-600 text-white p-6 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">Run a restaurant or home kitchen?</h2>
          <p className="text-white/85 mt-1">Join {SITE.name} and reach new customers in your city.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/vendor-register" className="px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-center hover:bg-gray-100">
            Become a Vendor
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-xl border border-white/40 font-semibold text-center hover:bg-white/10">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  </>
);

export default AboutPage;
