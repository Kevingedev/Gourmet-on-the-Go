
import { cartStore } from "./cartStore.js";

// Obtener idioma
const language = localStorage.getItem('userLanguage') || 'ES';

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
    // Evento para agregar productos al carrito
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


    const quantityInput = document.querySelector('.quantity-input');
    // Evento para eliminar productos del carrito
    cartDrawerContainer.addEventListener('click', (event) => {

        const idProduct = event.target.parentElement.parentElement.parentElement.getAttribute('data-product-id');
        // const eventTarget = event.target;
        console.log(idProduct);

        if (event.target.dataset.action === `remove${idProduct}`) {
            // console.log("eliminar");

            const products = cartStore.removeFromCart(event);

            uploadItems(products, cartDrawerContainer);
        }

    });

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
                    <button class="btn-quantity" data-action="decrease"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" class="quantity-input" value="${product.quantity}" min="1">
                    <button class="btn-quantity" data-action="increase"><i class="fa-solid fa-plus"></i></button>
                    <button class="btn-remove" data-action="remove${product.id}"><i class="fa-regular fa-trash-can"></i></button>
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
    // if (totalItems == 0 ? drawerEmpty.style.display = 'block' : "");
    document.getElementById('cart-count').textContent = totalItems;
    // USAR amountCart para mostrar el total
    amountCart.textContent = `${cartStore.amountCart()}€`;
}
