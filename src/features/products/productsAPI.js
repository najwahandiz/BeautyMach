/**
 * productsAPI.js
 * Calls MockAPI (axios) for products: get list, add, update, delete.
 * Used by productsThunks. On error we throw so the thunk can set error state.
 */

import axios from "axios";

const API_URL =
  import.meta.env.VITE_MOCKAPI_PRODUCTS_URL ||
  "https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/products";

export async function getProducts() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function addProduct(newProduct) {
  const res = await axios.post(API_URL, newProduct);
  return res.data;
}

export async function updateProduct(productToUpdate) {
  const res = await axios.put(`${API_URL}/${productToUpdate.id}`, productToUpdate);
  return res.data;
}

export async function deleteProduct(productId) {
  await axios.delete(`${API_URL}/${productId}`);
}
