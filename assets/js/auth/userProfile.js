import { authService } from './authService.js';

// User Profile Display Functions
document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
        return;
    }
    
    // Texts for different languages
    const texts = {
        ES: {
            username: 'Usuario',
            email: 'Correo electrónico',
            fullName: 'Nombre completo',
            role: 'Rol',
            registrationDate: 'Fecha de registro',
            provider: 'Método de inicio de sesión'
        },
        EN: {
            username: 'Username',
            email: 'Email',
            fullName: 'Full name',
            role: 'Role',
            registrationDate: 'Registration date',
            provider: 'Sign-in method'
        },
        FR: {
            username: 'Nom d\'utilisateur',
            email: 'Email',
            fullName: 'Nom complet',
            role: 'Rôle',
            registrationDate: 'Date d\'enregistrement',
            provider: 'Méthode de connexion'
        },
        EU: {
            username: 'Erabiltzaile izena',
            email: 'Email',
            fullName: 'Izen osoa',
            role: 'Rola',
            registrationDate: 'Erregistro data',
            provider: 'Saioa hasteko metodoa'
        }
    };
    
    const currentTexts = texts[userLanguage] || texts.ES;
    
    // Update profile display
    const profileDetails = document.getElementById('profile-details');
    if (profileDetails) {
        // Get role directly from user (from users.json)
        const userRole = currentUser.rol || currentUser.role || 'usuario';
        
        const providerText = currentUser.provider === 'google'
            ? (userLanguage === 'EN' ? 'Google Sign-In' : 'Inicio con Google')
            : (userLanguage === 'EN' ? 'Username/Password' : 'Usuario/Contraseña');

        profileDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">${currentTexts.username}:</span>
                <span class="detail-value">${currentUser.username || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.email}:</span>
                <span class="detail-value">${currentUser.email || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.fullName}:</span>
                <span class="detail-value">${currentUser.nombre_completo || currentUser.fullName || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.role}:</span>
                <span class="detail-value">${userRole}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.registrationDate}:</span>
                <span class="detail-value">${currentUser.fecha_registro || currentUser.registrationDate || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.provider}:</span>
                <span class="detail-value">${providerText}</span>
            </div>
        `;
    }
    
    // Update profile picture if available
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture && currentUser.picture) {
        profilePicture.src = currentUser.picture;
        profilePicture.style.display = 'block';
    }
    
    // Update username display in nav
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username || currentUser.nombre_completo || currentUser.fullName || 'Usuario';
    }
});
