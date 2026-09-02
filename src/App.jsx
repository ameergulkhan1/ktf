// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loader from './components/common/Loader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// ✅ PUBLIC PAGES (accessible by everyone)
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const RestaurantsPage = lazy(() => import('./pages/RestaurantsPage'));
const RestaurantDetail = lazy(() => import('./components/restaurant/RestaurantDetail'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetail = lazy(() => import('./components/products/ProductDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// ✅ USER PAGES (only logged in users)
const CartPage = lazy(() => import('./components/cart/CartPage'));
const Checkout = lazy(() => import('./components/orders/Checkout'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetail = lazy(() => import('./components/orders/OrderDetail'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// ✅ ADMIN PAGES
const AdminLogin = lazy(() => import('./components/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/dashboard/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./components/dashboard/admin/UserManagement'));
const VendorApproval = lazy(() => import('./components/dashboard/admin/VendorApproval'));
const RestaurantApproval = lazy(() => import('./components/dashboard/admin/RestaurantApproval'));
const ProductApproval = lazy(() => import('./components/dashboard/admin/ProductApproval'));
const CommissionManagement = lazy(() => import('./components/dashboard/admin/CommissionManagement'));
const Reports = lazy(() => import('./components/dashboard/admin/Reports'));
const Settings = lazy(() => import('./components/dashboard/admin/Settings'));
const Analytics = lazy(() => import('./components/dashboard/admin/Analytics'));
const ActivityLogs = lazy(() => import('./components/dashboard/admin/ActivityLogs'));

// ✅ VENDOR PAGES
const VendorDashboard = lazy(() => import('./components/dashboard/vendor/VendorDashboard'));
const ManageRestaurant = lazy(() => import('./components/dashboard/vendor/ManageRestaurant'));
const ManageMenu = lazy(() => import('./components/dashboard/vendor/ManageMenu'));
const VendorOrders = lazy(() => import('./components/dashboard/vendor/VendorOrders'));
const VendorEarnings = lazy(() => import('./components/dashboard/vendor/VendorEarnings'));
const AddProduct = lazy(() => import('./components/dashboard/vendor/AddProduct')); // ✅ ADDED

// ✅ Cart wrapper component - only provides cart for users
const CartWrapper = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#333', color: '#fff' },
          success: { duration: 3000, style: { background: '#22C55E', color: '#fff' } },
          error: { duration: 4000, style: { background: '#EF4444', color: '#fff' } }
        }}
      />
      
      <Suspense fallback={<Loader fullScreen />}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
              {/* ============================================
                  ADMIN ROUTES - No CartProvider
              ============================================ */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/vendors" element={<VendorApproval />} />
              <Route path="/admin/restaurants" element={<RestaurantApproval />} />
              <Route path="/admin/products" element={<ProductApproval />} />
              <Route path="/admin/commissions" element={<CommissionManagement />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/activity-logs" element={<ActivityLogs />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* ============================================
                  VENDOR ROUTES - No CartProvider
              ============================================ */}
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/restaurant" element={<ManageRestaurant />} />
              <Route path="/vendor/menu" element={<ManageMenu />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/earnings" element={<VendorEarnings />} />
              <Route path="/vendor/products/add" element={<AddProduct />} /> {/* ✅ ADDED */}
              <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />

              {/* ============================================
                  PUBLIC ROUTES - No CartProvider needed
              ============================================ */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>

              {/* ============================================
                  PROTECTED USER ROUTES - WITH CartProvider
                  Only regular users can access these
              ============================================ */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={['user']} />
                }
              >
                <Route element={<MainLayout />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                </Route>
              </Route>

              {/* ============================================
                  FALLBACK
              ============================================ */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Suspense>
    </>
  );
}

export default App;