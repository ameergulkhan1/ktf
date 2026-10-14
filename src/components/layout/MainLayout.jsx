// src/components/layout/MainLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ErrorBoundary from '../common/ErrorBoundary';
import ChatWidget from '../ai/ChatWidget';

const MainLayout = () => {
  const { pathname } = useLocation();

  // New page, start at the top (a client-side route change keeps the old scroll position).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
