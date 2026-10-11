// src/context/WishlistContext.jsx
// The wishlist API (/api/wishlist) was fully implemented on the backend, but the UI never
// used it: the Wishlist page rendered a hardcoded empty array and every heart button only
// toggled local component state. This context loads the customer's wishlist once and lets
// any card ask "is this product saved?" and toggle it.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { wishlistApi } from '../api/wishlistApi';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(() => new Set());

  const isCustomer = user?.role === 'user';

  const refresh = useCallback(async () => {
    if (!isCustomer) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistApi.get();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    refresh();
  }, [refresh, user?.id]);

  const ids = useMemo(() => new Set(items.map((item) => String(item.product_id))), [items]);

  const isInWishlist = useCallback((productId) => ids.has(String(productId)), [ids]);

  const toggle = useCallback(
    async (productId) => {
      if (!user) {
        toast.error('Please login to save items to your wishlist');
        navigate('/login');
        return;
      }
      if (!isCustomer) {
        toast.error('Wishlists are available for customer accounts');
        return;
      }
      const key = String(productId);
      if (pending.has(key)) return;
      setPending((prev) => new Set(prev).add(key));
      try {
        if (ids.has(key)) {
          await wishlistApi.remove(productId);
          setItems((prev) => prev.filter((item) => String(item.product_id) !== key));
          toast.success('Removed from wishlist');
        } else {
          await wishlistApi.add(productId);
          toast.success('Added to wishlist');
          await refresh();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not update wishlist');
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [user, isCustomer, ids, pending, navigate, refresh]
  );

  const value = useMemo(
    () => ({ items, loading, isInWishlist, toggle, refresh }),
    [items, loading, isInWishlist, toggle, refresh]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
