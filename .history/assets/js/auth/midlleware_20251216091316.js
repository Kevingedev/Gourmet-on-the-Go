import { authService } from './authService.js';

/**
 * Middleware para proteger páginas que requieren autenticación
 * Protege: perfil, favoritos y finalizar compra en todos los idiomas
 */
export function protectPage() {
    // Verificar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
        // Obtener la URL actual
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        
        // Detectar el idioma desde la URL
        let language = 'ES'; // Por defecto
        let currentPage = '';
        
        // Buscar el idioma en la URL (ES, EN, FR, EU)
        for (let i = 0; i < urlParts.length; i++) {
            if (urlParts[i] === 'ES' || urlParts[i] === 'EN' || urlParts[i] === 'FR' || urlParts[i] === 'EU') {
                language = urlParts[i];
                // El siguiente elemento debería ser el nombre de la página
                if (i + 1 < urlParts.length) {
                    currentPage = urlParts[i + 1].split('?')[0]; // Remover query params
                }
                break;
            }
        }
        
        // Si no encontramos el idioma en la URL, intentar desde localStorage
        if (language === 'ES' && !currentPage) {
            language = localStorage.getItem('userLanguage') || 'ES';
            // Intentar obtener el nombre de la página del final de la URL
            const lastPart = urlParts[urlParts.length - 1].split('?')[0];
            currentPage = lastPart;
        }
        
        // Mapeo de páginas protegidas a sus nombres de redirect
        const protectedPages = {
            // Español
            'perfil.html': { redirect: 'profile', loginPage: 'sesion.html' },
            'favoritos.html': { redirect: 'favoritos', loginPage: 'sesion.html' },
            'finalizar-compra.html': { redirect: 'finalizar-compra', loginPage: 'sesion.html' },
            
            // Inglés
            'profile.html': { redirect: 'profile', loginPage: 'session.html' },
            'favorites.html': { redirect: 'favorites', loginPage: 'session.html' },
            'checkout.html': { redirect: 'checkout', loginPage: 'session.html' },
            
            // Francés
            'profil.html': { redirect: 'profil', loginPage: 'connexion.html' },
            'favoris.html': { redirect: 'favoris', loginPage: 'connexion.html' },
            'commande.html': { redirect: 'commande', loginPage: 'connexion.html' },
            
            // Euskera
            'profila.html': { redirect: 'profila', loginPage: 'saioa.html' },
            'gogokoak.html': { redirect: 'gogokoak', loginPage: 'saioa.html' },
            'erosketa-bukatu.html': { redirect: 'erosketa-bukatu', loginPage: 'saioa.html' }
        };
        
        // Verificar si la página actual está protegida
        const pageInfo = protectedPages[currentPage];
        
        if (pageInfo) {
            // Calcular la ruta base para la redirección
            let basePath = '';
            
            // Verificar si estamos en una subcarpeta (catalogo, catalog, catalogue, katalogoa)
            const isInCatalog = urlParts.some(part => 
                part === 'catalogo' || part === 'catalog' || part === 'catalogue' || part === 'katalogoa'
            );
            
            if (isInCatalog) {
                basePath = '../../../';
            } else if (urlParts.some(part => part === 'ES' || part === 'EN' || part === 'FR' || part === 'EU')) {
                basePath = '../';
            } else {
                basePath = './';
            }
            
            // Construir la URL de redirección
            const redirectUrl = `${basePath}${language}/${pageInfo.loginPage}?redirect=${pageInfo.redirect}`;
            
            // Redirigir a la página de login
            window.location.href = redirectUrl;
            
            return false; // Indica que la página está protegida y se está redirigiendo
        }
    }
    
    return true; // Usuario autenticado o página no protegida
}

// Ejecutar automáticamente cuando se carga el script
if (typeof window !== 'undefined') {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectPage);
    } else {
        protectPage();
    }
}

