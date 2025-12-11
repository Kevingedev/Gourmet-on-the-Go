// Lista de páginas que realmente existen (español e inglés)
const paginasExistentes = {
    ES: [
        'contacto.html',
        'quienes-somos.html',
        'aviso-legal.html',
        'politica-privacidad.html',
        'politica-cookies.html',
        'pago.html',
        'envio.html',
        'condiciones-uso.html',
        'index.html',
        'busqueda.html',
        'carrito.html',
        'favoritos.html',
        'perfil.html',
        'producto-detalle.html',
        'productos.html',
        'sesion.html',
        
        '404/'
    ],
    EN: [
        'contact.html',
        'about-us.html',
        'legal-notice.html',
        'privacy-policy.html',
        'cookie-policy.html',
        'payment.html',
        'shipping.html',
        'terms-of-use.html',
        'index.html',
        'search.html',
        'cart.html',
        'favorites.html',
        'profile.html',
        'product-detail.html',
        'products.html',
        'session.html',
        '404/'
    ]
};

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

    // Mapeo de enlaces del footer según el idioma
    let footerLinksMap;
    if (userLanguage === 'ES') {
        footerLinksMap = {
            'Contacto': `${BASE_PATH}${userLanguage}/contacto.html`,
            'Quiénes Somos': `${BASE_PATH}${userLanguage}/quienes-somos.html`,
            'Aviso Legal': `${BASE_PATH}${userLanguage}/aviso-legal.html`,
            'Política de privacidad': `${BASE_PATH}${userLanguage}/politica-privacidad.html`,
            'Política de Cookies': `${BASE_PATH}${userLanguage}/politica-cookies.html`,
            'Pago': `${BASE_PATH}${userLanguage}/pago.html`,
            'Envío': `${BASE_PATH}${userLanguage}/envio.html`,
            'Condiciones de uso': `${BASE_PATH}${userLanguage}/condiciones-uso.html`
        };
    } else {
        footerLinksMap = {
            'Contact': `${BASE_PATH}${userLanguage}/contact.html`,
            'About Us': `${BASE_PATH}${userLanguage}/about-us.html`,
            'Legal Notice': `${BASE_PATH}${userLanguage}/legal-notice.html`,
            'Privacy Policy': `${BASE_PATH}${userLanguage}/privacy-policy.html`,
            'Cookie Policy': `${BASE_PATH}${userLanguage}/cookie-policy.html`,
            'Payment': `${BASE_PATH}${userLanguage}/payment.html`,
            'Shipping': `${BASE_PATH}${userLanguage}/shipping.html`,
            'Terms of Use': `${BASE_PATH}${userLanguage}/terms-of-use.html`
        };
    }

    // Textos del footer según el idioma
    const footerTexts = userLanguage === 'EN' ? {
        description: 'Online store for gourmet products and food at the best price.',
        phone: 'Phone',
        email: 'Email',
        hours: 'Hours',
        information: 'Information',
        stayUpdated: 'Stay Updated',
        newsletterText: 'Receive exclusive offers and news in your email.',
        emailPlaceholder: 'Your email address',
        subscribe: 'Subscribe',
        copyright: 'All rights reserved.',
        acceptedPayments: 'Accepted Payment Methods',
        subscribeSuccess: 'Thank you for subscribing!'
    } : {
        description: 'Tienda online de productos gourmet y alimentación al mejor precio.',
        phone: 'Teléfono',
        email: 'Email',
        hours: 'Horario',
        information: 'Información',
        stayUpdated: 'Mantente al día',
        newsletterText: 'Recibe ofertas exclusivas y novedades en tu correo.',
        emailPlaceholder: 'Tu correo electrónico',
        subscribe: 'Suscribirme',
        copyright: 'Todos los derechos reservados.',
        acceptedPayments: 'Métodos de Pago Aceptados',
        subscribeSuccess: '¡Gracias por suscribirte!'
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
                    ${footerTexts.description}
                </p>
                <ul class="footer-contact">
                    <li><span>${footerTexts.phone}:</span> +34 600 000 000</li>
                    <li><span>${footerTexts.email}:</span> info@gourmetonthego.com</li>
                    <li><span>${footerTexts.hours}:</span> L–V 9:00–19:00</li>
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
                <h4 class="footer-heading">${footerTexts.information}</h4>
                <ul class="footer-links">
                    ${userLanguage === 'EN' 
                        ? `
                        <li><a href="${footerLinksMap['Contact']}" data-link="Contact">Contact</a></li>
                        <li><a href="${footerLinksMap['About Us']}" data-link="About Us">About Us</a></li>
                        <li><a href="${footerLinksMap['Legal Notice']}" data-link="Legal Notice">Legal Notice</a></li>
                        <li><a href="${footerLinksMap['Privacy Policy']}" data-link="Privacy Policy">Privacy Policy</a></li>
                        <li><a href="${footerLinksMap['Cookie Policy']}" data-link="Cookie Policy">Cookie Policy</a></li>
                        <li><a href="${footerLinksMap['Payment']}" data-link="Payment">Payment</a></li>
                        <li><a href="${footerLinksMap['Shipping']}" data-link="Shipping">Shipping</a></li>
                        <li><a href="${footerLinksMap['Terms of Use']}" data-link="Terms of Use">Terms of Use</a></li>
                        `
                        : `
                        <li><a href="${footerLinksMap['Contacto']}" data-link="Contacto">Contacto</a></li>
                        <li><a href="${footerLinksMap['Quiénes Somos']}" data-link="Quiénes Somos">Quiénes Somos</a></li>
                        <li><a href="${footerLinksMap['Aviso Legal']}" data-link="Aviso Legal">Aviso Legal</a></li>
                        <li><a href="${footerLinksMap['Política de privacidad']}" data-link="Política de privacidad">Política de privacidad</a></li>
                        <li><a href="${footerLinksMap['Política de Cookies']}" data-link="Política de Cookies">Política de Cookies</a></li>
                        <li><a href="${footerLinksMap['Pago']}" data-link="Pago">Pago</a></li>
                        <li><a href="${footerLinksMap['Envío']}" data-link="Envío">Envío</a></li>
                        <li><a href="${footerLinksMap['Condiciones de uso']}" data-link="Condiciones de uso">Condiciones de uso</a></li>
                        `
                    }
                </ul>
            </div>

            <!-- Columna 3: newsletter / extra -->
            <div class="footer-col">
                <h4 class="footer-heading">${footerTexts.stayUpdated}</h4>
                <p class="footer-text">
                    ${footerTexts.newsletterText}
                </p>
                <form class="footer-newsletter" id="footer-newsletter-form">
                    <input type="email" class="footer-input" id="footer-newsletter-email" placeholder="${footerTexts.emailPlaceholder}"
                        aria-label="${footerTexts.emailPlaceholder}" required>
                    <button type="submit" class="footer-btn">
                        ${footerTexts.subscribe}
                    </button>
                    <div class="footer-newsletter-message" id="footer-newsletter-message"></div>
                </form>
                
                <!-- Payment Methods -->
                <div class="footer-payment-methods">
                    <h5 class="footer-payment-title">${footerTexts.acceptedPayments}</h5>
                    <div class="footer-payment-icons">
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg" alt="Visa" class="payment-icon" title="Visa" onerror="this.style.display='none'">
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg" alt="Mastercard" class="payment-icon" title="Mastercard" onerror="this.style.display='none'">
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg" alt="PayPal" class="payment-icon" title="PayPal" onerror="this.style.display='none'">
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg" alt="American Express" class="payment-icon" title="American Express" onerror="this.style.display='none'">
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="footer-copy">
                &copy; 2025 Gourmet on the Go. ${footerTexts.copyright}
            </p>
        </div>
    </div>
    `;
    footer.innerHTML = footerContent;

    // Initialize newsletter subscription
    inicializarNewsletter();

    // Verificar enlaces y redirigir a 404 si no existen
    inicializarVerificacionEnlaces();
});

function inicializarNewsletter() {
    const newsletterForm = document.getElementById('footer-newsletter-form');
    const emailInput = document.getElementById('footer-newsletter-email');
    const messageDiv = document.getElementById('footer-newsletter-message');
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    
    if (!newsletterForm || !emailInput || !messageDiv) return;
    
    const successMessage = userLanguage === 'EN' 
        ? 'Thank you for subscribing!'
        : '¡Gracias por suscribirte!';
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            return;
        }
        
        // Show success message
        messageDiv.textContent = successMessage;
        messageDiv.classList.add('show');
        
        // Clear input
        emailInput.value = '';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 300);
        }, 5000);
    });
}

async function verificarPaginaExiste(url) {
    // Extraer el nombre del archivo de la URL
    const nombreArchivo = url.split('/').pop();
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    
    // Verificar si está en la lista de páginas existentes según el idioma
    const listaPaginas = paginasExistentes[userLanguage] || paginasExistentes.ES;
    if (listaPaginas.includes(nombreArchivo)) {
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
            const userLanguage = localStorage.getItem('userLanguage') || 'ES';
            const listaPaginas = paginasExistentes[userLanguage] || paginasExistentes.ES;
            
            // Verificar si la página existe
            if (listaPaginas.includes(nombreArchivo)) {
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