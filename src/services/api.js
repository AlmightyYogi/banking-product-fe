import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3001/api",
});

// Products
export const fetchProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

// Bundles
export const fetchBundles = () => API.get("/bundles");
export const createBundle = (data) => API.post("/bundles", data);
export const fetchBundleById = (id) => API.get(`/bundles/${id}`);
export const updateBundle = (id, data) => API.put(`/bundles/${id}`, data);

// Purchase
export const purchaseItems = (data) => API.post("/purchase", data);

export default API;