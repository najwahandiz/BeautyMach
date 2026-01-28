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
 *   totalQuantity: number,  // Sum of all item quantities
 *   totalPrice: number,     // Sum of (price * quantity) for all items
 *   isOpen: boolean         // Controls sidebar visibility
 * }
 * 
 * HOW IT WORKS:
 * 1. On app load, cart is initialized from localStorage (if exists)
 * 2. Every cart change automatically saves to localStorage
 * 3. Totals are recalculated after every change
 */

import { createSlice } from '@reduxjs/toolkit';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from './cartUtils';

// ===== HELPER FUNCTION =====

/**
 * Calculate total quantity and total price from items array
 * This runs after every cart modification
 */
const calculateTotals = (items) => {
  return items.reduce(
    (totals, item) => ({
      totalQuantity: totals.totalQuantity + item.quantity,
      totalPrice: totals.totalPrice + (item.price * item.quantity)
    }),
    { totalQuantity: 0, totalPrice: 0 }
  );
};

// ===== INITIAL STATE =====

// Try to load existing cart from localStorage, or use empty cart
const storedCart = loadCartFromStorage();
const initialState = storedCart || {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false  // Sidebar closed by default
};

// ===== CREATE THE SLICE =====

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {
    /**
     * ADD TO CART
     * - If item exists: increase its quantity by 1
     * - If item is new: add it with quantity 1
     * 
     * Usage: dispatch(addToCart({ id, name, price, imageUrl }))
     */
    addToCart: (state, action) => {
      const { id, name, price, imageUrl, category } = action.payload;
      
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        // Item exists - just increase quantity
        existingItem.quantity += 1;
      } else {
        // New item - add to cart
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
     * REMOVE FROM CART
     * Completely removes an item from the cart
     * 
     * Usage: dispatch(removeFromCart(productId))
     */
    removeFromCart: (state, action) => {
      const productId = action.payload;
      
      // Filter out the item
      state.items = state.items.filter(item => item.id !== productId);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    /**
     * INCREASE QUANTITY
     * Adds 1 to the item's quantity
     * 
     * Usage: dispatch(increaseQuantity(productId))
     */
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        item.quantity += 1;
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },

    /**
     * DECREASE QUANTITY
     * Subtracts 1 from item's quantity (minimum is 1)
     * 
     * Usage: dispatch(decreaseQuantity(productId))
     */
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        
        // Save to localStorage
        saveCartToStorage(state);
      }
      // Note: If quantity is 1, we don't go lower. User must use removeFromCart.
    },

    /**
     * UPDATE QUANTITY (set to specific number)
     * 
     * Usage: dispatch(updateQuantity({ id: productId, quantity: 3 }))
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
     * CLEAR CART
     * Removes all items from cart
     * 
     * Usage: dispatch(clearCart())
     */
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      // Clear from localStorage
      clearCartStorage();
    },

    /**
     * OPEN CART SIDEBAR
     * 
     * Usage: dispatch(openCart())
     */
    openCart: (state) => {
      state.isOpen = true;
    },

    /**
     * CLOSE CART SIDEBAR
     * 
     * Usage: dispatch(closeCart())
     */
    closeCart: (state) => {
      state.isOpen = false;
    },

    /**
     * TOGGLE CART SIDEBAR
     * 
     * Usage: dispatch(toggleCart())
     */
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

// ===== EXPORT ACTIONS =====
export const { 
  addToCart, 
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity, 
  clearCart,
  openCart,
  closeCart,
  toggleCart
} = cartSlice.actions;

// ===== EXPORT REDUCER =====
export default cartSlice.reducer;
