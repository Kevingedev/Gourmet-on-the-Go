

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const userLanguage = localStorage.getItem('userLanguage');
    const header = document.getElementById('header');
    
    // Calculate PATH based on current location
    let PATH = '';
    const pathname = window.location.pathname;
    
    // Count depth by counting slashes (excluding leading slash)
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    const depth = pathParts.length;
    
    // More reliable path calculation
    if (pathParts.includes('catalogo') || pathParts.includes('catalog') || pathParts.includes('catalogue') || pathParts.includes('katalogoa')) {
        // We're in a catalog subfolder (e.g., ES/catalogo/carnes/, FR/catalogue/viandes/)
        PATH = '../../../';
    } else if (pathParts.includes('404')) {
        // We're in 404 folder (e.g., ES/404/index.html)
        PATH = '../../../';
    } else if (pathParts.includes('ES') || pathParts.includes('EN') || pathParts.includes('FR') || pathParts.includes('EU')) {
        // We're in ES/, EN/, FR/, or EU/ folder (e.g., ES/index.html)
        // Need to go up one level to reach assets folder
        PATH = '../';
    } else if (depth === 0 || (depth === 1 && pathParts[0] === 'index.html')) {
        // We're at root level
        PATH = './';
    } else {
        // Fallback - go up one level
        PATH = '../';
    }
    // console.log(userLanguage);
    const currentUser = localStorage.getItem('currentUser');
    const currentUserData = JSON.parse(currentUser) || {};

    const WELCOME = document.getElementById('section-bienvenida'); // ESTO RETORNA UN NODO HTML SI EXISTE Y SI NO EXISTE RETORNA UN NODO NULL
    // console.log(currentUserData);
    let btnSesion;
    let wellcome = {
        ES: `Hola <strong>${!currentUserData.username ? ' ' : currentUserData.username }  </strong> te damos la Bienvenida a Gourmet on the Go!`,
        EN: `Hello <strong>${!currentUserData.username ? '' : currentUserData.username}</strong> we welcome you to Gourmet on the Go!`,
        FR: `Bonjour <strong>${!currentUserData.username ? '' : currentUserData.username}</strong> nous vous souhaitons la bienvenue à Gourmet on the Go!`,
        EU: `Kaixo <strong>${!currentUserData.username ? '' : currentUserData.username}</strong> Gourmet on the Go-ra ongi etorri!`
    };

    // console.log(currentUser);

    let langSelect;
    const langLabels = {
        ES: 'Español',
        EN: 'English',
        FR: 'Français',
        EU: 'Euskera'
    };
    
    if (userLanguage === 'ES') {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Seleccionar idioma">
            <option value="ES" selected>ES - ${langLabels.ES}</option>
            <option value="EN">EN - ${langLabels.EN}</option>
            <option value="FR">FR - ${langLabels.FR}</option>
            <option value="EU">EU - ${langLabels.EU}</option>
        </select>
    `;
    } else if (userLanguage === 'EN') {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Select language">
            <option value="ES">ES - ${langLabels.ES}</option>
            <option value="EN" selected>EN - ${langLabels.EN}</option>
            <option value="FR">FR - ${langLabels.FR}</option>
            <option value="EU">EU - ${langLabels.EU}</option>
        </select>
    `;
    } else if (userLanguage === 'FR') {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Sélectionner la langue">
            <option value="ES">ES - ${langLabels.ES}</option>
            <option value="EN">EN - ${langLabels.EN}</option>
            <option value="FR" selected>FR - ${langLabels.FR}</option>
            <option value="EU">EU - ${langLabels.EU}</option>
        </select>
    `;
    } else {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Hizkuntza aukeratu">
            <option value="ES">ES - ${langLabels.ES}</option>
            <option value="EN">EN - ${langLabels.EN}</option>
            <option value="FR">FR - ${langLabels.FR}</option>
            <option value="EU" selected>EU - ${langLabels.EU}</option>
        </select>
    `;
    }
    // Language-specific strings for favorites
    const favoritesLinks = {
        ES: 'favoritos.html',
        EN: 'favorites.html',
        FR: 'favoris.html',
        EU: 'gogokoak.html'
    };
    const favoritesLabels = {
        ES: 'Ir a Favoritos',
        EN: 'Go to Favorites',
        FR: 'Aller aux Favoris',
        EU: 'Gogokoetara joan'
    };
    const favoritesTitles = {
        ES: 'Favoritos',
        EN: 'Favorites',
        FR: 'Favoris',
        EU: 'Gogokoak'
    };
    const favoritesLink = favoritesLinks[userLanguage] || favoritesLinks.ES;
    const favoritesLabel = favoritesLabels[userLanguage] || favoritesLabels.ES;
    const favoritesTitle = favoritesTitles[userLanguage] || favoritesTitles.ES;
    

    // Textos para botones de sesión según idioma
    const sessionTexts = {
        ES: {
            loginTitle: 'Iniciar sesión',
            logoutTitle: 'Cerrar sesión',
            loginButton: 'Iniciar Sesión',
            searchLabel: 'Buscar productos',
            searchPlaceholder: 'Buscar alimentos...',
            searchAriaLabel: 'Buscar',
            cartLabel: 'Carrito',
            cartTitle: 'Carrito'
        },
        EN: {
            loginTitle: 'Sign in',
            logoutTitle: 'Sign out',
            loginButton: 'Sign In',
            searchLabel: 'Search products',
            searchPlaceholder: 'Search foods...',
            searchAriaLabel: 'Search',
            cartLabel: 'Cart',
            cartTitle: 'Cart'
        },
        FR: {
            loginTitle: 'Se connecter',
            logoutTitle: 'Se déconnecter',
            loginButton: 'Se connecter',
            searchLabel: 'Rechercher des produits',
            searchPlaceholder: 'Rechercher des aliments...',
            searchAriaLabel: 'Rechercher',
            cartLabel: 'Panier',
            cartTitle: 'Panier'
        },
        EU: {
            loginTitle: 'Saioa hasi',
            logoutTitle: 'Saioa itxi',
            loginButton: 'Saioa hasi',
            searchLabel: 'Produktuak bilatu',
            searchPlaceholder: 'Elikagaiak bilatu...',
            searchAriaLabel: 'Bilatu',
            cartLabel: 'Saskia',
            cartTitle: 'Saskia'
        }
    };
    const sessionText = sessionTexts[userLanguage] || sessionTexts.ES;
    
    if (currentUser) {
        btnSesion = `<button class="btn-login" title="${sessionText.logoutTitle}" data-modal-open="#logoutModal" id="btn-logout">${currentUserData.username}</button>`;
    } else {
        btnSesion = `<button class="btn-login" title="${sessionText.loginTitle}" data-modal-open="#loginModal" id="btn-login"><i class="fa-solid fa-user"></i></button>`;
    }

    // Ensure PATH ends with / for consistent path construction
    const assetsPath = PATH.endsWith('/') ? PATH : `${PATH}/`;
    
    // Debug: log the paths (remove in production)
    // console.log('URL:', url);
    // console.log('PATH:', PATH);
    // console.log('assetsPath:', assetsPath);
    // console.log('jsonPath will be:', `${assetsPath}assets/data/categories.json`);
    
    const navbar = `
<nav class="nav">
        <div class="nav__logo">
            <img src="${assetsPath}assets/img/gourmet-logo-icon.png" alt="Logo Gourmet on the Go" width="40" class="logo-icon">
            <a href="/${userLanguage}">Gourmet on the Go</a>
            <img src="${assetsPath}assets/img/gourmet-logo-text.png" alt="Logo Gourmet on the Go" width="35" class="logo-text">
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
            <div class="nav__search" aria-label="${sessionText.searchLabel}">
                <span class="nav__search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="search" name="q" id="nav-search-input" class="nav__search-input" autocomplete="off" placeholder="${sessionText.searchPlaceholder}"
                    aria-label="${sessionText.searchAriaLabel}">
                <div class="nav__search-results" id="search-results"></div>
            </div>

            <div class="nav__actions">
            <a href="${PATH}${userLanguage}/${favoritesLink}" aria-label="${favoritesLabel}" title="${favoritesLabel}">
                <button class="icon-btn" aria-label="${favoritesTitle}" title="${favoritesTitle}">
                    <i class="fa-solid fa-heart"></i>
                </button>
                </a>
                <button class="icon-btn js-cart-toggle" aria-label="${sessionText.cartLabel}" aria-expanded="false" title="${sessionText.cartTitle}">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="badge" id="cart-count">0</span>
                </button>
                ${btnSesion}
                <div class="lang-select-wrapper">
                ${langSelect}
                </div>
            </div>
        </div>
    </nav>
`;


    // estoy insertando el navbar y el cartDrawer
    header.innerHTML = navbar;
    // console.log(WELCOME);
    if (WELCOME != null) {
        if (!currentUser) {
            document.getElementById('section-bienvenida').innerHTML = `
            <br>
            <h2>¡${wellcome[userLanguage]}!</h2>
            <button class="btn" title="${sessionText.loginTitle}" data-modal-open="#loginModal" id="btn-login">${sessionText.loginButton}</button>
            <br>
            `;
        } else {
            document.getElementById('section-bienvenida').innerHTML = `<br>
            <h2>¡${wellcome[userLanguage]}!</h2>
            <br>
            `;
        }
    }


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
    // Use assetsPath for consistent path construction
    const jsonPath = `${assetsPath}assets/data/categories.json`;

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
                const lang = userLanguage || 'ES';
                const urlSlug = category.url_slug[lang] || category.url_slug.ES;
                const nombre = category.nombre[lang] || category.nombre.ES;
                linksHTML += `
                    <li>
                        <a href="${PATH}${lang}${urlSlug}">${nombre}</a>
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



    // console.log(url);

    // Mapeo de páginas entre idiomas
    const pageMapping = {
        ES: {
            'contacto.html': { EN: 'contact.html', FR: 'contact.html', EU: 'kontaktua.html' },
            'quienes-somos.html': { EN: 'about-us.html', FR: 'a-propos.html', EU: 'guri-buruz.html' },
            'aviso-legal.html': { EN: 'legal-notice.html', FR: 'avis-legal.html', EU: 'lege-oharra.html' },
            'politica-privacidad.html': { EN: 'privacy-policy.html', FR: 'politique-confidentialite.html', EU: 'pribatutasun-politika.html' },
            'politica-cookies.html': { EN: 'cookie-policy.html', FR: 'politique-cookies.html', EU: 'cookie-politika.html' },
            'pago.html': { EN: 'payment.html', FR: 'paiement.html', EU: 'ordainketa.html' },
            'envio.html': { EN: 'shipping.html', FR: 'livraison.html', EU: 'bidalketa.html' },
            'condiciones-uso.html': { EN: 'terms-of-use.html', FR: 'conditions-utilisation.html', EU: 'erabilera-baldintzak.html' },
            'busqueda.html': { EN: 'search.html', FR: 'recherche.html', EU: 'bilaketa.html' },
            'carrito.html': { EN: 'cart.html', FR: 'panier.html', EU: 'saskia.html' },
            'favoritos.html': { EN: 'favorites.html', FR: 'favoris.html', EU: 'gogokoak.html' },
            'perfil.html': { EN: 'profile.html', FR: 'profil.html', EU: 'profila.html' },
            'producto-detalle.html': { EN: 'product-detail.html', FR: 'detail-produit.html', EU: 'produktu-xehetasuna.html' },
            'productos.html': { EN: 'products.html', FR: 'produits.html', EU: 'produktuak.html' },
            'sesion.html': { EN: 'session.html', FR: 'connexion.html', EU: 'saioa.html' },
            'finalizar-compra.html': { EN: 'checkout.html', FR: 'commande.html', EU: 'erosketa-bukatu.html' },
            'index.html': 'index.html'
        },
        EN: {
            'contact.html': { ES: 'contacto.html', FR: 'contact.html', EU: 'kontaktua.html' },
            'about-us.html': { ES: 'quienes-somos.html', FR: 'a-propos.html', EU: 'guri-buruz.html' },
            'legal-notice.html': { ES: 'aviso-legal.html', FR: 'avis-legal.html', EU: 'lege-oharra.html' },
            'privacy-policy.html': { ES: 'politica-privacidad.html', FR: 'politique-confidentialite.html', EU: 'pribatutasun-politika.html' },
            'cookie-policy.html': { ES: 'politica-cookies.html', FR: 'politique-cookies.html', EU: 'cookie-politika.html' },
            'payment.html': { ES: 'pago.html', FR: 'paiement.html', EU: 'ordainketa.html' },
            'shipping.html': { ES: 'envio.html', FR: 'livraison.html', EU: 'bidalketa.html' },
            'terms-of-use.html': { ES: 'condiciones-uso.html', FR: 'conditions-utilisation.html', EU: 'erabilera-baldintzak.html' },
            'search.html': { ES: 'busqueda.html', FR: 'recherche.html', EU: 'bilaketa.html' },
            'cart.html': { ES: 'carrito.html', FR: 'panier.html', EU: 'saskia.html' },
            'favorites.html': { ES: 'favoritos.html', FR: 'favoris.html', EU: 'gogokoak.html' },
            'profile.html': { ES: 'perfil.html', FR: 'profil.html', EU: 'profila.html' },
            'product-detail.html': { ES: 'producto-detalle.html', FR: 'detail-produit.html', EU: 'produktu-xehetasuna.html' },
            'products.html': { ES: 'productos.html', FR: 'produits.html', EU: 'produktuak.html' },
            'session.html': { ES: 'sesion.html', FR: 'connexion.html', EU: 'saioa.html' },
            'checkout.html': { ES: 'finalizar-compra.html', FR: 'commande.html', EU: 'erosketa-bukatu.html' },
            'index.html': 'index.html'
        },
        FR: {
            'contact.html': { ES: 'contacto.html', EN: 'contact.html', EU: 'kontaktua.html' },
            'a-propos.html': { ES: 'quienes-somos.html', EN: 'about-us.html', EU: 'guri-buruz.html' },
            'avis-legal.html': { ES: 'aviso-legal.html', EN: 'legal-notice.html', EU: 'lege-oharra.html' },
            'politique-confidentialite.html': { ES: 'politica-privacidad.html', EN: 'privacy-policy.html', EU: 'pribatutasun-politika.html' },
            'politique-cookies.html': { ES: 'politica-cookies.html', EN: 'cookie-policy.html', EU: 'cookie-politika.html' },
            'paiement.html': { ES: 'pago.html', EN: 'payment.html', EU: 'ordainketa.html' },
            'livraison.html': { ES: 'envio.html', EN: 'shipping.html', EU: 'bidalketa.html' },
            'conditions-utilisation.html': { ES: 'condiciones-uso.html', EN: 'terms-of-use.html', EU: 'erabilera-baldintzak.html' },
            'recherche.html': { ES: 'busqueda.html', EN: 'search.html', EU: 'bilaketa.html' },
            'panier.html': { ES: 'carrito.html', EN: 'cart.html', EU: 'saskia.html' },
            'favoris.html': { ES: 'favoritos.html', EN: 'favorites.html', EU: 'gogokoak.html' },
            'profil.html': { ES: 'perfil.html', EN: 'profile.html', EU: 'profila.html' },
            'detail-produit.html': { ES: 'producto-detalle.html', EN: 'product-detail.html', EU: 'produktu-xehetasuna.html' },
            'produits.html': { ES: 'productos.html', EN: 'products.html', EU: 'produktuak.html' },
            'connexion.html': { ES: 'sesion.html', EN: 'session.html', EU: 'saioa.html' },
            'commande.html': { ES: 'finalizar-compra.html', EN: 'checkout.html', EU: 'erosketa-bukatu.html' },
            'index.html': 'index.html'
        },
        EU: {
            'kontaktua.html': { ES: 'contacto.html', EN: 'contact.html', FR: 'contact.html' },
            'guri-buruz.html': { ES: 'quienes-somos.html', EN: 'about-us.html', FR: 'a-propos.html' },
            'lege-oharra.html': { ES: 'aviso-legal.html', EN: 'legal-notice.html', FR: 'avis-legal.html' },
            'pribatutasun-politika.html': { ES: 'politica-privacidad.html', EN: 'privacy-policy.html', FR: 'politique-confidentialite.html' },
            'cookie-politika.html': { ES: 'politica-cookies.html', EN: 'cookie-policy.html', FR: 'politique-cookies.html' },
            'ordainketa.html': { ES: 'pago.html', EN: 'payment.html', FR: 'paiement.html' },
            'bidalketa.html': { ES: 'envio.html', EN: 'shipping.html', FR: 'livraison.html' },
            'erabilera-baldintzak.html': { ES: 'condiciones-uso.html', EN: 'terms-of-use.html', FR: 'conditions-utilisation.html' },
            'bilaketa.html': { ES: 'busqueda.html', EN: 'search.html', FR: 'recherche.html' },
            'saskia.html': { ES: 'carrito.html', EN: 'cart.html', FR: 'panier.html' },
            'gogokoak.html': { ES: 'favoritos.html', EN: 'favorites.html', FR: 'favoris.html' },
            'profila.html': { ES: 'perfil.html', EN: 'profile.html', FR: 'profil.html' },
            'produktu-xehetasuna.html': { ES: 'producto-detalle.html', EN: 'product-detail.html', FR: 'detail-produit.html' },
            'produktuak.html': { ES: 'productos.html', EN: 'products.html', FR: 'produits.html' },
            'saioa.html': { ES: 'sesion.html', EN: 'session.html', FR: 'connexion.html' },
            'erosketa-bukatu.html': { ES: 'finalizar-compra.html', EN: 'checkout.html', FR: 'commande.html' },
            'index.html': 'index.html'
        }
    };

    // CODIGO DE ACCIONES PARA EL CAMBIO DE IDIOMA

    
    document.querySelector('.lang-select').addEventListener('change', function () {
        const lang = this.value; // El VALOR DEL SELECT
        let currentUrl;
        let currentLang = url.split('/')[3]; // EL IDIOMA ACTUAL en la URL
        let newUrl;

        // Si el idioma es el mismo, no hacer nada
        if (currentLang === lang) {
            return;
        }

        // Obtener el nombre del archivo actual (sin query parameters)
        let currentFileName = urlCategoria[urlCategoria.length - 1] || 'index.html';
        
        // Preservar query parameters (como ?pd=PM002)
        const urlObj = new URL(url);
        const queryParams = urlObj.search; // Esto incluye el "?" y los parámetros
        
        // Remover query params del filename si están incluidos
        if (currentFileName.includes('?')) {
            currentFileName = currentFileName.split('?')[0];
        }
        
        // Determinar la ruta base según la ubicación
        let basePath = '';
        if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
            basePath = '../../../';
        } else if (urlCategoria[4] == '404') {
            basePath = '../../../';
        } else {
            basePath = '../';
        }

        // Manejar páginas del catálogo
        if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
            currentUrl = "/" + urlCategoria[4] + "/" + urlCategoria[5];
            changeUrl(currentLang, currentUrl).then((result) => {
                const urlSlug = result;
                newUrl = basePath + lang + urlSlug.url_slug[lang] + queryParams;
                localStorage.setItem('userLanguage', lang);
                window.location.href = newUrl;
            }).catch((err) => {
                console.log(err);
                localStorage.setItem('userLanguage', lang);
            });
        } 
        // Manejar páginas normales (contacto, producto-detalle, etc.)
        else if (currentFileName.includes('.html')) {
            // Verificar si existe un mapeo para esta página
            const mapping = pageMapping[currentLang];
            if (mapping && mapping[currentFileName]) {
                let mappedFile;
                // Si el mapeo es un objeto, obtener el archivo según el idioma destino
                if (typeof mapping[currentFileName] === 'object') {
                    mappedFile = mapping[currentFileName][lang] || currentFileName;
                } else {
                    mappedFile = mapping[currentFileName];
                }
                // Si el archivo mapeado es index.html, usar URL limpia sin /index.html
                if (mappedFile === 'index.html') {
                    newUrl = basePath + lang + '/' + queryParams;
                } else {
                    // Agregar query parameters al final
                    newUrl = basePath + lang + '/' + mappedFile + queryParams;
                }
            } else if (currentFileName === 'index.html') {
                // Para index.html, usar URL limpia sin /index.html
                newUrl = basePath + lang + '/' + queryParams;
            } else {
                // Si no hay mapeo, intentar usar el mismo nombre de archivo
                newUrl = basePath + lang + '/' + currentFileName + queryParams;
            }
            localStorage.setItem('userLanguage', lang);
            // Disparar evento antes de redirigir para actualizar el modal si está abierto
            window.dispatchEvent(new Event('languageChanged'));
            window.location.href = newUrl;
        }
        // Manejar páginas index (raíz) - URL ya limpia
        else if (!urlCategoria[4] || urlCategoria[4] === '' || urlCategoria[urlCategoria.length - 1] === '') {
            newUrl = basePath + lang + '/';
            localStorage.setItem('userLanguage', lang);
            // Disparar evento antes de redirigir para actualizar el modal si está abierto
            window.dispatchEvent(new Event('languageChanged'));
            window.location.href = newUrl;
        }
        // Fallback: redirigir al index del idioma seleccionado con URL limpia
        else {
            newUrl = basePath + lang + '/';
            localStorage.setItem('userLanguage', lang);
            // Disparar evento antes de redirigir para actualizar el modal si está abierto
            window.dispatchEvent(new Event('languageChanged'));
            window.location.href = newUrl;
        }
    });

    // BUSCADOR - Funcionalidad de búsqueda con autocompletado
    // Inicializar después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        inicializarBuscador();
    }, 200);

});

async function inicializarBuscador() {
    // Esperar un poco para asegurar que el DOM esté listo
    await new Promise(resolve => setTimeout(resolve, 100));

    const inputBusqueda = document.getElementById('nav-search-input');
    const resultadosBusqueda = document.getElementById('search-results');
    const contenedorBusqueda = document.querySelector('.nav__search');

    if (!inputBusqueda || !resultadosBusqueda) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }

    let tiempoEspera;
    let resultadosActuales = [];

    // Hacer que el input reciba foco cuando se hace clic en cualquier parte del buscador
    if (contenedorBusqueda) {
        contenedorBusqueda.addEventListener('click', (e) => {
            // Si no es un resultado de búsqueda, dar foco al input
            if (!e.target.closest('.nav__search-results')) {
                e.preventDefault();
                e.stopPropagation();
                inputBusqueda.focus();
            }
        });

        // Permitir que el icono de búsqueda también active el foco
        const iconoBusqueda = contenedorBusqueda.querySelector('.nav__search-icon');
        if (iconoBusqueda) {
            iconoBusqueda.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                inputBusqueda.focus();
            });
            iconoBusqueda.style.cursor = 'pointer';
        }
    }

    // Función para buscar productos
    async function buscarProductos(consulta) {
        if (!consulta || consulta.length < 1) {
            resultadosBusqueda.innerHTML = '';
            resultadosBusqueda.classList.remove('is-visible');
            resultadosActuales = [];
            return;
        }

        try {
            const { gestorDeDatos } = await import('./data-loader/productService.js');
            const productos = await gestorDeDatos.cargarProductosPorNombre(consulta);
            resultadosActuales = productos;
            mostrarSugerencias(productos, consulta);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            resultadosBusqueda.innerHTML = '';
            resultadosBusqueda.classList.remove('is-visible');
        }
    }

    // Mostrar resultados mientras escribes - aparece automáticamente
    inputBusqueda.addEventListener('input', (e) => {
        const consulta = e.target.value.trim();
        clearTimeout(tiempoEspera);

        if (consulta.length >= 1) {
            tiempoEspera = setTimeout(() => {
                buscarProductos(consulta);
            }, 100);
        } else {
            resultadosBusqueda.innerHTML = '';
            resultadosBusqueda.classList.remove('is-visible');
            resultadosBusqueda.style.display = 'none';
            resultadosActuales = [];
        }
    });

    // También buscar con keyup para asegurar que funcione
    inputBusqueda.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') return;

        const consulta = e.target.value.trim();
        clearTimeout(tiempoEspera);

        if (consulta.length >= 1) {
            tiempoEspera = setTimeout(() => {
                buscarProductos(consulta);
            }, 100);
        } else {
            resultadosBusqueda.innerHTML = '';
            resultadosBusqueda.classList.remove('is-visible');
            resultadosBusqueda.style.display = 'none';
            resultadosActuales = [];
        }
    });

    // Redirigir con Enter
    inputBusqueda.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const consulta = inputBusqueda.value.trim();
            if (consulta.length >= 1) {
                redirigirABusqueda(consulta);
            }
        }
        if (e.key === 'Escape') {
            resultadosBusqueda.classList.remove('is-visible');
            inputBusqueda.blur();
        }
    });

    // Mostrar resultados cuando el input tiene foco
    inputBusqueda.addEventListener('focus', () => {
        const consulta = inputBusqueda.value.trim();
        if (consulta.length >= 1) {
            if (resultadosActuales.length > 0) {
                resultadosBusqueda.classList.add('is-visible');
            } else {
                buscarProductos(consulta);
            }
        }
    });

    // Cerrar dropdown al hacer clic fuera (mejorado para móvil)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__search') && !e.target.closest('.nav__search-results')) {
            resultadosBusqueda.classList.remove('is-visible');
            resultadosBusqueda.style.display = 'none';
        }
    });

    // Cerrar dropdown al hacer scroll en móvil
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 1110) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (resultadosBusqueda.classList.contains('is-visible')) {
                    resultadosBusqueda.classList.remove('is-visible');
                    resultadosBusqueda.style.display = 'none';
                }
            }, 100);
        }
    }, { passive: true });

    function mostrarSugerencias(productos, consulta) {
        if (!resultadosBusqueda) return;

        const idioma = localStorage.getItem('userLanguage') || 'ES';
        const closeText = idioma === 'EN' ? 'Close' : 'Cerrar';

        if (productos.length === 0) {
            resultadosBusqueda.innerHTML = `
                <div class="search-results-header">
                    <span>${idioma === 'EN' ? 'No products found' : 'Sin resultados'}</span>
                    <button class="search-results-close" aria-label="${closeText}" title="${closeText}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="search-result-item search-result-empty">
                    <p>${idioma === 'EN' ? `No products found for "${consulta}"` : `No se encontraron productos para "${consulta}"`}</p>
                </div>
            `;
            resultadosBusqueda.style.display = 'block';
            resultadosBusqueda.classList.add('is-visible');
        } else {
            const rutaBase = obtenerRutaBase();

            resultadosBusqueda.innerHTML = `
                <div class="search-results-header">
                    <span>${idioma === 'EN' ? 'Search Results' : 'Resultados'}</span>
                    <button class="search-results-close" aria-label="${closeText}" title="${closeText}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                ${productos.slice(0, 5).map(producto => `
                    <div class="search-result-item" data-product-id="${producto.id_producto}">
                        <img src="${rutaBase}${producto.img_url}" alt="${producto.nombre[idioma]}">
                        <div class="search-result-info">
                            <h4>${producto.nombre[idioma]}</h4>
                            <p class="search-result-desc">${producto.descripcion[idioma].substring(0, 60)}${producto.descripcion[idioma].length > 60 ? '...' : ''}</p>
                            <div class="search-result-footer">
                                <span class="search-result-unit">${producto.unidad_medida[idioma]}</span>
                                <span class="search-result-price">${producto.precio}€</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            `;

            // Agregar evento click al botón de cerrar
            const closeBtn = resultadosBusqueda.querySelector('.search-results-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resultadosBusqueda.classList.remove('is-visible');
                    resultadosBusqueda.style.display = 'none';
                    inputBusqueda.blur();
                });
            }

            // Agregar evento click a cada resultado
            resultadosBusqueda.querySelectorAll('.search-result-item:not(.search-result-empty)').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Don't trigger if clicking on the close button
                    if (e.target.closest('.search-results-close')) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    const consulta = inputBusqueda.value.trim();
                    redirigirABusqueda(consulta);
                });
            });

            resultadosBusqueda.style.display = 'block';
            resultadosBusqueda.classList.add('is-visible');
        }
    }

    function redirigirABusqueda(consulta) {
        if (!consulta || consulta.trim().length < 1) {
            return;
        }

        const idioma = localStorage.getItem('userLanguage') || 'ES';
        const rutaBase = obtenerRutaBase();
        const paginaBusqueda = idioma === 'EN' ? 'search.html' : 'busqueda.html';
        window.location.href = `${rutaBase}${idioma}/${paginaBusqueda}?q=${encodeURIComponent(consulta)}`;
    }

    function obtenerRutaBase() {
        const path = window.location.pathname;
        if (path.includes('/catalogo/') || path.includes('/catalog/')) {
            return '../../../';
        } else if (path.includes('/ES/') || path.includes('/EN/')) {
            return '../';
        }
        return '/';
    }
}

function updateDateTime() {
    // Obtener el elemento HTML
    const displayElement = document.getElementById('datetime-display');
    if (!displayElement) return;

    // Obtener el idioma del usuario desde localStorage
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    
    // Traducciones manuales para Euskera
    const euTranslations = {
        days: {
            'monday': 'astelehena',
            'tuesday': 'asteartea',
            'wednesday': 'asteazkena',
            'thursday': 'osteguna',
            'friday': 'ostirala',
            'saturday': 'larunbata',
            'sunday': 'igandea'
        },
        months: {
            'january': 'urtarrila',
            'february': 'otsaila',
            'march': 'martxoa',
            'april': 'apirila',
            'may': 'maiatza',
            'june': 'ekaina',
            'july': 'uztaila',
            'august': 'abuztua',
            'september': 'iraila',
            'october': 'urria',
            'november': 'azaroa',
            'december': 'abendua'
        }
    };
    
    const localeMap = {
        ES: 'es-ES',
        EN: 'en-US',
        FR: 'fr-FR',
        EU: 'eu' // Cambiado a 'eu' que es el locale estándar para Euskera
    };
    const locale = localeMap[userLanguage] || 'es-ES';

    // Crear objeto de fecha actual
    const now = new Date();

    // --- Obtener las partes con el formato solicitado según el idioma ---

    let dayOfWeek, month;
    
    if (userLanguage === 'EU') {
        // Para Euskera, usar traducciones manuales
        const dayIndex = now.getDay(); // 0 = domingo, 1 = lunes, etc.
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        dayOfWeek = euTranslations.days[dayNames[dayIndex]];
        
        const monthIndex = now.getMonth(); // 0 = enero, 11 = diciembre
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        month = euTranslations.months[monthNames[monthIndex]];
    } else {
        // Para otros idiomas, usar el locale estándar
        dayOfWeek = now.toLocaleDateString(locale, { weekday: 'long' });
        month = now.toLocaleDateString(locale, { month: 'long' });
    }

    // 2. Hora (formato 24h, incluyendo minutos)
    const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false, second: '2-digit' });

    // 4. Año (completo)
    const year = now.getFullYear();

    // Capitalizar la primera letra del día y del mes
    const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    // --- Construir el string final con separadores ---

    // Usamos la etiqueta <span> para estilizar los separadores si es necesario
    const separator = '<span class="separator">-</span>';

    const finalContent =
        formattedDay +
        separator + time +
        separator + formattedMonth +
        separator + year;

    // Insertar el contenido en el HTML
    displayElement.innerHTML = finalContent;
}

// Ejecutar la función inmediatamente para cargar la hora al inicio
updateDateTime();

// Actualizar la hora cada segundo (1000 milisegundos)
setInterval(updateDateTime, 1000);