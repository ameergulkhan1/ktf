// src/components/layout/PanelLayout.jsx
// Shared shell for the admin and vendor panels.
//
// These routes used to render bare pages: apart from the two dashboards, no admin or vendor
// screen had any navigation, logout or way back, and none of them were protected at the
// route level. This gives every panel page a sidebar on desktop, a slide-in drawer on
// phones, and a role check before anything renders.
import React, { Fragment, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Loader from '../common/Loader';
import ErrorBoundary from '../common/ErrorBoundary';
import ChatWidget from '../ai/ChatWidget';
import ktfLogo from '../../assets/ktflogo.jpeg';

const PANELS = {
  admin: {
    label: 'Admin Panel',
    roles: ['admin', 'super_admin'],
    loginPath: '/admin/login',
    nav: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBagIcon },
      { to: '/admin/products', label: 'Product Approval', icon: ClipboardDocumentCheckIcon },
      { to: '/admin/restaurants', label: 'Restaurants', icon: BuildingStorefrontIcon },
      { to: '/admin/vendors', label: 'Vendors', icon: UserGroupIcon },
      { to: '/admin/users', label: 'Users', icon: UsersIcon },
      { to: '/admin/commissions', label: 'Commissions', icon: BanknotesIcon },
      { to: '/admin/reports', label: 'Reports', icon: DocumentChartBarIcon },
      { to: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
      { to: '/admin/activity-logs', label: 'Activity Logs', icon: ClipboardDocumentListIcon },
      { to: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
    ],
  },
  vendor: {
    label: 'Vendor Panel',
    roles: ['vendor'],
    loginPath: '/login',
    nav: [
      { to: '/vendor/dashboard', label: 'Dashboard', icon: HomeIcon },
      { to: '/vendor/orders', label: 'Orders', icon: ShoppingBagIcon },
      { to: '/vendor/menu', label: 'Menu', icon: CubeIcon },
      { to: '/vendor/products/add', label: 'Add Product', icon: PlusCircleIcon },
      { to: '/vendor/restaurant', label: 'My Restaurant', icon: BuildingStorefrontIcon },
      { to: '/vendor/earnings', label: 'Earnings', icon: BanknotesIcon },
    ],
  },
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
  }`;

const SidebarContent = ({ panel, user, onLogout, isDarkMode, toggleTheme }) => (
  <div className="flex h-full flex-col">
    <Link to={panel.nav[0].to} className="flex items-center gap-3 px-4 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
      <img src={ktfLogo} alt="KTF" className="h-9 w-9 rounded-full object-cover" />
      <div className="leading-tight">
        <p className="font-bold text-gray-900 dark:text-white">KTF</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{panel.label}</p>
      </div>
    </Link>

    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label={panel.label}>
      {panel.nav.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end className={linkClass}>
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-1 flex-shrink-0">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
          {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.full_name || 'Account'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>
      </div>
      <button onClick={toggleTheme} className={linkClass({ isActive: false }) + ' w-full'}>
        {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        {isDarkMode ? 'Light mode' : 'Dark mode'}
      </button>
      <Link to="/" className={linkClass({ isActive: false })}>
        <GlobeAltIcon className="h-5 w-5" />
        View website
      </Link>
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </div>
  </div>
);

const PanelLayout = ({ variant }) => {
  const panel = PANELS[variant];
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  if (loading) return <Loader fullScreen />;

  if (!isAuthenticated || !user) {
    return <Navigate to={panel.loginPath} state={{ from: location }} replace />;
  }

  if (!panel.roles.includes(user.role)) {
    if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    if (user.role === 'admin' || user.role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  const current = panel.nav.find((item) => location.pathname.startsWith(item.to));
  const sidebarProps = { panel, user, onLogout: logout, isDarkMode, toggleTheme };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile drawer */}
      <Transition.Root show={drawerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setDrawerOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-200 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-150 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute right-3 top-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <SidebarContent {...sidebarProps} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{current?.label || panel.label}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-none">{panel.label}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </header>

        <main className="min-w-0">
          <ErrorBoundary resetKey={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default PanelLayout;
