// src/components/common/Navbar.jsx
import React, { useState, Fragment, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import ktfLogo from '../../assets/ktflogo.jpeg';
import PakFlag from './PakFlag';

const navLinkClass = ({ isActive }) =>
  `font-medium text-sm lg:text-base whitespace-nowrap transition-colors ${
    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
  }`;

const mobileLinkClass =
  'block px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors';

const iconButtonClass =
  'relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';

const avatarUrl = (user, size) =>
  user?.avatar ||
  user?.avatar_url ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email || 'U')}&background=2563EB&color=fff&size=${size}`;

const Logo = ({ to }) => (
  <Link to={to} className="flex items-center gap-2 group flex-shrink-0" aria-label="KTF home">
    <span className="relative">
      <img
        src={ktfLogo}
        alt="KTF"
        className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover shadow-md border-2 border-blue-100 dark:border-blue-800 group-hover:scale-105 transition-transform"
      />
      <span className="absolute -bottom-0.5 -right-1 rounded-sm overflow-hidden ring-2 ring-white dark:ring-gray-900 leading-none">
        <PakFlag className="h-2.5 w-auto block" />
      </span>
    </span>
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { items, count } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes. This used to depend on `navigate`,
  // which is stable, so the menu stayed open over the page the user had just picked.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartCount = count || items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isVendor = user?.role === 'vendor';
  const isUser = user?.role === 'user';

  const themeButton = (
    <button onClick={toggleTheme} className={iconButtonClass} aria-label="Toggle theme">
      {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );

  const cartLink = (
    <Link to="/cart" className={iconButtonClass} aria-label={`Cart (${cartCount} items)`}>
      <ShoppingCartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center shadow">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  );

  const shell = (children) => (
    <nav
      className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-shadow ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="container-custom">{children}</div>
    </nav>
  );

  // Admins and vendors browsing the storefront get a slim bar that leads back to their panel.
  if (isAdmin || isVendor) {
    return shell(
      <div className="flex items-center justify-between h-16 gap-3">
        <Logo to="/" />
        <div className="flex items-center gap-1 sm:gap-2">
          {themeButton}
          <Link
            to={isAdmin ? '/admin/dashboard' : '/vendor/dashboard'}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            <Squares2X2Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{isAdmin ? 'Admin Panel' : 'Vendor Panel'}</span>
          </Link>
          <button onClick={handleLogout} className={`${iconButtonClass} text-red-500 hover:text-red-600`} aria-label="Logout">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return shell(
    <>
      <div className="flex items-center justify-between h-16 gap-3">
        <Logo to="/" />

        {/* Search - desktop, customers only */}
        {isUser && (
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8 relative" role="search">
            <input
              type="search"
              placeholder="Search biryani, nihari, BBQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search food"
              className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        )}

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-5">
          <NavLink to="/restaurants" className={navLinkClass}>Restaurants</NavLink>
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          {!isUser && <NavLink to="/offers" className={navLinkClass}>Offers</NavLink>}

          <div className="flex items-center gap-1">
            {themeButton}
            {isUser && (
              <>
                <Link to="/wishlist" className={iconButtonClass} aria-label="Wishlist">
                  <HeartIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                </Link>
                {cartLink}
              </>
            )}
          </div>

          {isUser ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none">
                <img
                  src={avatarUrl(user, 32)}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-blue-600"
                />
                <span className="text-sm font-medium hidden xl:block max-w-[8rem] truncate">
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
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black/5 focus:outline-none">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.full_name || user?.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  {[
                    ['/profile', 'Profile'],
                    ['/orders', 'My Orders'],
                    ['/wishlist', 'Wishlist'],
                    ['/notifications', 'Notifications'],
                  ].map(([to, label]) => (
                    <Menu.Item key={to}>
                      {({ active }) => (
                        <Link
                          to={to}
                          className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          {label}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
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
          ) : (
            !isAuthenticated && (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium text-sm lg:text-base px-2">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          {isUser && cartLink}
          {themeButton}
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className={iconButtonClass}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isUser && (
            <form onSubmit={handleSearch} className="relative mb-4" role="search">
              <input
                type="search"
                placeholder="Search biryani, nihari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search food"
                className="w-full px-4 py-2.5 pl-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          )}

          <div className="space-y-1">
            <Link to="/restaurants" className={mobileLinkClass}>Restaurants</Link>
            <Link to="/products" className={mobileLinkClass}>Products</Link>
            <Link to="/offers" className={mobileLinkClass}>Offers</Link>
            {isUser && (
              <>
                <Link to="/wishlist" className={mobileLinkClass}>Wishlist</Link>
                <Link to="/orders" className={mobileLinkClass}>My Orders</Link>
                <Link to="/notifications" className={mobileLinkClass}>Notifications</Link>
                <Link to="/profile" className={mobileLinkClass}>Profile</Link>
              </>
            )}
          </div>

          {isUser ? (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 px-3 py-2">
                <img src={avatarUrl(user, 40)} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            !isAuthenticated && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="text-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-lg font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </Transition>
    </>
  );
};

export default Navbar;
