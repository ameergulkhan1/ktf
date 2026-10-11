// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { SITE } from '../../config/site';
import PakFlag from './PakFlag';

const linkClass = 'text-gray-400 hover:text-blue-400 transition-colors';

const columns = [
  {
    title: 'Quick Links',
    links: [
      ['/restaurants', 'Restaurants'],
      ['/products', 'Products'],
      ['/offers', 'Offers'],
      ['/about', 'About Us'],
      ['/contact', 'Contact'],
      ['/blog', 'Blog'],
    ],
  },
  {
    title: 'For Vendors',
    links: [
      ['/vendor-register', 'Become a Vendor'],
      ['/vendor/dashboard', 'Vendor Dashboard'],
      ['/faq', 'FAQ'],
      ['/terms', 'Terms of Service'],
      ['/privacy', 'Privacy Policy'],
    ],
  },
];

const socials = [
  ['facebook', FiFacebook, 'Facebook'],
  ['twitter', FiTwitter, 'Twitter'],
  ['instagram', FiInstagram, 'Instagram'],
  ['youtube', FiYoutube, 'YouTube'],
].filter(([key]) => SITE.social[key]);

const features = [
  [FiTruck, 'Free Delivery', 'On orders over Rs. 50'],
  [FiShield, 'Secure Payment', '100% safe checkout'],
  [FiClock, 'Fast Delivery', '30-45 min average'],
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
      <div className="container-custom pt-12 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-blue-400">{SITE.name}</span>
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">DELIVERY</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing the authentic taste of Pakistan to your doorstep. Order your favorite desi meals with ease and
              enjoy the rich flavors of Pakistani cuisine.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-4 mt-4">
                {socials.map(([key, Icon, label]) => (
                  <a
                    key={key}
                    href={SITE.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-base sm:text-lg font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-blue-400">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-blue-400 break-all">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiClock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800">
          {features.map(([Icon, title, text]) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-white text-sm">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <PakFlag className="h-5 w-auto flex-shrink-0 rounded-sm" />
            <div className="min-w-0">
              <p className="font-medium text-white text-sm">Authentic Desi</p>
              <p className="text-xs text-gray-500">Real Pakistani flavors</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {SITE.fullName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-blue-400">Terms</Link>
            <span className="text-gray-700">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-blue-400">Privacy</Link>
            <span className="text-gray-700">|</span>
            <Link to="/refund" className="text-gray-500 hover:text-blue-400">Refund</Link>
          </div>
          <p className="text-sm text-gray-500">Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
