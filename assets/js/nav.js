

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const userLanguage = localStorage.getItem('userLanguage');
    const header = document.getElementById('header');
    const PATH = urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' ? '../../../' : '../../';
    console.log(userLanguage);
    const currentUser = localStorage.getItem('currentUser');
    const currentUserData = JSON.parse(currentUser);
    // console.log(currentUserData);
    let btnSesion;

    // console.log(currentUser);

    let langSelect;
    if (userLanguage === 'ES') {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Seleccionar idioma">
            <option value="ES" selected>🇪🇸</option>
            <option value="EN">🇬🇧</option>
            <!-- Puedes agregar más idiomas aquí -->
        </select>
    `;
    } else {
        langSelect = `
        <select class="lang-select select-custom" aria-label="Seleccionar idioma">
            <option value="ES">🇪🇸</option>
            <option value="EN" selected>🇬🇧</option>
        </select>
    `;
    }
    if (currentUser) {
        btnSesion = `<button class="btn-login" title="Cerrar sesión" data-modal-open="#logoutModal" id="btn-logout">${currentUserData.username}</button>`;
    } else {
        btnSesion = `<button class="btn-login" title="Iniciar sesión" data-modal-open="#loginModal" id="btn-login"><i class="fa-solid fa-user"></i></button>`;
    }

    const navbar = `
<nav class="nav">
        <div class="nav__logo">
            <img src="${PATH}assets/img/gourmet-logo-icon.png" alt="Logo Gourmet on the Go" width="40" class="logo-icon">
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
                <input type="search" name="q" id="nav-search-input" class="nav__search-input" autocomplete="off" placeholder="Buscar alimentos..."
                    aria-label="Buscar">
                <div class="nav__search-results" id="search-results"></div>
            </div>

            <div class="nav__actions">
            <a href="${PATH}${userLanguage}/lista-deseos.html" aria-label="Ir a Favoritos" title="Ir a Favoritos">
                <button class="icon-btn" aria-label="Favoritos" title="Favoritos">
                    <i class="fa-solid fa-heart"></i>
                </button>
                </a>
                <button class="icon-btn js-cart-toggle" aria-label="Carrito" aria-expanded="false" title="Carrito">
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
            const { gestorDeDatos } = await import('../data-loader/productService.js');
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

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__search')) {
            resultadosBusqueda.classList.remove('is-visible');
            resultadosBusqueda.style.display = 'none';
        }
    });

    function mostrarSugerencias(productos, consulta) {
        if (!resultadosBusqueda) return;
        
        if (productos.length === 0) {
            resultadosBusqueda.innerHTML = `
                <div class="search-result-item search-result-empty">
                    <p>No se encontraron productos para "${consulta}"</p>
                </div>
            `;
            resultadosBusqueda.style.display = 'block';
            resultadosBusqueda.classList.add('is-visible');
        } else {
            const idioma = localStorage.getItem('userLanguage') || 'ES';
            const rutaBase = obtenerRutaBase();
            
            resultadosBusqueda.innerHTML = productos.slice(0, 5).map(producto => `
                <div class="search-result-item" data-product-id="${producto.id_producto}">
                    <img src="${rutaBase}assets/img/product-images/img-test.jpg" alt="${producto.nombre[idioma]}">
                    <div class="search-result-info">
                        <h4>${producto.nombre[idioma]}</h4>
                        <p class="search-result-desc">${producto.descripcion[idioma].substring(0, 60)}${producto.descripcion[idioma].length > 60 ? '...' : ''}</p>
                        <div class="search-result-footer">
                            <span class="search-result-unit">${producto.unidad_medida[idioma]}</span>
                            <span class="search-result-price">${producto.precio}€</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Agregar evento click a cada resultado
            resultadosBusqueda.querySelectorAll('.search-result-item:not(.search-result-empty)').forEach(item => {
                item.addEventListener('click', (e) => {
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
        window.location.href = `${rutaBase}${idioma}/busqueda.html?q=${encodeURIComponent(consulta)}`;
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

    // Crear objeto de fecha actual
    const now = new Date();

    // --- Obtener las partes en español con el formato solicitado ---

    // 1. Día de la Semana (en letras)
    const dayOfWeek = now.toLocaleDateString('es-ES', { weekday: 'long' }); // Ej: "lunes"

    // 2. Hora (formato 24h, incluyendo minutos)
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // 3. Mes (en letras)
    const month = now.toLocaleDateString('es-ES', { month: 'long' });

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