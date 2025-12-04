

document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = localStorage.getItem('userLanguage');
    const header = document.getElementById('header');
    const cartDrawer = document.getElementById('cart-drawer');

    console.log(userLanguage);

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
            <ul class="nav__links" id="nav-links">
            </ul>
            <!-- BUSCADOR -->
            <div class="nav__search" aria-label="Buscar productos">
                <span class="nav__search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="search" name="q" class="nav__search-input" placeholder="Buscar alimentos..."
                    aria-label="Buscar">
            </div>

            <div class="nav__actions">
            <a href="http://127.0.0.1:5500/ES/lista-deseos.html" aria-label="Ir a Favoritos" title="Ir a Favoritos">
                <button class="icon-btn" aria-label="Favoritos" title="Favoritos">
                    <i class="fa-solid fa-heart"></i>
                </button>
                </a>
                <button class="icon-btn js-cart-toggle" aria-label="Carrito" aria-expanded="false" title="Carrito">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="badge">3</span>
                </button>
                <a href="#login" class="btn-login" title="Iniciar sesión"><i class="fa-solid fa-user"></i></a>
                <div class="lang-select-wrapper">
                    <select class="lang-select" aria-label="Seleccionar idioma">
                        <option value="es" selected>Español</option>
                        <option value="en">English</option>
                        <!-- Puedes agregar más idiomas aquí -->
                    </select>
                </div>
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

    // estoy insertando el navbar y el cartDrawer
    header.innerHTML = navbar;
    cartDrawer.innerHTML = cartDrawerHTML;

    const navToggle = document.querySelector('.nav__toggle');
    const navRight = document.querySelector('.nav__right');

    navToggle.addEventListener('click', () => {
        const isOpen = navRight.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // traer las categorias e insertarlas en el nav


    // FUNCIÓN ASÍNCRONA PARA CARGAR LAS CATEGORÍAS 
    // Obtener el contenedor específico de los enlaces de categorías
    const categoryLinksContainer = document.getElementById('nav-links');
    const jsonPath = '../../assets/data/categories.json';

    async function fetchCategories(container) {
        try {
            // 1. Espera a que la promesa de fetch se resuelva
            const response = await fetch(jsonPath);

            if (!response.ok) {
                // Lanza un error si el estado HTTP no es 200
                throw new Error(`Error ${response.status}: No se pudo cargar el archivo.`);
            }

            // 2. Espera a que la promesa de response.json() se resuelva
            const categories = await response.json();

            console.log(categories);

            let linksHTML = '';

            // 3. Iterar y construir el HTML
            categories.forEach(category => {
                // console.log(category);
                linksHTML += `
                    <li>
                        <a href="${category.url_slug.es}">${category.nombre.es}</a>
                    </li>
                `;
            });

            // 4. Insertar los enlaces
            container.innerHTML = linksHTML;

        } catch (error) {
            // Captura cualquier error de fetch o de la promesa
            console.error('Fallo al cargar la navegación de categorías:', error);
            // Podrías poner enlaces estáticos o un mensaje de error aquí
        }
    }


    fetchCategories(categoryLinksContainer);






    // CODIGO DE ACCIONES PARA EL CAMBIO DE IDIOMA

    document.querySelector('.lang-select').addEventListener('change', function () {
        const lang = this.value;
        // Aquí tu lógica para traducir la página:
        // changeLanguage(lang);
        // o guarda la preferencia:
        // localStorage.setItem('lang', lang);
        console.log(lang);
        localStorage.setItem('userLanguage', lang);
    });

});