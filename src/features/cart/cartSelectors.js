
export const selectCartItems = (state) => state.cart.items;

export const selectCartQuantity = (state) => state.cart.totalQuantity;

export const selectCartTotal = (state) => state.cart.totalPrice;

export const selectCartIsOpen = (state) => state.cart.isOpen;

export const selectCartIsEmpty = (state) => state.cart.items.length === 0;

export const selectIsInCart = (state, productId) => 
  state.cart.items.some(item => item.id === productId);

export const selectItemQuantity = (state, productId) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

