// Lista de páginas que realmente existen
const paginasExistentes = [
    'contacto.html',
    'index.html',
    'busqueda.html',
    'carrito.html',
    'lista-deseos.html',
    'perfil.html',
    'producto-detalle.html',
    'productos.html',
    'sesion.html'
];

function obtenerRutaBase() {
    const pathname = window.location.pathname;
    
    // Si estamos en /ES/404/ o /EN/404/
    if (pathname.includes('/404/')) {
        return './';
    }
    
    // Si estamos en /ES/catalogo/... o /EN/catalog/...
    if (pathname.includes('/catalogo/') || pathname.includes('/catalog/')) {
        return '../../../';
    }
    
    // Si estamos en /ES/ o /EN/ (páginas principales)
    if (pathname.includes('/ES/') || pathname.includes('/EN/')) {
        return '../';
    }
    
    // Por defecto
    return '../';
}

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const PATH = urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' ? '../../../' : '../../';
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const BASE_PATH = obtenerRutaBase();

    // Mapeo de enlaces del footer
    const footerLinksMap = {
        'Contacto': `${BASE_PATH}${userLanguage}/contacto.html`,
        'Quiénes Somos': `${BASE_PATH}${userLanguage}/quienes-somos.html`,
        'Aviso Legal': `${BASE_PATH}${userLanguage}/aviso-legal.html`,
        'Política de privacidad': `${BASE_PATH}${userLanguage}/politica-privacidad.html`,
        'Política de Cookies': `${BASE_PATH}${userLanguage}/politica-cookies.html`,
        'Pago': `${BASE_PATH}${userLanguage}/pago.html`,
        'Envío': `${BASE_PATH}${userLanguage}/envio.html`,
        'Condiciones de uso': `${BASE_PATH}${userLanguage}/condiciones-uso.html`
    };

    const footer = document.getElementById('footer');
    const footerContent = `
    <div class="site-footer">
        <div class="footer-inner">
            <!-- Columna 1: Branding y contacto -->
            <div class="footer-col">
                <div class="logo-and-text">
                    <img src="${PATH}assets/img/gourmet-logo-icon.png" alt="Logo" width="35">
                    <h3 class="footer-logo">Gourmet on the Go</h3>
                </div>
                <p class="footer-text">
                    Tienda online de productos gourmet y alimentación al mejor precio.
                </p>
                <ul class="footer-contact">
                    <li><span>Teléfono:</span> +34 600 000 000</li>
                    <li><span>Email:</span> info@gourmetonthego.com</li>
                    <li><span>Horario:</span> L–V 9:00–19:00</li>
                </ul>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook" class="footer-social-link">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#" aria-label="Tiktok" class="footer-social-link">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="#" aria-label="Instagram" class="footer-social-link">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                </div>
            </div>

            <!-- Columna 2: enlaces legales / info -->
            <div class="footer-col">
                <h4 class="footer-heading">Información</h4>
                <ul class="footer-links">
                    <li><a href="${footerLinksMap['Contacto']}" data-link="Contacto">Contacto</a></li>
                    <li><a href="${footerLinksMap['Quiénes Somos']}" data-link="Quiénes Somos">Quiénes Somos</a></li>
                    <li><a href="${footerLinksMap['Aviso Legal']}" data-link="Aviso Legal">Aviso Legal</a></li>
                    <li><a href="${footerLinksMap['Política de privacidad']}" data-link="Política de privacidad">Política de privacidad</a></li>
                    <li><a href="${footerLinksMap['Política de Cookies']}" data-link="Política de Cookies">Política de Cookies</a></li>
                    <li><a href="${footerLinksMap['Pago']}" data-link="Pago">Pago</a></li>
                    <li><a href="${footerLinksMap['Envío']}" data-link="Envío">Envío</a></li>
                    <li><a href="${footerLinksMap['Condiciones de uso']}" data-link="Condiciones de uso">Condiciones de uso</a></li>
                </ul>
            </div>

            <!-- Columna 3: newsletter / extra -->
            <div class="footer-col">
                <h4 class="footer-heading">Mantente al día</h4>
                <p class="footer-text">
                    Recibe ofertas exclusivas y novedades en tu correo.
                </p>
                <form class="footer-newsletter">
                    <input type="email" class="footer-input" placeholder="Tu correo electrónico"
                        aria-label="Correo electrónico">
                    <button type="submit" class="footer-btn">
                        Suscribirme
                    </button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="footer-copy">
                &copy; 2025 Gourmet on the Go. Todos los derechos reservados.
            </p>
        </div>
    </div>
    `;
    footer.innerHTML = footerContent;

    // Verificar enlaces y redirigir a 404 si no existen
    inicializarVerificacionEnlaces();
});

async function verificarPaginaExiste(url) {
    // Extraer el nombre del archivo de la URL
    const nombreArchivo = url.split('/').pop();
    
    // Verificar si está en la lista de páginas existentes
    if (paginasExistentes.includes(nombreArchivo)) {
        return true;
    }
    
    // Si no está en la lista, la página no existe
    return false;
}

function redirigirA404() {
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const BASE_PATH = obtenerRutaBase();
    // Si ya estamos en 404, no redirigir de nuevo
    if (window.location.pathname.includes('/404/')) {
        return;
    }
    window.location.href = `${BASE_PATH}${userLanguage}/404/`;
}

function inicializarVerificacionEnlaces() {
    const enlacesFooter = document.querySelectorAll('.footer-links a[data-link]');
    
    enlacesFooter.forEach(enlace => {
        enlace.addEventListener('click', async (e) => {
            e.preventDefault();
            const urlOriginal = enlace.getAttribute('href');
            
            // Si es un enlace externo o vacío, no verificar
            if (!urlOriginal || urlOriginal.startsWith('http') || urlOriginal === '#' || urlOriginal.startsWith('mailto:') || urlOriginal.startsWith('tel:')) {
                return;
            }

            // Extraer el nombre del archivo
            const nombreArchivo = urlOriginal.split('/').pop();
            
            // Verificar si la página existe
            if (paginasExistentes.includes(nombreArchivo)) {
                // La página existe, navegar normalmente
                window.location.href = urlOriginal;
            } else {
                // La página no existe, redirigir a 404
                redirigirA404();
            }
        });
    });
}

// Interceptar clicks en enlaces internos HTML del sitio
document.addEventListener('click', async (e) => {
    const enlace = e.target.closest('a[href]');
    if (!enlace) return;

    const url = enlace.getAttribute('href');
    const esEnlaceFooter = enlace.closest('.footer-links') !== null;
    
    // Ignorar enlaces que ya tienen manejo específico o son especiales
    if (!url || 
        url.startsWith('http') || 
        url === '#' || 
        url.startsWith('mailto:') || 
        url.startsWith('tel:') ||
        url.startsWith('javascript:') ||
        enlace.classList.contains('footer-social-link') ||
        enlace.hasAttribute('data-modal-open') ||
        enlace.target === '_blank') {
        return;
    }

    // Verificar solo enlaces HTML internos (no del footer, esos ya se manejan arriba)
    if (!esEnlaceFooter && url.endsWith('.html') && !url.startsWith('http') && url.startsWith('../')) {
        e.preventDefault();
        
        try {
            const existe = await verificarPaginaExiste(url);
            if (existe) {
                window.location.href = url;
            } else {
                redirigirA404();
            }
        } catch (error) {
            console.error('Error al verificar página:', error);
            redirigirA404();
        }
    }
});