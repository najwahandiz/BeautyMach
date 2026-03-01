/**
 * Redux slice for managing shopping cart state.
 * Uses localStorage for persistence across page refreshes.
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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {  
    addToCart: (state, action) => {
      const { id, name, price, imageUrl, category } = action.payload;     
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
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

    removeFromCart: (state, action) => {
      const productId = action.payload;
      
      state.items = state.items.filter(item => item.id !== productId);
      
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      
      saveCartToStorage(state);
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        item.quantity += 1;
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        
        saveCartToStorage(state);
      }
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        
        saveCartToStorage(state);
      }
    },

    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      // Clear from localStorage
      clearCartStorage();
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
 
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
  clearCart,
  openCart,
  closeCart,
  toggleCart
} = cartSlice.actions;

// ===== EXPORT REDUCER =====
export default cartSlice.reducer;
