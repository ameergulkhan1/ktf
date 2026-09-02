// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - location:', location.pathname);
  console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🔒 ProtectedRoute - user:', user?.role);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Public routes that should be accessible by all authenticated users
  const publicRoutes = ['/restaurants', '/products', '/search'];
  
  // ✅ Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  });

  // ✅ Allow access to public routes regardless of role
  if (isPublicRoute) {
    console.log('🔒 Public route - allowing access');
    return <Outlet />;
  }

  // ✅ Check if user has allowed role for protected routes
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('🔒 Role not allowed. User role:', user?.role, 'Allowed:', allowedRoles);
    
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;