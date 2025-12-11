
import { gestorDeDatos } from "../data-loader/productService.js";
import { cartStore } from "./cartStore.js";

// Obtener idioma
const language = gestorDeDatos.language;

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

const texts = cartTexts[language] || cartTexts.ES;

const cartDrawer = document.getElementById('cart-drawer');
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
            <button class="cart-drawer__checkout">${texts.checkout}</button>
        </footer>
    </aside>
`;
cartDrawer.innerHTML = cartDrawerHTML;

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
    }

    const productList = document.querySelector('.container-products'); // Aqui siempre se van a encontrar los productos que se agregaran al carrito
    let slideCart = 0;
    // Evento para agregar productos al carrito (only if productList exists)
    if (productList) {
        productList.addEventListener('click', (event) => {

            if (event.target.classList.contains('btn-add-to-cart')) {
                const button = event.target;
                const originalText = button.textContent;

                const products = cartStore.addToCart(event);
                drawerEmpty.style.display = 'none';

                uploadItems(products, cartDrawerContainer); // Cargando los items al carrito si hace click en el boton de agregar al carrito

                // Feedback visual en el botón
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

    // Checkout button handler
    const checkoutButton = document.querySelector('.cart-drawer__checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // Check if user is logged in
            const currentUser = localStorage.getItem('currentUser');
            const url = window.location.href;
            const urlCategoria = url.split('/');
            let basePath = '';
            
            if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog') {
                basePath = '../../../';
            } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN') {
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
                window.location.href = `${basePath}${userLanguage}/${checkoutPage}`;
            }
        });
    }

});






const amountCart = document.querySelector('.cart-drawer__total strong');

function uploadItems(products, cartDrawerContainer) {
    //Tendrá el contenedor de items.
    cartDrawerContainer.innerHTML = '';
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
        cartDrawerContainer.appendChild(card);

    })
    let totalItems = cartStore.countCart();
    document.getElementById('cart-count').textContent = totalItems;
    amountCart.textContent = cartStore.totalCart() + '€';
}
