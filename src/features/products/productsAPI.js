import axios from "axios";

const API_URL = "https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/products";

export async function getProducts () {
    try {
       const res = await axios.get(API_URL);
       return res.data;
    } catch (error) {
        console.log("error in getting data",error);
    }
};

export async function updateProduct (productToUpdate) {
    try {
        const res = await axios.put (`${API_URL}/${productToUpdate.id}`,productToUpdate)
        return res.data;
    } catch (error) {
        console.log("error updating data",error);
    }
}


export async function addProduct(newProduct) {
    try {
        const res = await axios.post(`${API_URL}`,newProduct);
        return res.data;
    } catch (error) {
       console.log("error in adding product",error); 
    }
}


export async function deleteProduct(productToDeleteId) {
    try {
        const res = await axios.delete(`${API_URL}/${productToDeleteId}`)
    } catch (error) {
        
    }
}

