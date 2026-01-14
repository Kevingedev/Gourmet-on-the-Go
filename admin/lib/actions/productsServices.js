
import { config } from "../config/config.js";

const API_URL = config.API_URL;

export const productsService = {

    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        return data;
    },
    async getProductsPagination(page, limit = 5) {
        const response = await fetch(`${API_URL}/products?_page=${page}&_limit=${limit}`);
        const products = await response.json();
        const total = response.headers.get('X-Total-Count') || products.length;
        return { products, total: parseInt(total) };
    },

    async getProductById(id_producto) {
        const response = await fetch(`${API_URL}/products/${id_producto}`);
        const product = await response.json();
        return product;
    },

    getProductsLength() {
        return this.getProducts().then((products) => products.length);
    },

    async createProduct(product) {
        // console.log(product);
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data;
    },

    async updateProduct(id_producto, product) {
        // console.log(id_producto);
        const response = await fetch(`${API_URL}/products/${id_producto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data;
    },


}

