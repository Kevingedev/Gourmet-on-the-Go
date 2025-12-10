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
            // Create user object similar to users.json structure
            const googleUser = {
                id: this.generateUserId(),
                username: payload.email.split('@')[0], // Use email prefix as username
                password: null, // No password for Google users
                rol: 'usuario', // Default role
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
                loginMessage.textContent = 'Iniciando sesión...';
                loginMessageBox.style.color = 'green';
                loginMessageBox.style.borderColor = 'green';
                loginMessageBox.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';
            }
            
            if (spinner) {
                spinner.classList.remove('oculto');
                spinner.classList.add('spinner-activo');
            }

            // Reload page after short delay
            setTimeout(() => {
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

