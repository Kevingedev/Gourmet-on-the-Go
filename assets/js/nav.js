

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const userLanguage = localStorage.getItem('userLanguage');
    const header = document.getElementById('header');
    const cartDrawer = document.getElementById('cart-drawer');
    const PATH = urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' ? '../../../' : '../../';
    console.log(userLanguage);
    const currentUser = localStorage.getItem('currentUser');
    const currentUserData = JSON.parse(currentUser);
    // console.log(currentUserData);
    let btnSesion;

    console.log(currentUser);
    if (currentUser) {
        btnSesion = `<button class="btn-login" title="Cerrar sesión" data-modal-open="#logoutModal" id="btn-logout">${currentUserData.username}</button>`;
    } else {
        btnSesion = `<button class="btn-login" title="Iniciar sesión" data-modal-open="#loginModal" id="btn-login"><i class="fa-solid fa-user"></i></button>`;
    }

    const navbar = `
<nav class="nav">
        <div class="nav__logo">
            <img src="${PATH}assets/img/gourmet-logo-icon.png" alt="Logo Gourmet on the Go" width="25" class="logo-icon">
            <a href="/${userLanguage}">Gourmet on the Go</a>
            <img src="${PATH}assets/img/gourmet-logo-text.png" alt="Logo Gourmet on the Go" width="35" class="logo-text">
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
                <input type="search" name="q" class="nav__search-input" autocomplete="off" placeholder="Buscar alimentos..."
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
                ${btnSesion}
                <div class="lang-select-wrapper">
                    <select class="lang-select select-custom" aria-label="Seleccionar idioma">
                        <option selected disabled>Idioma...</option>
                        <option value="ES">🇪🇸 Español</option>
                        <option value="EN">🇬🇧 English</option>
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
    const jsonPath = `${PATH}/assets/data/categories.json`;

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

            // console.log(categories);

            let linksHTML = '';

            // 3. Iterar y construir el HTML
            categories.forEach(category => {
                // console.log(category);
                if (userLanguage === 'ES') {
                    linksHTML += `
                    <li>
                        <a href="${PATH}${userLanguage}${category.url_slug.ES}">${category.nombre.ES}</a>
                    </li>
                `;
                } else {
                    linksHTML += `
                    <li>
                        <a href="${PATH}${userLanguage}${category.url_slug.EN}">${category.nombre.EN}</a>
                    </li>
                `;
                }
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

    // FUNCION DE ACCIONES PARA EL CAMBIO DE IDIOMA
    async function changeUrl(lang, url) {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                //Mensaje de Error ups!
                throw new Error(`Error ${response.status}: No se pudo cargar el archivo.`);
            }
            const data = await response.json();

            // console.log(data);
            let url_slug = data.find(category => category.url_slug[lang] === url);
            // console.log("url_slug desde la funcion:: " + url_slug.url_slug[lang]);
            return url_slug;

        } catch (error) {
            console.error('Fallo al cargar la navegación de categorías:', error);
        }
    }

    //    changeUrl('ES', '/catalogo/carne-aves');



    console.log(url);

    // CODIGO DE ACCIONES PARA EL CAMBIO DE IDIOMA

    document.querySelector('.lang-select').addEventListener('change', function () {
        const lang = this.value; // El VALOR DEL SELECT
        // AQUI CONSTRUYO LA LOGICA PARA CAMBIAR DE IDIOMA
        let currentUrl;
        let currentLang = url.split('/')[3]; // EL IDIOMA ACTUAL en la URL
        let newUrl;

        console.log(url);


        console.log("Posiciones: " + urlCategoria[4]);

        if (urlCategoria[4] == 'catalogo' && currentLang == 'ES' && lang == 'EN') {
            currentUrl = "/" + urlCategoria[4] + "/" + urlCategoria[5];
            let urlSlug;
            changeUrl(currentLang, currentUrl).then((result) => {
                urlSlug = result;
                newUrl = "../../../" + lang + urlSlug.url_slug[lang];
                window.location.href = newUrl;
            }).catch((err) => {
                console.log(err);
            });
        } else if (urlCategoria[4] == 'catalog' && currentLang == 'EN' && lang == 'ES') {
            currentUrl = "/" + urlCategoria[4] + "/" + urlCategoria[5];
            let urlSlug;
            changeUrl(currentLang, currentUrl).then((result) => {
                urlSlug = result;
                newUrl = "../../../" + lang + urlSlug.url_slug[lang];
                window.location.href = newUrl;
            }).catch((err) => {
                console.log(err);
            });
        } else if (urlCategoria[4] == '' && currentLang == 'ES' && lang == 'EN') {
            console.log("hola está vacio");
            newUrl = "../../../" + lang;
            window.location.href = newUrl;

        } else if (urlCategoria[4] == '' && currentLang == 'EN' && lang == 'ES') {
            console.log("hola está vacio");
            newUrl = "../../../" + lang;
            window.location.href = newUrl;

        }




        localStorage.setItem('userLanguage', lang);
    });

});