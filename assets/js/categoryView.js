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

    // Add container-products class so cartView.js can find it
    if (!categoryContainer.classList.contains('container-products')) {
        categoryContainer.classList.add('container-products');
    }

    productos.forEach(producto => {
        console.log(producto);
        const article = document.createElement('article');
        // Use same classes as search-results for proper styling
        article.className = 'section-productos-destacados__item cart-item search-product-card';
        article.setAttribute('data-product-id', producto.id_producto);

        const productName = producto.nombre[LANGUAGE];
        const productDesc = producto.descripcion[LANGUAGE];

        // Determine product detail page based on language
        const detailPages = {
            ES: 'producto-detalle.html',
            EN: 'product-detail.html',
            FR: 'detail-produit.html',
            EU: 'produktu-xehetasuna.html'
        };
        const langPaths = {
            ES: 'ES',
            EN: 'EN',
            FR: 'FR',
            EU: 'EU'
        };
        const detailPage = detailPages[LANGUAGE] || 'producto-detalle.html';
        const langPath = langPaths[LANGUAGE] || 'ES';
        
        // Use proper structure with wrappers for styling
        article.innerHTML = `
            <div class="product-image-wrapper">
                <a href="${basePath}${langPath}/${detailPage}?pd=${producto.id_producto}">
                    <img src="${basePath}${producto.img_url}" alt="${productName}">
                </a>
                ${producto.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${texts[LANGUAGE].featured}</span>` : ''}
            </div>
            <h3 class="item_title">${productName}</h3>
            <p class="item_description">${productDesc}</p>
            <p class="item_price">${producto.precio}€</p>
            <div class="item_actions">
                <button class="btn-add-to-cart">${texts[LANGUAGE].addToCart}</button>
                <button class="btn-favorite btn-add-to-wishlist"><i class="fa-solid fa-heart"></i></button>
            </div>
        `;

        categoryContainer.appendChild(article);
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
}

document.addEventListener('DOMContentLoaded', initCategoryView);
