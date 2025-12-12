import { authService } from "../auth/authService.js";
import { gestorDeDatos } from "../data-loader/productService.js";
import { favoriteStore } from "./favoriteStore.js";

const pathname = window.location.pathname;
// Verifica si la página actual es la de favoritos en varios idiomas
const isWishlistPage = pathname.includes('favoritos.html') || 
                       pathname.includes('favorites.html') || 
                       pathname.includes('favoris.html') || 
                       pathname.includes('gogokoak.html');

const LANGUAGE = gestorDeDatos.language || 'ES';

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

const currentTexts = texts[LANGUAGE] || texts.ES;

// Function to redirect to login page with proper language and path
function redirectToLogin() {
    const userLanguage = authService.getLanguage() || 'ES';
    
    // Get texts in user's language
    const userTexts = texts[userLanguage] || texts.ES;
    
    // Show alert in user's language
    alert(userTexts.loginRequired);
    
    // Calculate base path based on current location
    const url = window.location.href;
    const urlCategoria = url.split('/');
    let basePath = '';
    
    if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
        basePath = '../../../';
    } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN' || urlCategoria[3] == 'FR' || urlCategoria[3] == 'EU') {
        basePath = '../';
    } else {
        basePath = './';
    }
    
    // Login page names by language
    const loginPages = {
        ES: 'sesion.html',
        EN: 'session.html',
        FR: 'connexion.html',
        EU: 'saioa.html'
    };
    
    // Favorites page names by language (for redirect)
    const favoritesPages = {
        ES: 'favoritos',
        EN: 'favorites',
        FR: 'favoris',
        EU: 'gogokoak'
    };
    
    const loginPage = loginPages[userLanguage] || 'sesion.html';
    const redirectPage = favoritesPages[userLanguage] || 'favoritos';
    window.location.href = `${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}`;
}

// Handle favorite button clicks with authentication check
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.container-products');
    
    if (productList) {
        productList.addEventListener('click', (event) => {
            // Handle remove from favorites button
            if (event.target.closest('.btn-remove-to-wishlist')) {
                if (!authService.isAuthenticated()) {
                    redirectToLogin();
                    return;
                }

                const card = event.target.closest('.search-product-card');
                if (card) {
                    const productId = card.getAttribute('data-product-id');
                    if (productId) {
                        favoriteStore.removeItem(productId);
                        // Reload the page to update the view
                        location.reload();
                    }
                }
                return;
            }

            // Handle add to favorites button
            if (event.target.closest('.btn-favorite') || event.target.classList.contains('btn-add-to-wishlist')) {
                if (!authService.isAuthenticated()) {
                    redirectToLogin();
                    return;
                }

                const wishlist = favoriteStore.addToWishlist(event);
                console.log('Productos en favoritos:', wishlist);
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
                ES: 'favoritos',
                EN: 'favorites',
                FR: 'favoris',
                EU: 'gogokoak'
            };
            
            const loginPage = loginPages[userLanguage] || 'sesion.html';
            const redirectPage = favoritesPages[userLanguage] || 'favoritos';
            
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
            // Don't navigate if clicking on buttons or links
            if (e.target.closest('.item_actions') || 
                e.target.closest('.btn-add-to-cart') || 
                e.target.closest('.btn-favorite') ||
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
            
            const currentLang = localStorage.getItem('userLanguage') || 'ES';
            window.location.href = `${basePath}${currentLang}/${redirectPage}`;
        } else {
            window.location.reload();
        }
    }

    if (!currentUser) {
        // Check if there's a redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        const needsLoginForCheckout = redirect === 'checkout' || redirect === 'finalizar-compra' || redirect === 'commande' || redirect === 'erosketa-bukatu';
        
        // Leer el idioma directamente de localStorage para asegurar que sea el más reciente
        const currentLang = localStorage.getItem('userLanguage') || 'ES';
        
        const loginTextsMaps = {
            ES: {
                title: 'Inicia sesión',
                subtitle: needsLoginForCheckout 
                    ? 'Necesitas iniciar sesión para completar tu compra. Por favor, accede con tu Usuario y Contraseña.'
                    : 'Accede con tu Usuario y Contraseña.',
                username: 'Usuario',
                password: 'Contraseña',
                enter: 'Entrar',
                cancel: 'Cancelar',
                loginMessage: 'Inicia Sesión',
                or: 'o',
                continueWith: 'Continuar con',
                googleDescription: 'Inicia sesión con Google'
            },
            EN: {
                title: 'Sign in',
                subtitle: needsLoginForCheckout 
                    ? 'You need to sign in to complete your purchase. Please sign in with your Username and Password.'
                    : 'Sign in with your Username and Password, Only administrators can sign in.',
                username: 'Username',
                password: 'Password',
                enter: 'Enter',
                cancel: 'Cancel',
                loginMessage: 'Sign in',
                or: 'or',
                continueWith: 'Continue with',
                googleDescription: 'Sign in with Google'
            },
            FR: {
                title: 'Se connecter',
                subtitle: needsLoginForCheckout 
                    ? 'Vous devez vous connecter pour finaliser votre achat. Veuillez vous connecter avec votre nom d\'utilisateur et votre mot de passe.'
                    : 'Connectez-vous avec votre nom d\'utilisateur et votre mot de passe.',
                username: 'Nom d\'utilisateur',
                password: 'Mot de passe',
                enter: 'Entrer',
                cancel: 'Annuler',
                loginMessage: 'Se connecter',
                or: 'ou',
                continueWith: 'Continuer avec',
                googleDescription: 'Se connecter avec Google'
            },
            EU: {
                title: 'Saioa hasi',
                subtitle: needsLoginForCheckout 
                    ? 'Erosketa bukatzeko saioa hasi behar duzu. Mesedez, sartu zure erabiltzaile izena eta pasahitza.'
                    : 'Sartu zure erabiltzaile izena eta pasahitza.',
                username: 'Erabiltzaile izena',
                password: 'Pasahitza',
                enter: 'Sartu',
                cancel: 'Utzi',
                loginMessage: 'Saioa hasi',
                or: 'edo',
                continueWith: 'Jarraitu',
                googleDescription: 'Google-rekin saioa hasi'
            }
        };
        const loginTexts = loginTextsMaps[currentLang] || loginTextsMaps.ES;

        showModal.innerHTML = `
            <div class="modal" id="loginModal" aria-hidden="true">
                <div class="modal__backdrop" data-modal-close></div>

                <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="login-title"
                    aria-describedby="login-desc">
                    <button class="modal__close" type="button" aria-label="Cerrar" data-modal-close>×</button>

                    <header class="modal__header">
                        <h2 id="login-title" class="modal__title">${loginTexts.title}</h2>
                        <p id="login-desc" class="modal__subtitle">${loginTexts.subtitle}</p>
                    </header>

                    <form class="modal__form" method="post" id="loginForm">
                        <label class="field">
                            <span class="field__label">${loginTexts.username}</span>
                            <input class="field__input" type="text" id="username" name="username" required />
                        </label>

                        <label class="field">
                            <span class="field__label">${loginTexts.password}</span>
                            <input class="field__input" type="password" id="password" name="password" autocomplete="current-password"
                                required />
                            <i class="fa-solid fa-eye" id="btn-show-password" role="button"></i>
                        </label>

                        <button class="btn btn--primary" type="submit" id="btn-enter">${loginTexts.enter}</button>
                        <button class="btn btn--ghost" type="button" data-modal-close>${loginTexts.cancel}</button>

                        <p class="loginMessage" id="loginMessageBox"><span id="loginMessage">${loginTexts.loginMessage} </span> <span id="spinner" class="oculto"></span></p>
                    </form>

                    <div class="login-divider">
                        <span>${loginTexts.or}</span>
                    </div>

                    <div class="google-signin-container">
                        <p class="google-signin-description">${loginTexts.googleDescription}</p>
                        <div id="google-signin-button"></div>
                    </div>
                </div>
            </div>    
        `;
        
        // Initialize Google Sign-In after modal is created
        let googleButtonInitialized = false;
        function initGoogleSignIn() {
            const buttonElement = document.getElementById('google-signin-button');
            if (!buttonElement) {
                console.log('Google sign-in button element not found');
                return;
            }
            
            // Check if button already has Google content
            if (buttonElement.querySelector('iframe') || buttonElement.querySelector('[data-google-button]')) {
                console.log('Google button already rendered');
                return;
            }
            
            if (window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    if (!googleButtonInitialized) {
                        googleAuth.init();
                        googleButtonInitialized = true;
                    }
                    googleAuth.renderButton('google-signin-button');
                    console.log('Google Sign-In initialized successfully');
                } catch (error) {
                    console.error('Error initializing Google Sign-In:', error);
                }
            } else {
                console.log('Google script not loaded yet, waiting...');
                // Wait for Google script to load (check every 200ms, max 10 seconds)
                let attempts = 0;
                const maxAttempts = 50;
                const checkGoogle = setInterval(() => {
                    attempts++;
                    if (window.google && window.google.accounts && window.google.accounts.id) {
                        try {
                            if (!googleButtonInitialized) {
                                googleAuth.init();
                                googleButtonInitialized = true;
                            }
                            googleAuth.renderButton('google-signin-button');
                            console.log('Google Sign-In initialized after wait');
                        } catch (error) {
                            console.error('Error initializing Google Sign-In:', error);
                        }
                        clearInterval(checkGoogle);
                    } else if (attempts >= maxAttempts) {
                        console.error('Google Sign-In script failed to load after 10 seconds');
                        clearInterval(checkGoogle);
                    }
                }, 200);
            }
        }
        
        // Try to initialize after modal is created
        setTimeout(initGoogleSignIn, 500);
        setTimeout(initGoogleSignIn, 1500);
        
        // Show message on page if there's a redirect and auto-open modal
        const loginMessageContainer = document.getElementById('login-message-container');
        if (loginMessageContainer && needsLoginForCheckout) {
            const pageMessages = {
                ES: {
                    title: 'Inicia sesión para continuar',
                    message: 'Necesitas iniciar sesión para completar tu compra. Por favor, inicia sesión a continuación.',
                    button: 'Abrir formulario de inicio de sesión'
                },
                EN: {
                    title: 'Sign in to Continue',
                    message: 'You need to sign in to complete your purchase. Please sign in below.',
                    button: 'Open Login Form'
                },
                FR: {
                    title: 'Connectez-vous pour continuer',
                    message: 'Vous devez vous connecter pour finaliser votre achat. Veuillez vous connecter ci-dessous.',
                    button: 'Ouvrir le formulaire de connexion'
                },
                EU: {
                    title: 'Saioa hasi jarraitzeko',
                    message: 'Erosketa bukatzeko saioa hasi behar duzu. Mesedez, saioa hasi behean.',
                    button: 'Saioa hasteko formularioa ireki'
                }
            };
            const currentLang = localStorage.getItem('userLanguage') || 'ES';
            const pageMessage = pageMessages[currentLang] || pageMessages.ES;
            
            loginMessageContainer.innerHTML = `
                <div class="login-prompt">
                    <div class="login-prompt-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <h1 class="login-prompt-title">${pageMessage.title}</h1>
                    <p class="login-prompt-message">${pageMessage.message}</p>
                    <button class="btn btn--primary" id="open-login-modal-btn">${pageMessage.button}</button>
                </div>
            `;
            
            // Add click handler to open modal
            document.getElementById('open-login-modal-btn').addEventListener('click', () => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('is-open');
                    loginModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    const usernameInput = document.getElementById('username');
                    if (usernameInput) {
                        setTimeout(() => usernameInput.focus(), 100);
                    }
                }
            });
        }
        
        // Auto-open modal if there's a redirect parameter
        if (redirect) {
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('is-open');
                    loginModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    
                    // Focus on username input
                    const usernameInput = document.getElementById('username');
                    if (usernameInput) {
                        setTimeout(() => usernameInput.focus(), 200);
                    }
                    
                    // Re-initialize Google Sign-In after modal opens
                    setTimeout(() => {
                        initGoogleSignIn();
                    }, 500);
                }
            }, 300);
        }
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            let finderUser;

            async function validateUser() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const loginMessage = document.getElementById('loginMessage');
                const loginMessageBox = document.getElementById('loginMessageBox');
                const btnEnter = document.getElementById('btn-enter');
                const spinner = document.getElementById('spinner');

                const currentLang = localStorage.getItem('userLanguage') || 'ES';
                const messagesMap = {
                    ES: {
                        signingIn: 'Iniciando sesión...',
                        incorrect: 'Usuario o contraseña incorrectos'
                    },
                    EN: {
                        signingIn: 'Signing in...',
                        incorrect: 'Incorrect username or password'
                    },
                    FR: {
                        signingIn: 'Connexion en cours...',
                        incorrect: 'Nom d\'utilisateur ou mot de passe incorrect'
                    },
                    EU: {
                        signingIn: 'Saioa hasten...',
                        incorrect: 'Erabiltzaile izena edo pasahitza okerra'
                    }
                };
                const messages = messagesMap[currentLang] || messagesMap.ES;

                finderUser = await authService.validateLogin(username, password);

                console.log("FinderUser: " + finderUser);

                if (finderUser) {
                    // mostrar es spinner
                    spinner.classList.remove('oculto'); // Aseguramos que se vea
                    spinner.classList.add('spinner-activo');    // Añadimos la clase de animación
                    btnEnter.disabled = true;
                    loginMessage.textContent = messages.signingIn;
                    loginMessageBox.style.color = 'green';
                    loginMessageBox.style.borderColor = 'green';
                    loginMessageBox.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';

                    setTimeout(() => {
                        document.getElementById('loginForm').reset();
                        redirectAfterLogin();
                    }, 1000);

                } else {

                    loginMessage.textContent = messages.incorrect;
                    loginMessageBox.style.color = 'red';
                    loginMessageBox.style.borderColor = 'red';
                    loginMessageBox.style.backgroundColor = 'rgba(231, 46, 0, 0.35)';
                    document.getElementById('loginForm').password.value = '';
                    document.getElementById('loginForm').password.focus();
                }
            }

            validateUser();

        });

        function showPassword() {
            const password = document.getElementById('password');
            const btnShowPassword = document.getElementById('btn-show-password');
            if (password.type === 'password') {
                password.type = 'text';
                btnShowPassword.classList.add('fa-eye-slash');
                btnShowPassword.classList.remove('fa-eye');
            } else {
                password.type = 'password';
                btnShowPassword.classList.add('fa-eye');
                btnShowPassword.classList.remove('fa-eye-slash');
            }
        }
        document.getElementById('btn-show-password').addEventListener('click', showPassword);


    } else {
        // Render account menu using the function
        renderAccountMenu();
    }
    
    // Listen for language changes to update account menu
    window.addEventListener('languageChanged', () => {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal && logoutModal.classList.contains('is-open')) {
            renderAccountMenu();
            // Re-open the modal after re-rendering
            setTimeout(() => {
                logoutModal.classList.add('is-open');
                logoutModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }, 100);
        }
    });





});



(function () {
    const body = document.body;
    let lastTrigger = null;

    function getFocusable(container) {
        return container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function openModal(selector, trigger) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        lastTrigger = trigger || document.activeElement;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';

        const focusables = getFocusable(modal);
        if (focusables.length) focusables[0].focus();

        function onKey(e) {
            if (e.key === 'Escape') closeModal(modal);
            if (e.key === 'Tab') {
                const list = Array.from(getFocusable(modal));
                if (!list.length) return;
                const first = list[0];
                const last = list[list.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        modal.__keyHandler = onKey;
        document.addEventListener('keydown', onKey);
    }

    function closeModal(modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        if (modal.__keyHandler) {
            document.removeEventListener('keydown', modal.__keyHandler);
        }
        if (lastTrigger && document.contains(lastTrigger)) {
            lastTrigger.focus();
        }
    }

    // Delegación para cualquier botón/elemento con data-modal-open
    document.addEventListener('click', (e) => {
        const opener = e.target.closest('[data-modal-open]');
        if (opener) {
            const sel = opener.getAttribute('data-modal-open');
            openModal(sel, opener);
            return;
        }

        const closer = e.target.closest('[data-modal-close]');
        if (closer) {
            const modal = closer.closest('.modal');
            if (modal) closeModal(modal);
        }
    });


})();


