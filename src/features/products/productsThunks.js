/**
 * productsThunks.js
 * Async actions for products: fetch list, create, update, delete.
 * Each thunk calls the API then Redux updates state in productsSlice.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  addProduct,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
} from "./productsAPI";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts();
      return products;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const product = await addProduct(newProduct);
      return product;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProductAPI(productId);
      return productId;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productToUpdate, { rejectWithValue }) => {
    try {
      const updated = await updateProductAPI(productToUpdate);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update product");
    }
  }
);

