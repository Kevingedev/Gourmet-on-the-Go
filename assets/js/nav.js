

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const cartDrawer = document.getElementById('cart-drawer');

    const navbar = `
<nav class="nav">
        <div class="nav__logo">
            <img src="../../assets/img/gourmet-logo-icon.png" alt="Logo Gourmet on the Go" width="25" class="logo-icon">
            <a href="#">Gourmet on the Go</a>
            <img src="../../assets/img/gourmet-logo-text.png" alt="Logo Gourmet on the Go" width="35" class="logo-text">
        </div>

        <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <div class="nav__right">
            <ul class="nav__links">
                <li><a href="#categoria1">Platos preparados</a></li>
                <li><a href="#categoria2">Vegano</a></li>
                <li><a href="#categoria3">Sin gluten</a></li>
                <li><a href="#categoria4">Ofertas</a></li>
            </ul>
            <!-- BUSCADOR -->
            <div class="nav__search" aria-label="Buscar productos">
                <span class="nav__search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="search" name="q" class="nav__search-input" placeholder="Buscar alimentos..."
                    aria-label="Buscar">
            </div>

            <div class="nav__actions">
                <button class="icon-btn" aria-label="Favoritos">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <button class="icon-btn js-cart-toggle" aria-label="Carrito" aria-expanded="false">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="badge">3</span>
                </button>
                <a href="#login" class="btn-login">Iniciar sesión</a>
            </div>
        </div>
    </nav>
`;
    const cartDrawerHTML = `
<div class="cart-drawer-overlay" data-cart-overlay></div>

    <aside class="cart-drawer" aria-label="Carrito de compras" data-cart-drawer>
        <header class="cart-drawer__header">
            <h2>Carrito</h2>
            <button class="cart-drawer__close js-cart-toggle" aria-label="Cerrar carrito">
                &times;
            </button>
        </header>

        <div class="cart-drawer__body">
            <!-- Ejemplo de contenido minimal -->
            <p class="cart-drawer__empty">Tu carrito está vacío.</p>
            <!-- Aquí irían los productos del carrito -->
        </div>

        <footer class="cart-drawer__footer">
            <div class="cart-drawer__total">
                <span>Total</span>
                <strong>$0.00</strong>
            </div>
            <button class="cart-drawer__checkout">Finalizar compra</button>
        </footer>
    </aside>
`;

    header.innerHTML = navbar;
    cartDrawer.innerHTML = cartDrawerHTML;

    const navToggle = document.querySelector('.nav__toggle');
    const navRight = document.querySelector('.nav__right');

    navToggle.addEventListener('click', () => {
        const isOpen = navRight.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

});