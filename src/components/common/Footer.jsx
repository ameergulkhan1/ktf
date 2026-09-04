// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin, FiTruck, FiShield, FiClock } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 transition-colors duration-200">
      {/* Top Section - Brand and Social */}
      <div className="container-custom pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl font-bold text-blue-400">KTF</span>
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">DELIVERY 🇵🇰</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing the authentic taste of Pakistan to your doorstep. 
              Order your favorite desi meals with ease and enjoy the rich flavors of Pakistani cuisine.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Facebook">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Instagram">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="YouTube">
                <FiYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">For Vendors 🇵🇰</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vendor-register" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>123 Food Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>info@ktf.pk</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiClock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>Mon-Sun: 10:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3 text-gray-400">
            <FiTruck className="h-6 w-6 text-blue-400" />
            <div>
              <p className="font-medium text-white text-sm">Free Delivery</p>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <FiShield className="h-6 w-6 text-blue-400" />
            <div>
              <p className="font-medium text-white text-sm">Secure Payment</p>
              <p className="text-xs text-gray-500">100% safe checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <FiClock className="h-6 w-6 text-blue-400" />
            <div>
              <p className="font-medium text-white text-sm">Fast Delivery</p>
              <p className="text-xs text-gray-500">30-45 min average</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-2xl">🇵🇰</span>
            <div>
              <p className="font-medium text-white text-sm">Authentic Desi</p>
              <p className="text-xs text-gray-500">Real Pakistani flavors</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} KTF Delivery. All rights reserved. 🇵🇰
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-blue-400 transition-colors">
              Terms
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/refund" className="text-gray-500 hover:text-blue-400 transition-colors">
              Refund
            </Link>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with ❤️ in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;