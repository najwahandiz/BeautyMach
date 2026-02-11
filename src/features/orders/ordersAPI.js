/**
 * ordersAPI.js
 *
 * MockAPI calls for orders: create order, update order (e.g. emailSent).
 * Base URL follows the same MockAPI project as products.
 */

import axios from 'axios';

const ORDERS_BASE =
  import.meta.env.VITE_MOCKAPI_ORDERS_URL ||
  'https://6972993e32c6bacb12c754e5.mockapi.io/orders';

/**
 * Create a new order in MockAPI.
 * @param {Object} order - { userName, userEmail, items, total }
 * @returns {Promise<Object>} Created order (includes id from MockAPI)
 */
export async function createOrder(order) {
  const payload = {
    userName: order.userName,
    userEmail: order.userEmail,
    items: order.items,
    total: order.total,
    emailSent: false,
  };
  const { data } = await axios.post(ORDERS_BASE, payload);
  return data;
}

/**
 * Update an order (e.g. set emailSent after n8n sends the email).
 * @param {string} orderId - Order id from MockAPI
 * @param {Object} updates - e.g. { emailSent: true }
 * @returns {Promise<Object>} Updated order
 */
export async function updateOrder(orderId, updates) {
  const { data } = await axios.patch(`${ORDERS_BASE}/${orderId}`, updates);
  return data;
}
