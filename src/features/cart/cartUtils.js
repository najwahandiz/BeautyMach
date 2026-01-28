/**
 * cartUtils.js
 * 
 * Helper functions for localStorage operations.
 * Keeps cart data persistent across browser refreshes.
 * 
 * WHY LOCALSTORAGE?
 * - Cart survives page refresh
 * - Cart survives closing browser
 * - No server needed for cart persistence
 * - Simple and beginner-friendly
 */

// Key used to store cart in localStorage
const CART_STORAGE_KEY = 'beautyMatch_cart';

/**
 * LOAD CART FROM LOCALSTORAGE
 * 
 * Called when app starts to restore saved cart.
 * Returns null if no cart exists or if there's an error.
 * 
 * @returns {Object|null} The saved cart state or null
 */
export const loadCartFromStorage = () => {
  try {
    const storedData = localStorage.getItem(CART_STORAGE_KEY);
    
    if (storedData) {
      const parsedCart = JSON.parse(storedData);
      
      // Make sure isOpen is false when loading (don't restore open state)
      return {
        ...parsedCart,
        isOpen: false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return null;
  }
};

/**
 * SAVE CART TO LOCALSTORAGE
 * 
 * Called after every cart modification.
 * Saves items, totalQuantity, and totalPrice.
 * 
 * @param {Object} cartState - The current cart state from Redux
 */
export const saveCartToStorage = (cartState) => {
  try {
    // Only save the data we need (not isOpen)
    const dataToSave = {
      items: cartState.items,
      totalQuantity: cartState.totalQuantity,
      totalPrice: cartState.totalPrice
    };
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * CLEAR CART FROM LOCALSTORAGE
 * 
 * Removes cart data completely from localStorage.
 * Called when user clears their cart.
 */
export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

/**
 * FORMAT PRICE
 * 
 * Formats a number as currency (MAD - Moroccan Dirham)
 * 
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return `${price.toFixed(2)} MAD`;
};

