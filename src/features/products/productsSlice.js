/**
 * productsSlice.js
 * Redux slice for products: list, loading, error, success flags.
 * Async work is done in productsThunks (fetch, create, update, delete).
 */

import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, deleteProduct, createProduct, updateProduct } from "./productsThunks";

const initialState = {
  productsData: [],
  error: null,
  loading: false,
  success: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    // Clear error message (e.g. after showing toast)
    clearError: (state) => {
      state.error = null;
    },
    // Clear success flag (e.g. after adding product)
    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsData = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productsData = state.productsData.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.productsData.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.productsData.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.productsData[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = productsSlice.actions;
export default productsSlice.reducer;
