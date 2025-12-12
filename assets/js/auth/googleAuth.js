import { authService } from './authService.js';

// Simple Google Login Service
export const googleAuth = {
    // Initialize Google Sign-In
    init() {
        // Wait for Google Identity Services to load
        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: '874722548600-ob5nqpav0u3plvu2sbruqivrkv4u71jb.apps.googleusercontent.com', // Replace with your actual Client ID
                callback: this.handleCredentialResponse.bind(this)
            });
        }
    },

    // Handle Google login response
    handleCredentialResponse(response) {
        // Decode the JWT token (simple way)
        const payload = this.decodeJWT(response.credential);
        
        if (payload) {
            const userLanguage = localStorage.getItem('userLanguage') || 'ES';
            const messages = userLanguage === 'EN' ? {
                signingIn: 'Signing in...'
            } : {
                signingIn: 'Iniciando sesión...'
            };

            // Create user object for normal users (Google login is for everyone)
            const googleUser = {
                id: this.generateUserId(),
                username: payload.email.split('@')[0], // Use email prefix as username
                password: null, // No password for Google users
                rol: 'usuario', // Normal user role
                nombre_completo: payload.name || payload.email,
                email: payload.email,
                edad: null,
                fecha_registro: new Date().toISOString().split('T')[0],
                provider: 'google', // Mark as Google user
                picture: payload.picture // Google profile picture
            };

            // Save to localStorage (same as regular login)
            authService.login(googleUser);
            
            // Show success message
            const loginMessage = document.getElementById('loginMessage');
            const loginMessageBox = document.getElementById('loginMessageBox');
            const spinner = document.getElementById('spinner');
            
            if (loginMessage) {
                loginMessage.textContent = messages.signingIn;
                loginMessageBox.style.color = 'green';
                loginMessageBox.style.borderColor = 'green';
                loginMessageBox.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';
            }
            
            if (spinner) {
                spinner.classList.remove('oculto');
                spinner.classList.add('spinner-activo');
            }

            // Redirect after login (check for redirect parameter)
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                if (redirect) {
                    // Map redirect names to actual page names
                    const redirectMaps = {
                        ES: {
                            'checkout': 'finalizar-compra.html',
                            'finalizar-compra': 'finalizar-compra.html'
                        },
                        EN: {
                            'checkout': 'checkout.html',
                            'finalizar-compra': 'checkout.html'
                        },
                        FR: {
                            'checkout': 'commande.html',
                            'finalizar-compra': 'commande.html',
                            'commande': 'commande.html'
                        },
                        EU: {
                            'checkout': 'erosketa-bukatu.html',
                            'finalizar-compra': 'erosketa-bukatu.html',
                            'erosketa-bukatu': 'erosketa-bukatu.html'
                        }
                    };
                    
                    const redirectMap = redirectMaps[userLanguage] || redirectMaps.ES;
                    const redirectPage = redirectMap[redirect];
                    
                    if (redirectPage) {
                        const url = window.location.href;
                        const urlCategoria = url.split('/');
                        let basePath = '';
                        
                        if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
                            basePath = '../../../';
                        } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN' || urlCategoria[3] == 'FR' || urlCategoria[3] == 'EU') {
                            basePath = '../';
                        } else {
                            basePath = './';
                        }
                        
                        window.location.href = `${basePath}${userLanguage}/${redirectPage}`;
                        return;
                    }
                }
                
                window.location.reload();
            }, 1000);
        }
    },

    // Simple JWT decoder (for basic use)
    decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        } 
    },

    // Generate a simple user ID
    generateUserId() {
        return Date.now(); // Simple timestamp-based ID
    },

    // Render Google Sign-In button
    renderButton(elementId) {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.renderButton(
                document.getElementById(elementId),
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    width: '100%',
                    locale: localStorage.getItem('userLanguage') || 'es'
                }
            );
        }
    },

    // Trigger Google Sign-In
    signIn() {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt();
        }
    }
};

