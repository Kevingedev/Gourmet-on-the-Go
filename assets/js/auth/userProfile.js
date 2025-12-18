import { authService } from './authService.js';

// User Profile Display Functions
document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const currentUser = authService.getUser();

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

    // Get role directly from user (from users.json)
    const userRole = currentUser.rol || currentUser.role || 'usuario';

    // Role translations
    const roleTranslations = {
        ES: {
            'usuario': 'Usuario',
            'admin': 'Administrador',
            'administrador': 'Administrador'
        },
        EN: {
            'usuario': 'User',
            'admin': 'Administrator',
            'administrador': 'Administrator'
        },
        FR: {
            'usuario': 'Utilisateur',
            'admin': 'Administrateur',
            'administrador': 'Administrateur'
        },
        EU: {
            'usuario': 'Erabiltzailea',
            'admin': 'Administratzailea',
            'administrador': 'Administratzailea'
        }
    };
    const roleText = roleTranslations[userLanguage]?.[userRole.toLowerCase()] || userRole;

    // Get user's full name
    const fullName = currentUser.nombre_completo || currentUser.fullName || currentUser.username || 'Usuario';

    // Get avatar (initials or picture)
    const avatar = authService.getAvatar();
    const hasPicture = currentUser.picture;

    // Update profile header with name, picture, and role
    const profileHeader = document.getElementById('profile-header');
    if (profileHeader) {
        profileHeader.innerHTML = `
            <div class="profile-avatar" id="profile-avatar">
                ${hasPicture
                ? `<img src="${currentUser.picture}" alt="${fullName}" id="profile-picture">`
                : `<span>${avatar}</span>`
            }
            </div>
            <div class="profile-info">
                <h1>${fullName}</h1>
                <p style="color: var(--color-primary); font-weight: 600; margin-top: 0.5rem;">${roleText}</p>
                <p style="color: var(--muted); margin-top: 0.25rem;">${currentUser.email || ''}</p>
            </div>
        `;
    }

    // Update profile display
    const profileDetails = document.getElementById('profile-details');
    if (profileDetails) { // Si el elemento profile-details existe en el DOM pinto todo el perfil.
        const providerText = currentUser.provider === 'google'
            ? (userLanguage === 'EN' ? 'Google Sign-In' : userLanguage === 'FR' ? 'Connexion Google' : userLanguage === 'EU' ? 'Google-rekin saioa' : 'Inicio con Google')
            : (userLanguage === 'EN' ? 'Username/Password' : userLanguage === 'FR' ? 'Nom d\'utilisateur/Mot de passe' : userLanguage === 'EU' ? 'Erabiltzaile izena/Pasahitza' : 'Usuario/Contraseña');

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
                <span class="detail-value">${fullName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${currentTexts.role}:</span>
                <span class="detail-value">${roleText}</span>
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
});
