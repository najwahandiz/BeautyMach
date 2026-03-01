/*MockAPI calls for orders: create order*/

import axios from 'axios';

const ORDERS_BASE =
  import.meta.env.VITE_MOCKAPI_ORDERS_URL ||
  'https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/orders';

/*Fetch all orders from MockAPI.*/
export async function getOrders() {
  const { data } = await axios.get(ORDERS_BASE);
  return data;
}

/*Create a new order in MockAPI.*/
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
