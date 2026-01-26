import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, deleteProduit, createProduct, updateProduit } from "./productsThunks";

const productsSlice = createSlice ({
    name : "products",
    initialState :{ 
        productsData : [],
        error : null,
        loading : false,
        succes : false,
    },

    reducers : {
        
    },

    extraReducers : (builder) => {
        builder
        //fetch products       
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state,action) => {
            state.loading = false;
            state.productsData = action.payload;
        })
        .addCase(fetchProducts.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload
        })

        //delete product
        .addCase(deleteProduit.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProduit.fulfilled, (state,action) => {
            state.loading = false;
            state.productsData = state.productsData.filter(p => p.id !== action.payload);
        })
        .addCase(deleteProduit.rejected,(state, action)=> {
            state.loading = false;
            state.error = action.payload
        })

        // Create product
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.succes = false;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.succes = true;
            state.productsData.push(action.payload);
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.succes = false;
        })

        //update product
        .addCase(updateProduit.pending, (state) => {
            state.loading = true;
            state.error = false;
            state.succes = false;
        })
        .addCase(updateProduit.fulfilled,(state,action) => {
            state.loading = false;
            state.error = false;
            const exist = state.productsData.findIndex(p=>p.id===action.payload.id)

            if(exist !==-1 ){
                state.productsData[exist]=action.payload
            }
            state.succes = true;
            state.productsData = [...state.productsData];
        })
        .addCase(updateProduit.rejected, (state,action) => {
            state.loading = false;  
            state.error = action.payload;
            state.succes = false;
        })

    
    }
})

export const { clearError, clearSuccess } = productsSlice.actions;
export default productsSlice.reducer