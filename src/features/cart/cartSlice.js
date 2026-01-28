/**
 * cartSlice.js
 * 
 * Redux slice for managing shopping cart state.
 * Uses localStorage for persistence across page refreshes.
 * 
 * STATE STRUCTURE:
 * {
 *   items: [
 *     { 
 *       id: string,        // Product ID
 *       name: string,      // Product name
 *       price: number,     // Product price
 *       imageUrl: string,  // Product image
 *       quantity: number   // How many of this item
 *     }
 *   ],
 *   totalQuantity: number,
 *   totalPrice: number
 * }
 */

import { createSlice } from '@reduxjs/toolkit';

// ===== LOCALSTORAGE HELPERS =====
const CART_STORAGE_KEY = 'beautyMatch_cart';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return null;
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Calculate totals helper
const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => ({
      totalQuantity: totals.totalQuantity + item.quantity,
      totalPrice: totals.totalPrice + (item.price * item.quantity)
    }),
    { totalQuantity: 0, totalPrice: 0 }
  );
};

// Initial state - try to load from localStorage first
const storedCart = loadCartFromStorage();
const initialState = storedCart || {
  items: [],
  totalQuantity: 0,
  totalPrice: 0
};

// Create the slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {
    /**
     * Add item to cart
     * If item already exists, increase quantity
     * 
     * Usage: dispatch(addToCart({ id, name, price, imageUrl }))
     */
    addToCart: (state, action) => {
      const { id, name, price, imageUrl, category } = action.payload;
      
      // Check if item already in cart
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
      } else {
        // Add new item
        state.items.push({
          id,
          name,
          price: price || 0,
          imageUrl: imageUrl || '',
          category: category || '',
          quantity: 1
        });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    /**
     * Remove item from cart completely
     * 
     * Usage: dispatch(removeFromCart(productId))
     */
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    /**
     * Update item quantity
     * 
     * Usage: dispatch(updateQuantity({ id: productId, quantity: 2 }))
     */
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },

    /**
     * Clear entire cart
     * 
     * Usage: dispatch(clearCart())
     */
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      // Clear from localStorage
      localStorage.removeItem(CART_STORAGE_KEY);
    },

    /**
     * Load cart from localStorage (useful on app start)
     * 
     * Usage: dispatch(loadCart())
     */
    loadCart: (state) => {
      const stored = loadCartFromStorage();
      if (stored) {
        state.items = stored.items;
        state.totalQuantity = stored.totalQuantity;
        state.totalPrice = stored.totalPrice;
      }
    }
  }
});

// Export actions
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  loadCart 
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// ===== SELECTORS =====

/**
 * Get all cart items
 * Usage: const items = useSelector(selectCartItems);
 */
export const selectCartItems = (state) => state.cart.items;

/**
 * Get total quantity
 * Usage: const count = useSelector(selectCartQuantity);
 */
export const selectCartQuantity = (state) => state.cart.totalQuantity;

/**
 * Get total price
 * Usage: const total = useSelector(selectCartTotal);
 */
export const selectCartTotal = (state) => state.cart.totalPrice;

/**
 * Check if item is in cart
 * Usage: const isInCart = useSelector(state => selectIsInCart(state, productId));
 */
export const selectIsInCart = (state, productId) => 
  state.cart.items.some(item => item.id === productId);

