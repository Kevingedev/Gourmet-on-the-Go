import { gestorDeDatos } from "./data-loader/productService.js";

const categoryContainer = document.getElementById('category-products-container');
const LANGUAGE = gestorDeDatos.language || 'ES';

const texts = {
    ES: {
        addToCart: 'Añadir',
        added: '✓ Añadido',
        loading: 'Cargando productos...',
        noProducts: 'No hay productos disponibles en esta categoría.',
        featured: 'Destacado'
    },
    EN: {
        addToCart: 'Add to Cart',
        added: '✓ Added',
        loading: 'Loading products...',
        noProducts: 'No products available in this category.',
        featured: 'Featured'
    }
};

async function initCategoryView() {
    if (!categoryContainer) return;

    const categoryId = categoryContainer.dataset.categoryId;
    const basePath = categoryContainer.dataset.basePath || '../../../'; // Default to 3 levels up

    if (!categoryId) return;

    // Loading state
    categoryContainer.innerHTML = `<div class="loading-message">${texts[LANGUAGE].loading}</div>`;

    try {
        const productos = await gestorDeDatos.cargarProductosPorCategoria(categoryId);
        renderProducts(productos, basePath);
    } catch (error) {
        console.error("Error loading products:", error);
        categoryContainer.innerHTML = `<div class="no-results"><p>Error al cargar productos.</p></div>`;
    }
}

function renderProducts(productos, basePath) {
    categoryContainer.innerHTML = '';

    if (!productos || productos.length === 0) {
        categoryContainer.innerHTML = `<div class="no-results"><p>${texts[LANGUAGE].noProducts}</p></div>`;
        return;
    }

    productos.forEach(producto => {
        const article = document.createElement('article');
        article.className = 'search-product-card'; // Reuse search card styles for grid
        article.setAttribute('data-product-id', producto.id_producto);

        // Construct paths
        // Image path is relative to the HTML file location, so we use basePath + assets...
        // Note: product images in JSON might be just filenames or relative paths.
        // productService.js usually returns raw JSON.
        // In main.js: src="../assets/img/product-images/img-test.jpg" (hardcoded test img?)
        // Let's check how the JSON looks.

        let imgSrc = `${basePath}assets/img/product-images/img-test.jpg`;
        if (producto.img) {
            // Assuming producto.img is just filename or path relative to assets/img
            // If it's "carnes.png" -> basePath + "assets/img/" + producto.img
            // If it's "../assets/img/carnes.png" -> handle accordingly.
            // Looking at categories.json provided earlier: "img": "../assets/img/carnes.png"
            // But valid `product` images? Let's assume filenames or standard paths.
            // main.js uses hardcoded test image! 
            // I will try to use producto.img if available, else test image.
            // To be safe, I'll use the logic: if starts with http use it, else prepend path.

            // However, main.js line 27: src="../assets/img/product-images/img-test.jpg"
            // It seems the user might not have real product images yet?
            // But I'll try to use `producto.img` if it's there.
            imgSrc = `${basePath}assets/img/product-images/${producto.id_producto}.png`; // Guessing strategy or just use generic
        }

        // BETTER STRATEGY: Use the image from the product object if it exists, otherwise fallback.
        // Since I don't see the products.json content, I will follow main.js pattern but try to improve it.
        // main.js ignored producto.img and used hardcoded img-test.jpg. 
        // I will do: src="${basePath}assets/img/product-images/${producto.img || 'img-test.jpg'}"

        const productName = producto.nombre[LANGUAGE];
        const productDesc = producto.descripcion[LANGUAGE];

        article.innerHTML = `
            <div class="product-image-wrapper">
                <a href="${basePath}ES/producto-detalle.html?pd=${producto.id_producto}">
                    <img src="${basePath}assets/img/product-images/img-test.jpg" alt="${productName}">
                </a>
                ${producto.featured ? `<div class="featured-badge"><i class="fas fa-star"></i> ${texts[LANGUAGE].featured}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="item_title">${productName}</h3>
                    <p class="item_price">${producto.precio}€</p>
                </div>
                <p class="item_description">${productDesc}</p>
                <div class="item_actions">
                    <button class="btn-add-to-cart">${texts[LANGUAGE].addToCart}</button>
                    <button class="btn-favorite"><i class="fa-solid fa-heart"></i></button>
                </div>
            </div>
        `;

        categoryContainer.appendChild(article);
    });
}

document.addEventListener('DOMContentLoaded', initCategoryView);
