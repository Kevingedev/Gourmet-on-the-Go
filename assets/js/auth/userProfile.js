import { authService } from './authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = authService.getUser();
    const userLanguage = authService.getLanguage();
    
    if (!currentUser) {
        // Redirect to home if not logged in
        const redirectPath = userLanguage === 'EN' ? '../EN/index.html' : '../ES/index.html';
        window.location.href = redirectPath;
        return;
    }

    const texts = userLanguage === 'EN' ? {
        title: 'My Account',
        username: 'Username',
        email: 'Email',
        fullName: 'Full Name',
        role: 'Role',
        registrationDate: 'Registration Date',
        provider: 'Login Method',
        backHome: 'Back to Home'
    } : {
        title: 'Mi Perfil',
        username: 'Usuario',
        email: 'Correo',
        fullName: 'Nombre Completo',
        role: 'Rol',
        registrationDate: 'Fecha de Registro',
        provider: 'Método de Inicio',
        backHome: 'Volver al Inicio'
    };

    // Get avatar
    const avatar = authService.getAvatar();
    const hasPicture = currentUser.picture;

    // Build profile header
    const profileHeader = document.getElementById('profile-header');
    if (profileHeader) {
        profileHeader.innerHTML = `
            ${hasPicture 
                ? `<img src="${currentUser.picture}" alt="Avatar" class="profile-avatar" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`
                : `<div class="profile-avatar">${avatar}</div>`
            }
            <div class="profile-info">
                <h1>${currentUser.nombre_completo || currentUser.email}</h1>
                <p>${currentUser.email}</p>
                <p style="color: var(--color-primary); font-weight: 600;">${currentUser.rol || 'usuario'}</p>
            </div>
        `;
    }

    // Build profile details
    const profileDetails = document.getElementById('profile-details');
    if (profileDetails) {
        const roleText = currentUser.rol === 'administrador' 
            ? (userLanguage === 'EN' ? 'Administrator' : 'Administrador')
            : (userLanguage === 'EN' ? 'User' : 'Usuario');
        
        const providerText = currentUser.provider === 'google'
            ? (userLanguage === 'EN' ? 'Google Sign-In' : 'Inicio con Google')
            : (userLanguage === 'EN' ? 'Username/Password' : 'Usuario/Contraseña');

        profileDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">${texts.username}:</span>
                <span class="detail-value">${currentUser.username || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${texts.email}:</span>
                <span class="detail-value">${currentUser.email || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${texts.fullName}:</span>
                <span class="detail-value">${currentUser.nombre_completo || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${texts.role}:</span>
                <span class="detail-value">${roleText}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${texts.provider}:</span>
                <span class="detail-value">${providerText}</span>
            </div>
            ${currentUser.fecha_registro ? `
            <div class="detail-item">
                <span class="detail-label">${texts.registrationDate}:</span>
                <span class="detail-value">${currentUser.fecha_registro}</span>
            </div>
            ` : ''}
        `;
    }
});

