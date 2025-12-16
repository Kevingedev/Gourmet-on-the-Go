import { authService } from "../auth/authService.js";
import { gestorDeDatos } from "../data-loader/productService.js";
import { favoriteStore } from "./favoriteStore.js";

const pathname = window.location.pathname;
// Verifica si la página actual es la de favoritos en varios idiomas
const isWishlistPage = pathname.includes('favoritos.html') || 
                       pathname.includes('favorites.html') || 
                       pathname.includes('favoris.html') || 
                       pathname.includes('gogokoak.html');

// Function to detect language from URL path
function detectLanguageFromUrl() {
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

// Get language dynamically - detect from URL first, then fallback to localStorage
let LANGUAGE = detectLanguageFromUrl();

// Function to get current language (re-detect if needed)
function getCurrentLanguage() {
    LANGUAGE = detectLanguageFromUrl();
    return LANGUAGE;
}

// Textos según idioma
const texts = {
    ES: {
        addToCart: 'Añadir',
        added: '✓ Añadido',
        loading: 'Cargando productos...',
        noProducts: 'No hay productos en favoritos.',
        emptyMessage: 'Tu lista de favoritos está vacía.',
        exploreProducts: '¡Explora nuestros productos!',
        featured: 'Destacado',
        category: 'Categoría',
        removeFromFavorites: 'Quitar de favoritos',
        loginRequired: 'Debes iniciar sesión para agregar productos a favoritos.',
        pleaseLogin: 'Por favor, inicia sesión'
    },
    EN: {
        addToCart: 'Add to Cart',
        added: '✓ Added',
        loading: 'Loading products...',
        noProducts: 'No products in favorites.',
        emptyMessage: 'Your favorites list is empty.',
        exploreProducts: 'Explore our products!',
        featured: 'Featured',
        category: 'Category',
        removeFromFavorites: 'Remove from favorites',
        loginRequired: 'You must be logged in to add products to favorites.',
        pleaseLogin: 'Please sign in'
    },
    FR: {
        addToCart: 'Ajouter',
        added: '✓ Ajouté',
        loading: 'Chargement des produits...',
        noProducts: 'Aucun produit dans les favoris.',
        emptyMessage: 'Votre liste de favoris est vide.',
        exploreProducts: 'Explorez nos produits!',
        featured: 'En vedette',
        category: 'Catégorie',
        removeFromFavorites: 'Retirer des favoris',
        loginRequired: 'Vous devez être connecté pour ajouter des produits aux favoris.',
        pleaseLogin: 'Veuillez vous connecter'
    },
    EU: {
        addToCart: 'Gehitu',
        added: '✓ Gehituta',
        loading: 'Produktuak kargatzen...',
        noProducts: 'Ez dago produkturik gogokoetan.',
        emptyMessage: 'Zure gogoko zerrenda hutsik dago.',
        exploreProducts: 'Arakatu gure produktuak!',
        featured: 'Nabarmendua',
        category: 'Kategoria',
        removeFromFavorites: 'Gogokoetatik kendu',
        loginRequired: 'Gogokoetara produktuak gehitzeko saioa hasi behar duzu.',
        pleaseLogin: 'Mesedez, saioa hasi'
    }
};

// Function to get current texts based on current language
function getCurrentTexts() {
    const currentLang = getCurrentLanguage();
    return texts[currentLang] || texts.ES;
}

let currentTexts = getCurrentTexts();

// Function to redirect to login page with proper language and path
function redirectToLogin() {
    const userLanguage = authService.getLanguage() || 'ES';
    
    // Get texts in user's language
    const userTexts = texts[userLanguage] || texts.ES;
    
    // Show alert in user's language
    alert(userTexts.loginRequired);
    
    // Calculate base path using pathname (more reliable)
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    
    // Check if we're in a catalog subfolder
    const isInCatalog = pathParts.includes('catalogo') || pathParts.includes('catalog') || 
                        pathParts.includes('catalogue') || pathParts.includes('katalogoa');
    
    // Check if we're already in the language folder
    const isInLanguageFolder = pathParts.length > 0 && 
                               (pathParts[0] === 'ES' || pathParts[0] === 'EN' || 
                                pathParts[0] === 'FR' || pathParts[0] === 'EU');
    
    // Login page names by language
    const loginPages = {
        ES: 'sesion.html',
        EN: 'session.html',
        FR: 'connexion.html',
        EU: 'saioa.html'
    };
    
    // Favorites page names by language (for redirect)
    const favoritesPages = {
        ES: 'favoritos.html',
        EN: 'favorites.html',
        FR: 'favoris.html',
        EU: 'gogokoak.html'
    };
    
    const loginPage = loginPages[userLanguage] || 'sesion.html';
    const redirectPage = favoritesPages[userLanguage] || 'favoritos.html';
    
    // Build the correct URL based on current location
    let loginUrl;
    if (isInCatalog) {
        // We're in a catalog subfolder, need to go up to language folder
        loginUrl = `../../../${userLanguage}/${loginPage}?redirect=${redirectPage}`;
    } else if (isInLanguageFolder) {
        // We're already in the language folder, use same folder
        loginUrl = `${loginPage}?redirect=${redirectPage}`;
    } else {
        // We're at root, need to go to language folder
        loginUrl = `${userLanguage}/${loginPage}?redirect=${redirectPage}`;
    }
    
    window.location.href = loginUrl;
}

// Handle favorite button clicks with authentication check (using event delegation)
document.addEventListener('click', (event) => {
    // Handle remove from favorites button
    if (event.target.closest('.btn-remove-favorite-icon') || event.target.closest('.btn-remove-to-wishlist')) {
        if (!authService.isAuthenticated()) {
            redirectToLogin();
            return;
        }

        const card = event.target.closest('.search-product-card');
        if (card) {
            const productId = card.getAttribute('data-product-id');
            if (productId) {
                favoriteStore.removeItem(productId);
                // Update the view without reload
                if (isWishlistPage) {
                    loadWishlist();
                }
                // Dispatch event to update nav count
                window.dispatchEvent(new Event('favoritesUpdated'));
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    // Handle add to favorites button
    const favoriteButton = event.target.closest('.btn-favorite') || 
                          (event.target.classList.contains('btn-add-to-wishlist') ? event.target : null) ||
                          (event.target.closest('.btn-add-to-wishlist'));
    
    if (favoriteButton) {
        // Don't handle if it's a remove button
        if (favoriteButton.classList.contains('btn-remove-to-wishlist')) {
            return;
        }
        
        if (!authService.isAuthenticated()) {
            redirectToLogin();
            return;
        }

        // Create a synthetic event object for favoriteStore
        const syntheticEvent = {
            target: favoriteButton,
            currentTarget: favoriteButton
        };
        
        const wishlist = favoriteStore.addToWishlist(syntheticEvent);
        console.log('Productos en favoritos:', wishlist);
        
        // Update button visual state (toggle heart color)
        updateFavoriteButtonState(favoriteButton, wishlist);
        
        // Dispatch event to update nav count
        window.dispatchEvent(new Event('favoritesUpdated'));
    }
});

// Function to update favorite button visual state
function updateFavoriteButtonState(button, wishlist) {
    const heartIcon = button.querySelector('i');
    if (!heartIcon) return;
    
    const productCard = button.closest('.cart-item') || 
                       button.closest('.search-product-card') ||
                       button.closest('[data-product-id]');
    if (!productCard) return;
    
    const productId = productCard.getAttribute('data-product-id');
    if (!productId) return;
    
    const isInWishlist = wishlist && wishlist.some(p => p.id === productId);
    if (isInWishlist) {
        heartIcon.style.color = '#ef4444';
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
    } else {
        heartIcon.style.color = '';
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');
    }
}

// Update all favorite buttons on page load
function updateAllFavoriteButtons() {
    const wishlist = favoriteStore.wishlistLoadFromStorage();
    document.querySelectorAll('.btn-favorite:not(.btn-remove-to-wishlist)').forEach(button => {
        updateFavoriteButtonState(button, wishlist);
    });
}

// Make function globally accessible
window.updateAllFavoriteButtons = updateAllFavoriteButtons;

// Listen for favorites updates to refresh button states
window.addEventListener('favoritesUpdated', () => {
    updateAllFavoriteButtons();
});

// Initialize favorites page
document.addEventListener('DOMContentLoaded', () => {
    // Update favorite buttons state on page load
    updateAllFavoriteButtons();

    // Render wishlist page
    if (!isWishlistPage) {
        return;
    }

    // Check authentication for wishlist page
    if (!authService.isAuthenticated()) {
        const wishlistContainer = document.getElementById('wishlist-container');
        if (wishlistContainer) {
            const userLanguage = authService.getLanguage() || LANGUAGE;
            const userTexts = texts[userLanguage] || texts.ES;
            
            // Calculate base path using pathname (more reliable)
            const pathname = window.location.pathname;
            const pathParts = pathname.split('/').filter(p => p.length > 0);
            
            // Check if we're already in the language folder
            const isInLanguageFolder = pathParts.length > 0 && 
                                      (pathParts[0] === 'ES' || pathParts[0] === 'EN' || 
                                       pathParts[0] === 'FR' || pathParts[0] === 'EU');
            
            const loginPages = {
                ES: 'sesion.html',
                EN: 'session.html',
                FR: 'connexion.html',
                EU: 'saioa.html'
            };
            
            // Favorites page names by language (for redirect)
            const favoritesPages = {
                ES: 'favoritos.html',
                EN: 'favorites.html',
                FR: 'favoris.html',
                EU: 'gogokoak.html'
            };
            
            const loginPage = loginPages[userLanguage] || 'sesion.html';
            const redirectPage = favoritesPages[userLanguage] || 'favoritos.html';
            
            // If we're already in the language folder, use same folder (no basePath needed)
            // Otherwise, we need to navigate to the language folder
            let loginUrl;
            if (isInLanguageFolder) {
                // We're in ES/favoritos.html, so sesion.html is in the same folder
                loginUrl = `${loginPage}?redirect=${redirectPage}`;
            } else {
                // We're at root, need to go to language folder
                loginUrl = `${userLanguage}/${loginPage}?redirect=${redirectPage}`;
            }
            
            wishlistContainer.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 3rem 2rem;">
                    <i class="fa-solid fa-lock" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem; display: block;"></i>
                    <p style="font-size: 1.1rem; color: #6b7280; margin-bottom: 1.5rem;">${userTexts.loginRequired}</p>
                    <a href="${loginUrl}" 
                       class="btn" 
                       style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: var(--radius-lg); font-weight: 600; transition: all 0.3s ease;">
                        ${userTexts.pleaseLogin}
                    </a>
                </div>
            `;
        }
        return;
    }

    loadWishlist();
});

async function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;

    // Update language and texts to ensure they're current
    LANGUAGE = getCurrentLanguage();
    currentTexts = getCurrentTexts();

    const WISHLIST = favoriteStore.wishlistLoadFromStorage();

    if (WISHLIST.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-heart" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; color: #6b7280; margin-bottom: 1rem;">${currentTexts.emptyMessage}</p>
                <a href="../${LANGUAGE}/" class="btn" style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: var(--radius-lg);">
                    ${currentTexts.exploreProducts}
                </a>
            </div>
        `;
        return;
    }

    // Load full product data for each favorite
    const productos = [];
    for (const favorite of WISHLIST) {
        try {
            const producto = await gestorDeDatos.cargarProductoPorId(favorite.id);
            if (producto) {
                productos.push(producto);
            }
        } catch (error) {
            console.error(`Error loading product ${favorite.id}:`, error);
        }
    }

    mostrarProductos(productos);
    // Update nav count after loading
    if (typeof updateFavoritesCount === 'function') {
        updateFavoritesCount();
    } else {
        window.dispatchEvent(new Event('favoritesUpdated'));
    }
}

function mostrarProductos(productos) {
    // Ensure language and texts are current
    LANGUAGE = getCurrentLanguage();
    currentTexts = getCurrentTexts();
    
    const rutaBase = '../';
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;

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

    // Match search-results structure exactly
    wishlistContainer.innerHTML = `
        <div class="products-grid container-products">
            ${productos.map(producto => `
                <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id_producto}">
                    <div class="product-image-wrapper">
                        <a href="${rutaBase}${langPath}/${detailPage}?pd=${producto.id_producto}" class="product-link">
                            <img src="${rutaBase}${producto.img_url}" alt="${producto.nombre[LANGUAGE]}">
                        </a>
                        <button class="btn-remove-favorite-icon" title="${currentTexts.removeFromFavorites}">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        ${producto.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${currentTexts.featured}</span>` : ''}
                    </div>
                    <h3 class="item_title">
                        <a href="${rutaBase}${langPath}/${detailPage}?pd=${producto.id_producto}" class="product-link">${producto.nombre[LANGUAGE]}</a>
                    </h3>
                    <p class="item_description">${producto.descripcion[LANGUAGE]}</p>
                    <div class="product-info">
                        <div class="product-header">
                            <span class="product-id">ID: ${producto.id_producto}</span>
                        </div>
                        <div class="product-details">
                            <div class="product-category">
                                <i class="fa-solid fa-tag"></i>
                                <span>${currentTexts.category}: ${obtenerNombreCategoria(producto.id_categoria)}</span>
                            </div>
                            <div class="product-unit">
                                <i class="fa-solid fa-weight"></i>
                                <span>${producto.unidad_medida[LANGUAGE]}</span>
                            </div>
                        </div>
                        <p class="item_price">${producto.precio}€</p>
                    </div>
                    <div class="item_actions">
                        <button class="btn-add-to-cart">${currentTexts.addToCart}</button>
                        <button class="btn-favorite btn-remove-to-wishlist" title="${currentTexts.removeFromFavorites}">
                            <i class="fa-solid fa-heart" style="color: #ef4444;"></i>
                        </button>
                    </div>
                </article>
            `).join('')} 
        </div>
    `;
            //Join para unir todos los productos en una sola cadena de texto y no imprima las comas por cada producto (pasa por ser un array)

    // Add click handler to entire product card (except buttons)
    const productCards = wishlistContainer.querySelectorAll('.search-product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on buttons, links, or remove icon
            if (e.target.closest('.item_actions') || 
                e.target.closest('.btn-add-to-cart') || 
                e.target.closest('.btn-favorite') ||
                e.target.closest('.btn-remove-favorite-icon') ||
                e.target.closest('.product-link')) {
                return;
            }
            
            // Navigate to product detail
            const productId = card.getAttribute('data-product-id');
            if (productId) {
                const productLink = card.querySelector('.product-link');
                if (productLink) {
                    window.location.href = productLink.href;
                }
            }
        });
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
    });
}

function obtenerNombreCategoria(idCategoria) {
    const categorias = {
        ES: {
            'protein_meat': 'Carnes y Aves',
            'fish_seafood': 'Pescados y Mariscos',
            'sides_comp': 'Complementos',
            'breakfast_brunch': 'Desayunos'
        },
        EN: {
            'protein_meat': 'Meat and Poultry',
            'fish_seafood': 'Fish and Seafood',
            'sides_comp': 'Sides',
            'breakfast_brunch': 'Breakfast'
        },
        FR: {
            'protein_meat': 'Viandes et Volaille',
            'fish_seafood': 'Poissons et Fruits de mer',
            'sides_comp': 'Accompagnements',
            'breakfast_brunch': 'Petit-déjeuner'
        },
        EU: {
            'protein_meat': 'Haragiak eta Hegaztiak',
            'fish_seafood': 'Arrainak eta Itsaskiak',
            'sides_comp': 'Osagarriak',
            'breakfast_brunch': 'Gosariak'
        }
    };
    const catMap = categorias[LANGUAGE] || categorias.ES;
    return catMap[idCategoria] || idCategoria;
}