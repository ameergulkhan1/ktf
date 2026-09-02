// src/context/CartContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useCart as useCartHook } from '../hooks/useCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cart = useCartHook();
  
  // ✅ Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    items: cart.items,
    loading: cart.loading,
    error: cart.error,
    total: cart.total,
    count: cart.count,
    fetchCart: cart.fetchCart,
    addItem: cart.addItem,
    updateItem: cart.updateItem,
    removeItem: cart.removeItem,
    clearCart: cart.clearCart,
    getCartTotal: cart.getCartTotal,
    getItemCount: cart.getItemCount,
  }), [
    cart.items,
    cart.loading,
    cart.error,
    cart.total,
    cart.count,
    cart.fetchCart,
    cart.addItem,
    cart.updateItem,
    cart.removeItem,
    cart.clearCart,
    cart.getCartTotal,
    cart.getItemCount,
  ]);
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};