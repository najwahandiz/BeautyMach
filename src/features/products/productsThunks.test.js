/**
 * ============================================================
 * 4️⃣ ASYNC THUNK TEST
 * ============================================================
 *
 * WHAT ASYNC THUNKS ARE:
 * - Functions that return a function. The inner function gets dispatch and can run async code.
 * - They call an API, then dispatch actions: pending → fulfilled (or rejected).
 *
 * HOW dispatch WORKS:
 * - You pass the result of the thunk to store.dispatch(). The thunk runs, does async work,
 *   then dispatches pending/fulfilled/rejected actions so the slice can update state.
 *
 * STATE DURING ASYNC FLOW:
 * - pending: loading = true, error = null
 * - fulfilled: loading = false, data in state
 * - rejected: loading = false, error in state
 *
 * We mock the API so we don't call the real server. We only test that the thunk dispatches
 * the right actions and that the reducer updates state correctly.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import { fetchProducts } from './productsThunks';
import * as productsAPI from './productsAPI';

// Mock the API module so we control what getProducts() returns
vi.mock('./productsAPI', () => ({
  getProducts: vi.fn(),
}));

describe('fetchProducts (async thunk)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { products: productsReducer } });
    vi.clearAllMocks();
  });

  // When the API returns data, state should have loading false and productsData filled
  test('fulfilled: stores products when API succeeds', async () => {
    const fakeProducts = [{ id: '1', name: 'Cream', price: 20 }];
    productsAPI.getProducts.mockResolvedValue(fakeProducts);

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.loading).toBe(false);
    expect(state.productsData).toEqual(fakeProducts);
    expect(state.error).toBe(null);
  });

  // When the API fails, state should have loading false and error set
  test('rejected: sets error when API fails', async () => {
    productsAPI.getProducts.mockRejectedValue(new Error('Network error'));

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});
