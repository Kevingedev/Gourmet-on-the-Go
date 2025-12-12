// Lista de páginas que realmente existen (español, inglés, francés y euskera)
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
    ],
    FR: [
        'contact.html',
        'a-propos.html',
        'avis-legal.html',
        'politique-confidentialite.html',
        'politique-cookies.html',
        'paiement.html',
        'livraison.html',
        'conditions-utilisation.html',
        'index.html',
        'recherche.html',
        'panier.html',
        'favoris.html',
        'profil.html',
        'detail-produit.html',
        'produits.html',
        'connexion.html',
        'commande.html',
        '404/'
    ],
    EU: [
        'kontaktua.html',
        'guri-buruz.html',
        'lege-oharra.html',
        'pribatutasun-politika.html',
        'cookie-politika.html',
        'ordainketa.html',
        'bidalketa.html',
        'erabilera-baldintzak.html',
        'index.html',
        'bilaketa.html',
        'saskia.html',
        'gogokoak.html',
        'profila.html',
        'produktu-xehetasuna.html',
        'produktuak.html',
        'saioa.html',
        'erosketa-bukatu.html',
        '404/'
    ]
};

function obtenerRutaBase() {
    const pathname = window.location.pathname;
    
    // Si estamos en /ES/404/, /EN/404/, /FR/404/, o /EU/404/
    if (pathname.includes('/404/')) {
        return './';
    }
    
    // Si estamos en catálogos (ES, EN, FR, EU)
    if (pathname.includes('/catalogo/') || pathname.includes('/catalog/') || 
        pathname.includes('/catalogue/') || pathname.includes('/katalogoa/')) {
        return '../../../';
    }
    
    // Si estamos en /ES/, /EN/, /FR/, o /EU/ (páginas principales)
    if (pathname.includes('/ES/') || pathname.includes('/EN/') || 
        pathname.includes('/FR/') || pathname.includes('/EU/')) {
        return '../';
    }
    
    // Por defecto
    return '../';
}

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const pathname = window.location.pathname;
    
    // Calcular PATH basado en la ubicación actual
    let PATH;
    if (pathname.includes('/catalogo/') || pathname.includes('/catalog/') || 
        pathname.includes('/catalogue/') || pathname.includes('/katalogoa/')) {
        PATH = '../../../';
    } else if (pathname.includes('/404/')) {
        PATH = '../../../';
    } else if (pathname.includes('/ES/') || pathname.includes('/EN/') || 
               pathname.includes('/FR/') || pathname.includes('/EU/')) {
        PATH = '../';
    } else {
        PATH = '../';
    }
    
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const BASE_PATH = obtenerRutaBase();

    // Mapeo de enlaces del footer según el idioma
    const footerLinksMaps = {
        ES: {
            'Contacto': `${BASE_PATH}ES/contacto.html`,
            'Quiénes Somos': `${BASE_PATH}ES/quienes-somos.html`,
            'Aviso Legal': `${BASE_PATH}ES/aviso-legal.html`,
            'Política de privacidad': `${BASE_PATH}ES/politica-privacidad.html`,
            'Política de Cookies': `${BASE_PATH}ES/politica-cookies.html`,
            'Pago': `${BASE_PATH}ES/pago.html`,
            'Envío': `${BASE_PATH}ES/envio.html`,
            'Condiciones de uso': `${BASE_PATH}ES/condiciones-uso.html`
        },
        EN: {
            'Contact': `${BASE_PATH}EN/contact.html`,
            'About Us': `${BASE_PATH}EN/about-us.html`,
            'Legal Notice': `${BASE_PATH}EN/legal-notice.html`,
            'Privacy Policy': `${BASE_PATH}EN/privacy-policy.html`,
            'Cookie Policy': `${BASE_PATH}EN/cookie-policy.html`,
            'Payment': `${BASE_PATH}EN/payment.html`,
            'Shipping': `${BASE_PATH}EN/shipping.html`,
            'Terms of Use': `${BASE_PATH}EN/terms-of-use.html`
        },
        FR: {
            'Contact': `${BASE_PATH}FR/contact.html`,
            'À propos': `${BASE_PATH}FR/a-propos.html`,
            'Avis légal': `${BASE_PATH}FR/avis-legal.html`,
            'Politique de confidentialité': `${BASE_PATH}FR/politique-confidentialite.html`,
            'Politique des cookies': `${BASE_PATH}FR/politique-cookies.html`,
            'Paiement': `${BASE_PATH}FR/paiement.html`,
            'Livraison': `${BASE_PATH}FR/livraison.html`,
            'Conditions d\'utilisation': `${BASE_PATH}FR/conditions-utilisation.html`
        },
        EU: {
            'Kontaktua': `${BASE_PATH}EU/kontaktua.html`,
            'Guri buruz': `${BASE_PATH}EU/guri-buruz.html`,
            'Lege oharra': `${BASE_PATH}EU/lege-oharra.html`,
            'Pribatutasun politika': `${BASE_PATH}EU/pribatutasun-politika.html`,
            'Cookie politika': `${BASE_PATH}EU/cookie-politika.html`,
            'Ordainketa': `${BASE_PATH}EU/ordainketa.html`,
            'Bidalketa': `${BASE_PATH}EU/bidalketa.html`,
            'Erabilera baldintzak': `${BASE_PATH}EU/erabilera-baldintzak.html`
        }
    };
    const footerLinksMap = footerLinksMaps[userLanguage] || footerLinksMaps.ES;

    // Textos del footer según el idioma
    const footerTexts = {
        ES: {
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
        },
        EN: {
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
        },
        FR: {
            description: 'Boutique en ligne de produits gastronomiques et alimentaires au meilleur prix.',
            phone: 'Téléphone',
            email: 'Email',
            hours: 'Heures',
            information: 'Information',
            stayUpdated: 'Restez informé',
            newsletterText: 'Recevez des offres exclusives et des nouvelles dans votre email.',
            emailPlaceholder: 'Votre adresse email',
            subscribe: 'S\'abonner',
            copyright: 'Tous droits réservés.',
            acceptedPayments: 'Moyens de Paiement Acceptés',
            subscribeSuccess: 'Merci de vous être abonné!'
        },
        EU: {
            description: 'Produktu gourmet eta elikagaiak prezio onenean saltzen dituen online denda.',
            phone: 'Telefonoa',
            email: 'Email',
            hours: 'Ordutegia',
            information: 'Informazioa',
            stayUpdated: 'Eguneratuta egon',
            newsletterText: 'Jaso eskaintza esklusiboak eta berriak zure postan.',
            emailPlaceholder: 'Zure helbide elektronikoa',
            subscribe: 'Harpidetu',
            copyright: 'Eskubide guztiak erreserbatuak.',
            acceptedPayments: 'Onartutako Ordainketa Metodoak',
            subscribeSuccess: 'Eskerrik asko harpidetzeagatik!'
        }
    };
    
    const currentFooterTexts = footerTexts[userLanguage] || footerTexts.ES;

    const footer = document.getElementById('footer');
    const footerContent = `
    <div class="site-footer">
        <div class="footer-inner">
            <!-- Columna 1: Branding y contacto -->
            <div class="footer-col">
                <div class="logo-and-text">
                    <img src="${BASE_PATH}assets/img/gourmet-logo-icon.png" alt="Logo" width="35">
                    <h3 class="footer-logo">Gourmet on the Go</h3>
                </div>
                <p class="footer-text">
                    ${currentFooterTexts.description}
                </p>
                <ul class="footer-contact">
                    <li><span>${currentFooterTexts.phone}:</span> +34 600 000 000</li>
                    <li><span>${currentFooterTexts.email}:</span> info@gourmetonthego.com</li>
                    <li><span>${currentFooterTexts.hours}:</span> L–V 9:00–19:00</li>
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
                <h4 class="footer-heading">${currentFooterTexts.information}</h4>
                <ul class="footer-links">
                    ${userLanguage === 'ES' 
                        ? `
                        <li><a href="${footerLinksMap['Contacto']}" data-link="Contacto">Contacto</a></li>
                        <li><a href="${footerLinksMap['Quiénes Somos']}" data-link="Quiénes Somos">Quiénes Somos</a></li>
                        <li><a href="${footerLinksMap['Aviso Legal']}" data-link="Aviso Legal">Aviso Legal</a></li>
                        <li><a href="${footerLinksMap['Política de privacidad']}" data-link="Política de privacidad">Política de privacidad</a></li>
                        <li><a href="${footerLinksMap['Política de Cookies']}" data-link="Política de Cookies">Política de Cookies</a></li>
                        <li><a href="${footerLinksMap['Pago']}" data-link="Pago">Pago</a></li>
                        <li><a href="${footerLinksMap['Envío']}" data-link="Envío">Envío</a></li>
                        <li><a href="${footerLinksMap['Condiciones de uso']}" data-link="Condiciones de uso">Condiciones de uso</a></li>
                        `
                        : userLanguage === 'EN'
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
                        : userLanguage === 'FR'
                        ? `
                        <li><a href="${footerLinksMap['Contact']}" data-link="Contact">Contact</a></li>
                        <li><a href="${footerLinksMap['À propos']}" data-link="À propos">À propos</a></li>
                        <li><a href="${footerLinksMap['Avis légal']}" data-link="Avis légal">Avis légal</a></li>
                        <li><a href="${footerLinksMap['Politique de confidentialité']}" data-link="Politique de confidentialité">Politique de confidentialité</a></li>
                        <li><a href="${footerLinksMap['Politique des cookies']}" data-link="Politique des cookies">Politique des cookies</a></li>
                        <li><a href="${footerLinksMap['Paiement']}" data-link="Paiement">Paiement</a></li>
                        <li><a href="${footerLinksMap['Livraison']}" data-link="Livraison">Livraison</a></li>
                        <li><a href="${footerLinksMap['Conditions d\'utilisation']}" data-link="Conditions d'utilisation">Conditions d'utilisation</a></li>
                        `
                        : `
                        <li><a href="${footerLinksMap['Kontaktua']}" data-link="Kontaktua">Kontaktua</a></li>
                        <li><a href="${footerLinksMap['Guri buruz']}" data-link="Guri buruz">Guri buruz</a></li>
                        <li><a href="${footerLinksMap['Lege oharra']}" data-link="Lege oharra">Lege oharra</a></li>
                        <li><a href="${footerLinksMap['Pribatutasun politika']}" data-link="Pribatutasun politika">Pribatutasun politika</a></li>
                        <li><a href="${footerLinksMap['Cookie politika']}" data-link="Cookie politika">Cookie politika</a></li>
                        <li><a href="${footerLinksMap['Ordainketa']}" data-link="Ordainketa">Ordainketa</a></li>
                        <li><a href="${footerLinksMap['Bidalketa']}" data-link="Bidalketa">Bidalketa</a></li>
                        <li><a href="${footerLinksMap['Erabilera baldintzak']}" data-link="Erabilera baldintzak">Erabilera baldintzak</a></li>
                        `
                    }
                </ul>
            </div>

            <!-- Columna 3: newsletter / extra -->
            <div class="footer-col">
                <h4 class="footer-heading">${currentFooterTexts.stayUpdated}</h4>
                <p class="footer-text">
                    ${currentFooterTexts.newsletterText}
                </p>
                <form class="footer-newsletter" id="footer-newsletter-form">
                    <input type="email" class="footer-input" id="footer-newsletter-email" placeholder="${currentFooterTexts.emailPlaceholder}"
                        aria-label="${currentFooterTexts.emailPlaceholder}" required>
                    <button type="submit" class="footer-btn">
                        ${currentFooterTexts.subscribe}
                    </button>
                    <div class="footer-newsletter-message" id="footer-newsletter-message"></div>
                </form>
                
                <!-- Payment Methods -->
                <div class="footer-payment-methods">
                    <h5 class="footer-payment-title">${currentFooterTexts.acceptedPayments}</h5>
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
                &copy; 2025 Gourmet on the Go. ${currentFooterTexts.copyright}
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
    
    const successMessages = {
        ES: '¡Gracias por suscribirte!',
        EN: 'Thank you for subscribing!',
        FR: 'Merci de vous être abonné!',
        EU: 'Eskerrik asko harpidetzeagatik!'
    };
    const successMessage = successMessages[userLanguage] || successMessages.ES;
    
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