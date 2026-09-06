import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// ============================================
// ✅ DISABLE ALL CONSOLE LOGS IN PRODUCTION
// ============================================
if (import.meta.env.PROD) {
  // Store reference to original console (optional)
  const originalConsole = { ...console };
  
  // Override all console methods with empty functions
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.table = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.time = () => {};
  console.timeEnd = () => {};
  console.count = () => {};
  console.trace = () => {};
  console.assert = () => {};
  console.dir = () => {};
  console.dirxml = () => {};
  console.groupCollapsed = () => {};
  
  // ✅ Keep only essential errors (optional)
  // console.error = originalConsole.error; // Uncomment to keep errors
  
  // ✅ Disable React DevTools in production
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = () => {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = () => {};
  }
}

// ============================================
// ✅ REMOVE REACT QUERY DEVTOOLS IN PRODUCTION
// ============================================
const shouldShowDevtools = !import.meta.env.PROD;

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// ============================================
// ✅ HANDLE UNCAUGHT ERRORS GRACEFULLY
// ============================================
if (import.meta.env.PROD) {
  // Prevent default error logging
  window.addEventListener('error', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return true;
  });
  
  // Prevent unhandled promise rejections from showing
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return true;
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      {shouldShowDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
);