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
});
