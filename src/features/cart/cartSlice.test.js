/**
 * ============================================================
 * 2️⃣ REDUX SLICE TEST
 * ============================================================
 *
 * HOW REDUCERS WORK:
 * - A reducer is a function: (currentState, action) => newState
 * - It must be PURE: same state + same action always give the same new state.
 * - We don't mutate state; we return a new state (Redux Toolkit uses Immer so we can "mutate" in place).
 *
 * WHY REDUCER TESTING IS IMPORTANT:
 * - Cart logic (add, remove, quantity) is the heart of the app. If it breaks, the cart breaks.
 * - Testing reducers is easy: call reducer with state and action, expect the new state.
 *
 * REDUX TOOLKIT + IMMER:
 * - createSlice lets you write "mutating" logic (e.g. state.items.push(...)).
 * - Immer (used internally) turns that into an immutable update. So we test the outcome, not the syntax.
 */

import { describe, test, expect, vi } from 'vitest';

// Mock cartUtils so we don't touch real localStorage and we get a fixed initial state
vi.mock('./cartUtils', () => ({
  loadCartFromStorage: () => null,
  saveCartToStorage: () => {},
  clearCartStorage: () => {},
}));

// Import AFTER mock so the slice uses mocked cartUtils when it runs
const { default: cartReducer, addToCart, increaseQuantity } = await import('./cartSlice');

describe('cartSlice', () => {
  // Test initial state: empty cart when no stored data
  test('has correct initial state when no stored cart', () => {
    const state = cartReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      isOpen: false,
    });
  });

  // Test addToCart: adding one item creates one entry with quantity 1
  test('addToCart adds a new item with quantity 1', () => {
    const initialState = { items: [], totalQuantity: 0, totalPrice: 0, isOpen: false };
    const action = addToCart({
      id: 'p1',
      name: 'Serum',
      price: 25,
      imageUrl: '/img.jpg',
      category: 'Face',
    });
    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toMatchObject({ id: 'p1', name: 'Serum', quantity: 1, price: 25 });
    expect(newState.totalQuantity).toBe(1);
    expect(newState.totalPrice).toBe(25);
  });

  // Test quantity update: adding the same item again increases quantity
  test('addToCart increases quantity when item already exists', () => {
    const initialState = {
      items: [{ id: 'p1', name: 'Serum', price: 25, imageUrl: '', category: '', quantity: 2 }],
      totalQuantity: 2,
      totalPrice: 50,
      isOpen: false,
    };
    const action = addToCart({
      id: 'p1',
      name: 'Serum',
      price: 25,
      imageUrl: '',
      category: '',
    });
    const newState = cartReducer(initialState, action);

    expect(newState.items[0].quantity).toBe(3);
    expect(newState.totalQuantity).toBe(3);
    expect(newState.totalPrice).toBe(75);
  });

  // Test increaseQuantity reducer
  test('increaseQuantity adds 1 to item quantity and updates totals', () => {
    const initialState = {
      items: [{ id: 'p1', name: 'Serum', price: 10, imageUrl: '', category: '', quantity: 1 }],
      totalQuantity: 1,
      totalPrice: 10,
      isOpen: false,
    };
    const newState = cartReducer(initialState, increaseQuantity('p1'));

    expect(newState.items[0].quantity).toBe(2);
    expect(newState.totalQuantity).toBe(2);
    expect(newState.totalPrice).toBe(20);
  });
});
