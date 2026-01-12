
import { gestorDeDatos } from "../data-loader/productService.js";
import { cartStore } from "./cartStore.js";

// Textos según idioma
const cartTexts = {
    ES: {
        cart: 'Carrito',
        empty: 'Tu carrito está vacío.',
        total: 'Total',
        checkout: 'Finalizar compra',
        close: 'Cerrar carrito',
        added: '✓ Añadido'
    },
    EN: {
        cart: 'Cart',
        empty: 'Your cart is empty.',
        total: 'Total',
        checkout: 'Checkout',
        close: 'Close cart',
        added: '✓ Added'
    },
    FR: {
        cart: 'Panier',
        empty: 'Votre panier est vide.',
        total: 'Total',
        checkout: 'Commander',
        close: 'Fermer le panier',
        added: '✓ Ajouté'
    },
    EU: {
        cart: 'Saskia',
        empty: 'Zure saskia hutsik dago.',
        total: 'Guztira',
        checkout: 'Erosketa bukatu',
        close: 'Saskia itxi',
        added: '✓ Gehituta'
    }
};

// Function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('userLanguage') || 'ES';
}

// Function to get texts for current language
function getCartTexts() {
    const language = getCurrentLanguage();
    return cartTexts[language] || cartTexts.ES;
}

// Function to render cart drawer HTML
function renderCartDrawer() {
    const texts = getCartTexts();
    const cartDrawer = document.getElementById('cart-drawer');
    if (!cartDrawer) return;

    // Check if cart has products
    const cart = cartStore.cartLoadFromStorage();
    const hasProducts = cart && cart.length > 0;

    const cartDrawerHTML = `
    <div class="cart-drawer-overlay" data-cart-overlay></div>

        <aside class="cart-drawer" aria-label="${texts.cart}" data-cart-drawer>
            <header class="cart-drawer__header">
                <h2>${texts.cart}</h2>
                <button class="cart-drawer__close js-cart-toggle" aria-label="${texts.close}">
                    &times;
                </button>
            </header>

            <div class="cart-drawer__body">
                <!-- Ejemplo de contenido minimal -->
                <p class="cart-drawer__empty">${texts.empty}</p>
                <!-- Aquí irían los productos del carrito -->
                <div class="cart-drawer__products">
                    
                </div>
            </div>

            <footer class="cart-drawer__footer">
                <div class="cart-drawer__total">
                    <span>${texts.total}</span>
                    <strong>0.00€</strong>
                </div>
                ${hasProducts ? `<button class="cart-drawer__checkout">${texts.checkout}</button>` : ''}
            </footer>
        </aside>
    `;
    cartDrawer.innerHTML = cartDrawerHTML;
}

// Initial render
renderCartDrawer();

document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidad del carrito en el DOM Loaded porque si se hace fuera o sin el DOMContentLoaded no funciona
    // Necesito cargar los elementos del carrito al cargar el DOM
    const cartToggles = document.querySelectorAll('.js-cart-toggle');
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const cartOverlay = document.querySelector('[data-cart-overlay]');

    function toggleCart(open) {
        const willOpen = typeof open === 'boolean'
            ? open
            : !cartDrawer.classList.contains('is-open');

        cartDrawer.classList.toggle('is-open', willOpen);
        cartOverlay.classList.toggle('is-open', willOpen);

        cartToggles.forEach(btn => {
            btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        if (willOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    cartToggles.forEach(btn => {
        btn.addEventListener('click', () => toggleCart());
    });

    cartOverlay.addEventListener('click', () => toggleCart(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleCart(false);
        }
    });



    // Variables importantes.
    const cartDrawerContainer = document.querySelector('.cart-drawer__products');
    const drawerEmpty = document.querySelector('.cart-drawer__empty'); //Elemento que se muestra cuando el carrito esta vacio
    const productInCart = cartStore.cartLoadFromStorage();
    // console.log(productInCart);

    // AQUI VAN TODAS LAS ACCIONES DEL CARRITO PARA MOSTRAR LA DATA EN EL HTML
    if (productInCart.length > 0) {
        uploadItems(productInCart, cartDrawerContainer); // Cargando los items al carrito si ya existen en el localStorage
        drawerEmpty.style.display = 'none';
        // Show checkout button when cart has products
        const checkoutButton = document.querySelector('.cart-drawer__checkout');
        if (checkoutButton) {
            checkoutButton.style.display = 'block';
        }
    } else {
        // Hide checkout button if cart is empty
        const checkoutButton = document.querySelector('.cart-drawer__checkout');
        if (checkoutButton) {
            checkoutButton.style.display = 'none';
        }
    }

    const productList = document.querySelector('.container-products'); // Aqui siempre se van a encontrar los productos que se agregaran al carrito
    let slideCart = 0;
    // Evento para agregar productos al carrito (only if productList exists)
    if (productList) {
        productList.addEventListener('click', (event) => {

            if (event.target.classList.contains('btn-add-to-cart')) {
                const button = event.target;
                const originalText = button.textContent;
                const id = undefined;
                const products = cartStore.addToCart(event, id);
                drawerEmpty.style.display = 'none';

                uploadItems(products, cartDrawerContainer); // Cargando los items al carrito si hace click en el boton de agregar al carrito

                // Show checkout button when product is added
                const checkoutButton = document.querySelector('.cart-drawer__checkout');
                if (checkoutButton) {
                    checkoutButton.style.display = 'block';
                } else {
                    // Create checkout button if it doesn't exist
                    const cartFooter = document.querySelector('.cart-drawer__footer');
                    if (cartFooter) {
                        const button = document.createElement('button');
                        button.className = 'cart-drawer__checkout';
                        button.textContent = texts.checkout;
                        cartFooter.appendChild(button);
                        setupCheckoutButton(button);
                    }
                }

                // Feedback visual en el botón
                const texts = getCartTexts();
                button.textContent = texts.added;
                button.style.background = '#22c55e';
                button.style.color = 'white';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    button.style.color = '';
                }, 2000);

                // console.log(product);
                if (slideCart <= 0) {
                    toggleCart(true);
                    slideCart++;
                }

            }

        });

    }

    // Event delegation for cart actions (remove, increase, decrease)
    cartDrawerContainer.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const id = target.getAttribute('data-id');

        if (action === 'remove') {
            const updatedCart = cartStore.removeItem(id);
            uploadItems(updatedCart, cartDrawerContainer);
            if (updatedCart.length === 0) {
                drawerEmpty.style.display = 'block';
                // Hide checkout button when cart becomes empty
                const checkoutButton = document.querySelector('.cart-drawer__checkout');
                if (checkoutButton) {
                    checkoutButton.style.display = 'none';
                }
            }
        }

        if (action === 'increase') {
            const updatedCart = cartStore.increaseItem(id);
            uploadItems(updatedCart, cartDrawerContainer);
        }

        if (action === 'decrease') {
            const updatedCart = cartStore.decreaseItem(id);
            uploadItems(updatedCart, cartDrawerContainer);
        }
    });

    // Function to update cart texts when language changes
    function updateCartTexts() {
        const texts = getCartTexts();
        const cartDrawer = document.querySelector('[data-cart-drawer]');
        const cartHeader = cartDrawer?.querySelector('.cart-drawer__header h2');
        const cartClose = cartDrawer?.querySelector('.cart-drawer__close');
        const cartEmpty = document.querySelector('.cart-drawer__empty');
        const cartTotal = document.querySelector('.cart-drawer__total span');
        const cartCheckout = document.querySelector('.cart-drawer__checkout');

        if (cartHeader) cartHeader.textContent = texts.cart;
        if (cartClose) cartClose.setAttribute('aria-label', texts.close);
        if (cartEmpty) cartEmpty.textContent = texts.empty;
        if (cartTotal) cartTotal.textContent = texts.total;
        if (cartCheckout) cartCheckout.textContent = texts.checkout;
    }

    // FUNCION PARA ACTUALIZAR EL NOMBRE DE LOS PRODUCTOS EN EL CARRITO CUANDO CAMBIA EL Idioma
    async function updateCartProductNames() {
        const currentLanguage = getCurrentLanguage();
        const cart = cartStore.cartLoadFromStorage();
        if (cart.length === 0) return;

        try {
            const allProducts = await gestorDeDatos.cargarProductos();
            const updatedCart = cart.map(cartItem => {
                const product = allProducts.find(p => p.id_producto === cartItem.id);
                if (product && product.nombre && product.nombre[currentLanguage]) {
                    return {
                        ...cartItem,
                        name: product.nombre[currentLanguage]
                    };
                }
                return cartItem;
            });

            // Save updated cart to localStorage directly
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Re-render cart items
            const cartDrawerContainer = document.querySelector('.cart-drawer__products');
            if (cartDrawerContainer) {
                uploadItems(updatedCart, cartDrawerContainer);
            }
        } catch (error) {
            console.error('Error updating cart product names:', error);
        }
    }

    // Listen for language changes (set up after DOM is ready)
    window.addEventListener('languageChanged', async () => {
        updateCartTexts();
        await updateCartProductNames();
    });

    // Setup checkout button handler
    setupCheckoutButton();

    // Initial check: hide checkout button if cart is empty
    const initialCart = cartStore.cartLoadFromStorage();
    if (!initialCart || initialCart.length === 0) {
        const checkoutButton = document.querySelector('.cart-drawer__checkout');
        if (checkoutButton) {
            checkoutButton.style.display = 'none';
        }
    }

});






const amountCart = document.querySelector('.cart-drawer__total strong');

function uploadItems(products, cartDrawerContainer) {
    //Tendrá el contenedor de items.
    cartDrawerContainer.innerHTML = '';
    const hasProducts = products && products.length > 0;
    const texts = getCartTexts();

    products.forEach(product => {
        // console.log(product);
        const cardItem = `
        <div class="cart-item__image">
            <img src="${product.image}" alt="Producto">
        </div>
            
        <div class="cart-item__content">
            <h3 class="cart-item__name">${product.name}</h3>
            <span class="cart-item__price">${product.price}</span>
                
                <div class="cart-item__controls">
                    <button class="btn-quantity" data-action="decrease" data-id="${product.id}"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" class="quantity-input" value="${product.quantity}" min="1">
                    <button class="btn-quantity" data-action="increase" data-id="${product.id}"><i class="fa-solid fa-plus"></i></button>
                    <button class="btn-remove" data-action="remove" data-id="${product.id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `;
        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.setAttribute('data-product-id', product.id);
        card.innerHTML = cardItem;
        cartDrawerContainer.appendChild(card); // Agrega cada producto al carrito.

    })

    // Update cart count and total
    let totalItems = cartStore.countCart();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }

    if (amountCart) {
        amountCart.textContent = cartStore.totalCart() + '€';
    }

    // Show/hide checkout button based on whether there are products
    const checkoutButton = document.querySelector('.cart-drawer__checkout');
    const cartFooter = document.querySelector('.cart-drawer__footer');

    if (hasProducts) {
        // Show checkout button if it doesn't exist
        if (!checkoutButton && cartFooter) {
            const button = document.createElement('button');
            button.className = 'cart-drawer__checkout';
            button.textContent = texts.checkout;
            cartFooter.appendChild(button);

            // Re-attach event listener
            setupCheckoutButton(button);
        } else if (checkoutButton) {
            // Button exists, just make sure it's visible
            checkoutButton.style.display = 'block';
        }
    } else {
        // Hide checkout button if cart is empty
        if (checkoutButton) {
            checkoutButton.style.display = 'none';
        }
    }
}

// Function to setup checkout button event listener
function setupCheckoutButton(button) {
    if (!button) {
        button = document.querySelector('.cart-drawer__checkout');
    }

    if (!button) return;

    // Remove existing listeners by cloning and replacing
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener('click', () => {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
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

        const userLanguage = localStorage.getItem('userLanguage') || 'ES';

        if (!currentUser) {
            // Redirect to login page
            const loginPages = {
                ES: 'sesion.html',
                EN: 'session.html',
                FR: 'connexion.html',
                EU: 'saioa.html'
            };
            const redirectPages = {
                ES: 'finalizar-compra',
                EN: 'checkout',
                FR: 'commande',
                EU: 'erosketa-bukatu'
            };
            const loginPage = loginPages[userLanguage] || 'sesion.html';
            const redirectPage = redirectPages[userLanguage] || 'finalizar-compra';
            window.location.href = `${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}`;
        } else {
            // Redirect to checkout page
            const checkoutPages = {
                ES: 'finalizar-compra.html',
                EN: 'checkout.html',
                FR: 'commande.html',
                EU: 'erosketa-bukatu.html'
            };
            const checkoutPage = checkoutPages[userLanguage] || 'finalizar-compra.html';
            window.location.href = `${basePath}${checkoutPage}`;
        }
    });
}
