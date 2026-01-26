import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "./productsAPI";
import { deleteProduct, addProduct,updateProduct } from "./productsAPI";

export const fetchProducts = createAsyncThunk (
   "products/fetchProducts",
   async () => {
    const products = await getProducts();
    return products;
    }
)

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (newProduct) => {
            const product = await addProduct(newProduct);
            return product;
        
    }
);

export const deleteProduit = createAsyncThunk (
    "products/deleteProduct",
    async (productToDelete) => {
        await deleteProduct(productToDelete);
        return productToDelete; // Return the ID so the slice can filter it
    }
)

export const updateProduit = createAsyncThunk (
    "products/updateProduit",
    async (productToUpdate) => {
        const res = await updateProduct(productToUpdate);
        return res;
    }
)

