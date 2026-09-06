// src/components/layout/Navbar.jsx
import React, { useState, Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../hooks/useTheme';
import {
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import ktfLogo from '../../assets/ktflogo.jpeg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { items, count } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Safe cart count calculation
  const cartCount = count || items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  // Role checks
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  const isUser = user?.role === 'user';

  // If admin or vendor, show minimal navbar (no cart)
  if (isAdmin || isVendor) {
    return (
      <nav className={`bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={`/${user?.role}/dashboard`} className="flex items-center space-x-3 group">
              <img 
                src={ktfLogo} 
                alt="KTF Logo" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-300 border-2 border-blue-100 dark:border-blue-800"
              />
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-blue-600' : 'bg-blue-500'
              } text-white`}>
                {isAdmin ? 'ADMIN' : 'VENDOR'}
              </span>
            </Link>

            {/* Dashboard Link */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                {isAdmin ? 'Admin Panel' : 'Vendor Panel'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Full navbar for users only (with cart)
  return (
    <nav className={`bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 border-b border-gray-200 dark:border-gray-700 ${
      isScrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group flex-shrink-0">
            <div className="relative">
              <img 
                src={ktfLogo} 
                alt="KTF Logo - Authentic Pakistani Food Delivery" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-300 border-2 border-blue-100 dark:border-blue-800 group-hover:border-blue-500 dark:group-hover:border-blue-400"
              />
              <span className="absolute -bottom-1 -right-1 text-[8px] md:text-[10px] bg-blue-600 text-white rounded-full px-1 md:px-1.5 py-0.5 border-2 border-white dark:border-gray-900 leading-none">
                🇵🇰
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          {isUser && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search biryani, nihari, BBQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-sm"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </form>
            </div>
          )}

          {/* Desktop Navigation - Right side */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-6">
            {isUser ? (
              <>
                <Link to="/restaurants" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base whitespace-nowrap">
                  Restaurants
                </Link>
                <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base whitespace-nowrap">
                  Products
                </Link>
                
                <button
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <SunIcon className="h-5 w-5 lg:h-6 lg:w-6" /> : <MoonIcon className="h-5 w-5 lg:h-6 lg:w-6" />}
                </button>
                
                <Link to="/wishlist" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1">
                  <HeartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </Link>
                
                {/* Cart */}
                <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1">
                  <ShoppingCartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors focus:outline-none">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email)}&background=2563EB&color=fff&size=32`}
                      alt={user?.full_name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-blue-600 transition-all"
                    />
                    <span className="text-sm font-medium hidden xl:block">
                      {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3 border-b dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.full_name || user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.role?.toUpperCase()}
                        </p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/profile" className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/orders" className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            My Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/wishlist" className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            Wishlist
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t dark:border-gray-700">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              // Public Nav (Not logged in)
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg">
                  Sign Up 🇵🇰
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle + Icons */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart Icon */}
            {isUser && (
              <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1 md:hidden"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay Style */}
        <Transition
          show={isMenuOpen && isUser}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 -translate-y-4"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-4"
        >
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search biryani, nihari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link 
                to="/restaurants" 
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🏪 Restaurants
              </Link>
              <Link 
                to="/products" 
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🍽️ Products
              </Link>
              <Link 
                to="/wishlist" 
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ❤️ Wishlist
              </Link>
              <Link 
                to="/orders" 
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                📦 My Orders
              </Link>
              <Link 
                to="/profile" 
                className="block px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                👤 Profile
              </Link>

              {/* User Info */}
              {user && (
                <div className="px-3 py-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email)}&background=2563EB&color=fff&size=40`}
                      alt={user?.full_name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2.5 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-base font-medium mt-1"
              >
                <ArrowRightOnRectangleIcon className="inline h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </Transition>

        {/* Public Nav Mobile (Not logged in) */}
        {!isAuthenticated && isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-4">
            <div className="space-y-3">
              <Link 
                to="/login" 
                className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:border-blue-600 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-base font-medium shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up 🇵🇰
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;