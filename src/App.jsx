// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loader from './components/common/Loader';
import MainLayout from './components/layout/MainLayout';
import PanelLayout from './components/layout/PanelLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Theme, auth, cart and wishlist providers live in main.jsx. App.jsx used to wrap the
// routes in a second Theme/Auth/Cart provider stack, which shadowed the first one and
// made auth initialise and the cart load twice on every page load.

// PUBLIC PAGES
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const RestaurantsPage = lazy(() => import('./pages/RestaurantsPage'));
const RestaurantDetail = lazy(() => import('./components/restaurant/RestaurantDetail'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetail = lazy(() => import('./components/products/ProductDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// INFORMATION PAGES (linked from the footer, previously all redirected to the home page)
const AboutPage = lazy(() => import('./pages/info/AboutPage'));
const ContactPage = lazy(() => import('./pages/info/ContactPage'));
const FaqPage = lazy(() => import('./pages/info/FaqPage'));
const TermsPage = lazy(() => import('./pages/info/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/info/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/info/RefundPage'));
const BlogPage = lazy(() => import('./pages/info/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/info/BlogPostPage'));
const OffersPage = lazy(() => import('./pages/info/OffersPage'));

// CUSTOMER PAGES (logged-in users)
const CartPage = lazy(() => import('./components/cart/CartPage'));
const Checkout = lazy(() => import('./components/orders/Checkout'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetail = lazy(() => import('./components/orders/OrderDetail'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AIAdvisorPage = lazy(() => import('./pages/AIAdvisorPage'));

// ADMIN PAGES
const AdminLogin = lazy(() => import('./components/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/dashboard/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./components/dashboard/admin/UserManagement'));
const VendorApproval = lazy(() => import('./components/dashboard/admin/VendorApproval'));
const RestaurantApproval = lazy(() => import('./components/dashboard/admin/RestaurantApproval'));
const ProductApproval = lazy(() => import('./components/dashboard/admin/ProductApproval'));
const OrdersManagement = lazy(() => import('./components/dashboard/admin/OrdersManagement'));
const CommissionManagement = lazy(() => import('./components/dashboard/admin/CommissionManagement'));
const Reports = lazy(() => import('./components/dashboard/admin/Reports'));
const Settings = lazy(() => import('./components/dashboard/admin/Settings'));
const Analytics = lazy(() => import('./components/dashboard/admin/Analytics'));
const ActivityLogs = lazy(() => import('./components/dashboard/admin/ActivityLogs'));

// VENDOR PAGES
const VendorDashboard = lazy(() => import('./components/dashboard/vendor/VendorDashboard'));
const ManageRestaurant = lazy(() => import('./components/dashboard/vendor/ManageRestaurant'));
const ManageMenu = lazy(() => import('./components/dashboard/vendor/ManageMenu'));
const VendorOrders = lazy(() => import('./components/dashboard/vendor/VendorOrders'));
const VendorEarnings = lazy(() => import('./components/dashboard/vendor/VendorEarnings'));
const AddProduct = lazy(() => import('./components/dashboard/vendor/AddProduct'));

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: 72 }}
        toastOptions={{
          duration: 3000,
          style: { background: '#333', color: '#fff', maxWidth: '90vw' },
          success: { duration: 3000, style: { background: '#16A34A', color: '#fff' } },
          error: { duration: 4000, style: { background: '#DC2626', color: '#fff' } },
        }}
      />

      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<PanelLayout variant="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/vendors" element={<VendorApproval />} />
            <Route path="/admin/restaurants" element={<RestaurantApproval />} />
            <Route path="/admin/products" element={<ProductApproval />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/commissions" element={<CommissionManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
          </Route>

          {/* VENDOR */}
          <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
          <Route element={<PanelLayout variant="vendor" />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/restaurant" element={<ManageRestaurant />} />
            <Route path="/vendor/menu" element={<ManageMenu />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/earnings" element={<VendorEarnings />} />
            <Route path="/vendor/products/add" element={<AddProduct />} />
          </Route>

          {/* PUBLIC */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* "Become a Vendor" links point here; registration handles both roles. */}
            <Route path="/vendor-register" element={<Navigate to="/register?role=vendor" replace />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
          </Route>

          {/* CUSTOMER (logged-in users only) */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<MainLayout />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/ai-advisor" element={<AIAdvisorPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
