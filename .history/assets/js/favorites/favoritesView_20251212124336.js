
let wishlist = [];


export const favoriteStore = {

    syncStorage() {
        const jsonWishlist = JSON.stringify(wishlist);
        localStorage.setItem('wishlist', jsonWishlist);
        // Dispatch event to update nav count
        window.dispatchEvent(new Event('favoritesUpdated'));
    },
    wishlistLoadFromStorage() {
        // obtengo el carrito del localStorage para operar.
        // Si no existe, lo inicializo como un array vacío.
        let wishlistStorage;
        const jsonWishlist = localStorage.getItem('wishlist');
        if (jsonWishlist) {
            wishlistStorage = JSON.parse(jsonWishlist);
        } else {
            wishlistStorage = [];
        }
        return wishlistStorage;
    },
    addToWishlist(param) {

        if (!param || !param.target) {
            return;
        }

        // Check for both button classes
        const isFavoriteButton = param.target.classList.contains('btn-add-to-wishlist') || 
                                  param.target.closest('.btn-favorite') ||
                                  param.target.closest('.btn-add-to-wishlist');

        if (isFavoriteButton) {
            wishlist = this.wishlistLoadFromStorage(); //obtengo el carrito del localStorage para operar

            // Find the product card element
            const element = param.target.closest('.cart-item') || 
                           param.target.closest('.search-product-card') ||
                           param.target.closest('[data-product-id]') ||
                           param.target.parentNode.parentNode;

            const productId = element.getAttribute('data-product-id');

            if (!productId) {
                console.warn('No product ID found');
                return wishlist;
            }

            // Check if product is already in wishlist
            if (!wishlist.some(product => product.id === productId)) {
                // Create product object
                const product = {
                    id: productId,
                    name: element.querySelector('.item_title')?.textContent?.trim() || '',
                    description: element.querySelector('.item_description')?.textContent?.trim() || '',
                    price: element.querySelector('.item_price')?.textContent?.trim() || '0€',
                    image: element.querySelector('img')?.src || ''
                };

                wishlist = [...wishlist, product];
                this.syncStorage(); // Save to localStorage
            } else {
                // If already in wishlist, remove it (toggle behavior)
                wishlist = wishlist.filter(product => product.id !== productId);
                this.syncStorage();
            }

            return wishlist;
        }

        return wishlist;
    },
    removeItem(idProducto) {
        wishlist = this.wishlistLoadFromStorage();
        if (Array.isArray(idProducto)) {
            wishlist = wishlist.filter(product => !idProducto.includes(product.id));
        } else {
            wishlist = wishlist.filter(product => product.id !== idProducto);
        }
        this.syncStorage();
        return wishlist;
    },
    countWishlist() {
        wishlist = this.wishlistLoadFromStorage();
        return wishlist.length;
    },
    totalWishlist() {
        wishlist = this.wishlistLoadFromStorage();
        let total = 0;
        wishlist.forEach(product => {
            total += parseFloat(product.price.replace('€', '')) * product.quantity;
        });
        return total.toFixed(2);
    }

}       FR: 'connexion.html',
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
    window.location.href = `${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}`;
}

// Handle favorite button clicks with authentication check
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.container-products');
    
    if (productList) {
        productList.addEventListener('click', (event) => {
            // Handle remove from favorites button (functionality will be added later)
            // if (event.target.closest('.btn-remove-to-wishlist')) {
            //     if (!authService.isAuthenticated()) {
            //         redirectToLogin();
            //         return;
            //     }

            //     const card = event.target.closest('.search-product-card');
            //     if (card) {
            //         const productId = card.getAttribute('data-product-id');
            //         if (productId) {
            //             favoriteStore.removeItem(productId);
            //             // Reload the page to update the view
            //             location.reload();
            //         }
            //     }
            //     return;
            // }

            // Handle add to favorites button
            if (event.target.closest('.btn-favorite') || event.target.classList.contains('btn-add-to-wishlist')) {
                if (!authService.isAuthenticated()) {
                    redirectToLogin();
                    return;
                }

                const wishlist = favoriteStore.addToWishlist(event);
                console.log('Productos en favoritos:', wishlist);
                // Dispatch event to update nav count
                window.dispatchEvent(new Event('favoritesUpdated'));
            }
        });
    }

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
            
            // Calculate base path
            const url = window.location.href;
            const urlCategoria = url.split('/');
            let basePath = '../';
            
            if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN' || urlCategoria[3] == 'FR' || urlCategoria[3] == 'EU') {
                basePath = '../';
            } else {
                basePath = './';
            }
            
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
            
            wishlistContainer.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-lock" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; color: #6b7280; margin-bottom: 1rem;">${userTexts.loginRequired}</p>
                    <a href="${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}" 
                       class="btn" 
                       style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: var(--radius-lg);">
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

    // Add click handler to entire product card (except buttons)
    wishlistContainer.querySelectorAll('.search-product-card').forEach(card => {
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
