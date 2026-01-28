/**
 * Redux Store Configuration
 * 
 * The store holds the entire state of your app.
 * All components can access this state using useSelector.
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    // Products state - manages product data
    products: productsReducer,
    
    // User state - manages user profile, quiz results, recommendations
    user: userReducer,
    
    // Cart state - manages shopping cart
    cart: cartReducer,
  },
});