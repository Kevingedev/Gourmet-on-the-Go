//categoriesLoader.innerHTML pintar las categorias en el index
//gestorDeDatos.cargarProductosDestacados() pintar los productos destacados en el index.

import { gestorDeDatos } from "./data-loader/productService.js";


// Función para cargar productos destacados cargarProductosDestacados()

const featuredProductsLoader = document.getElementById('featured-products-loader');
const categoriesLoader = document.getElementById('categorias-loader');

// Function to detect language from URL path
function detectLanguageFromUrl() {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    
    // Check if we're in a language folder (ES, EN, FR, EU)
    for (const part of pathParts) {
        if (part === 'ES' || part === 'EN' || part === 'FR' || part === 'EU') {
            // Update localStorage if different
            if (part !== localStorage.getItem("userLanguage")) {
                localStorage.setItem("userLanguage", part);
            }
            return part;
        }
    }
    
    // Fallback to localStorage or default
    return localStorage.getItem("userLanguage") || 'ES';
}

// Get current language dynamically
function getCurrentLanguage() {
    return detectLanguageFromUrl();
}

// Textos según idioma
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
    },
    FR: {
        addToCart: 'Ajouter',
        added: '✓ Ajouté',
        loading: 'Chargement des produits...',
        noProducts: 'Aucun produit disponible dans cette catégorie.',
        featured: 'En vedette'
    },
    EU: {
        addToCart: 'Gehitu',
        added: '✓ Gehituta',
        loading: 'Produktuak kargatzen...',
        noProducts: 'Ez dago produkturik kategoria honetan.',
        featured: 'Nabarmendua'
    }
};

// Only load featured products if container exists
if (featuredProductsLoader) {
    gestorDeDatos.cargarProductosDestacados().then(productos => {
        // Get current language dynamically
        const LANGUAGE = getCurrentLanguage();
        
        // Determine product detail page name based on language
        const detailPages = {
            ES: 'producto-detalle.html',
            EN: 'product-detail.html',
            FR: 'detail-produit.html',
            EU: 'produktu-xehetasuna.html'
        };
        const detailPage = detailPages[LANGUAGE] || 'producto-detalle.html';

        productos.forEach(producto => {
            featuredProductsLoader.innerHTML += `
            <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id_producto}">
            <div class="product-image-wrapper">
                <a href="${detailPage}?pd=${producto.id_producto}">
                    <img src="../${producto.img_url}" alt="${producto.nombre[LANGUAGE]}">
                </a>
                ${producto.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${texts[LANGUAGE].featured}</span>` : ''}
            </div>
            <h3 class="item_title">${producto.nombre[LANGUAGE]}</h3>
            <p class="item_description">${producto.descripcion[LANGUAGE]}</p>
            <p class="item_price">${producto.precio}€</p>
            <div class="item_actions">
                <button class="btn-add-to-cart">${texts[LANGUAGE].addToCart}</button>
                <button class="btn-favorite btn-add-to-wishlist" title= "Agregar a tu lista de favoritos"><i class="fa-solid fa-heart"></i></button>
            </div>
            </article>

            
            `;
        });
        
        // Update favorite buttons state after products are loaded
        if (typeof updateAllFavoriteButtons === 'function') {
            updateAllFavoriteButtons();
        } else {
            // Fallback: dispatch event to update buttons
            setTimeout(() => {
                window.dispatchEvent(new Event('favoritesUpdated'));
            }, 100);
        }

    });
}

// Only load categories if container exists
if (categoriesLoader) {
    gestorDeDatos.cargarCategorias().then(categorias => {
        // Get current language dynamically
        const LANGUAGE = getCurrentLanguage();

        categorias.forEach(categoria => {

            categoriesLoader.innerHTML += `
                <a href="../${LANGUAGE}${categoria.url_slug[LANGUAGE]}" class="category-card">
                    <img src="${categoria.img}" alt="${categoria.nombre[LANGUAGE]}">
                    <div class="category-overlay">
                        <h3>${categoria.nombre[LANGUAGE]}</h3>
                    </div>
                </a>
            `;
        });

    });
}