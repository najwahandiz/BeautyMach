/**
 * cartSelectors.js
 * 
 * Selector functions to read cart data from Redux state.
 * Using selectors keeps components clean and makes testing easier.
 * 
 * HOW TO USE:
 * import { selectCartItems } from '../features/cart/cartSelectors';
 * const items = useSelector(selectCartItems);
 */

/**
 * Get all cart items
 * 
 * Usage: const items = useSelector(selectCartItems);
 * Returns: Array of cart items
 */
export const selectCartItems = (state) => state.cart.items;

/**
 * Get total quantity (number of items in cart)
 * 
 * Usage: const count = useSelector(selectCartQuantity);
 * Returns: Number
 */
export const selectCartQuantity = (state) => state.cart.totalQuantity;

/**
 * Get total price of all items
 * 
 * Usage: const total = useSelector(selectCartTotal);
 * Returns: Number
 */
export const selectCartTotal = (state) => state.cart.totalPrice;

/**
 * Check if cart sidebar is open
 * 
 * Usage: const isOpen = useSelector(selectCartIsOpen);
 * Returns: Boolean
 */
export const selectCartIsOpen = (state) => state.cart.isOpen;

/**
 * Check if cart is empty
 * 
 * Usage: const isEmpty = useSelector(selectCartIsEmpty);
 * Returns: Boolean
 */
export const selectCartIsEmpty = (state) => state.cart.items.length === 0;

/**
 * Check if a specific product is in cart
 * 
 * Usage: const isInCart = useSelector(state => selectIsInCart(state, productId));
 * Returns: Boolean
 */
export const selectIsInCart = (state, productId) => 
  state.cart.items.some(item => item.id === productId);

/**
 * Get quantity of a specific product in cart
 * 
 * Usage: const qty = useSelector(state => selectItemQuantity(state, productId));
 * Returns: Number (0 if not in cart)
 */
export const selectItemQuantity = (state, productId) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

