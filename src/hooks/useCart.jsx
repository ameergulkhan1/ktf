// src/hooks/useCart.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const mounted = useRef(true);
  const fetchedRef = useRef(false);
  const fetchTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      console.log('ℹ️ No user, returning empty cart');
      setItems([]);
      setTotal(0);
      setCount(0);
      setLoading(false);
      return { success: true, items: [] };
    }

    // ✅ Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log('⏳ Fetch already in progress, skipping...');
      return { success: true, items: items };
    }

    // ✅ Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('📦 Fetching cart for user:', user.id);
      const response = await cartApi.get(user.id);
      console.log('📥 Cart fetch response:', response);
      
      if (mounted.current) {
        const cartItems = response?.items || [];
        const cartTotal = response?.total || 0;
        const cartCount = response?.count || cartItems.length || 0;
        
        console.log('✅ Setting cart items:', cartItems.length);
        console.log('✅ Setting cart total:', cartTotal);
        console.log('✅ Setting cart count:', cartCount);
        
        setItems(cartItems);
        setTotal(cartTotal);
        setCount(cartCount);
      }
      return response;
    } catch (err) {
      console.error('❌ Error fetching cart:', err);
      if (mounted.current) {
        setError(null);
      }
      return { success: true, items: [] };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [user?.id]);

  // ✅ Initial fetch - only once
  useEffect(() => {
    mounted.current = true;

    // AuthContext hydrates `user` from localStorage inside its own effect, and child
    // effects run before parent ones, so on a hard page load this ran once with
    // user === null. The `else` branch below then announced an empty, finished cart --
    // loading false, items [] -- and anything guarding on "cart is empty" acted on it.
    // /checkout did exactly that and bounced the customer back to /cart with their
    // items still in it. While auth is hydrating there is simply nothing to say yet,
    // so stay in the loading state and wait for the re-run.
    if (authLoading) {
      return () => {
        mounted.current = false;
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
          fetchTimeoutRef.current = null;
        }
      };
    }

    // ✅ Only fetch if user exists and we haven't fetched yet
    if (user?.id && !fetchedRef.current) {
      fetchedRef.current = true;
      // ✅ Small delay to prevent duplicate fetches
      fetchTimeoutRef.current = setTimeout(() => {
        fetchCart();
      }, 300);
    } else if (!user?.id) {
      setItems([]);
      setTotal(0);
      setCount(0);
      setLoading(false);
    }

    return () => {
      mounted.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [user?.id, authLoading]);

  // ✅ Add item to cart
  const addItem = useCallback(async (productId, quantity = 1, price = 0, name = 'Product', menuItemId = null) => {
    if (!user?.id) {
      toast.error('Please login to add items to cart');
      return { success: false, message: 'User not logged in' };
    }

    try {
      const itemData = {
        user_id: user.id,
        quantity,
        price,
        ...(menuItemId ? { menu_item_id: menuItemId } : { product_id: productId })
      };
      console.log('📤 Adding to cart:', itemData);
      
      const response = await cartApi.add(itemData);
      
      console.log('📥 Add to cart response:', response);
      
      if (response?.success) {
        // ✅ Optimistic update - update UI immediately
        setItems(prev => {
          const existingIndex = prev.findIndex(item => item.product_id === productId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
              total: (updated[existingIndex].quantity + quantity) * updated[existingIndex].price
            };
            return updated;
          }
          const newItem = {
            id: response.item?.id || Date.now(),
            product_id: productId,
            quantity: quantity,
            price: price,
            name: name,
            image: null,
            total: price * quantity
          };
          return [...prev, newItem];
        });
        
        setTotal(prev => prev + (price * quantity));
        setCount(prev => prev + 1);
        
        toast.success('Item added to cart!');
      } else {
        toast.error(response?.message || 'Failed to add item');
      }
      return response;
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      toast.error('Failed to add item to cart');
      return { success: false, message: err.message };
    }
  }, [user?.id]);

  // ✅ Update item quantity
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      const response = await cartApi.update(itemId, quantity);
      if (response?.success) {
        setItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity, total: quantity * item.price }
            : item
        ));
        toast.success('Cart updated');
      }
      return response;
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart');
      return { success: false, message: err.message };
    }
  }, []);

  // ✅ Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      const response = await cartApi.remove(itemId);
      if (response?.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Item removed from cart');
      }
      return response;
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove item');
      return { success: false, message: err.message };
    }
  }, []);

  // ✅ Clear cart
  const clearCart = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await cartApi.clear(user.id);
      if (response?.success) {
        setItems([]);
        setTotal(0);
        setCount(0);
        toast.success('Cart cleared');
      }
      return response;
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
      return { success: false, message: err.message };
    }
  }, [user?.id]);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  return {
    items,
    loading,
    error,
    total,
    count,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCartTotal,
    getItemCount
  };
};