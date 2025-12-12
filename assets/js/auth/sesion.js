import { authService } from './authService.js';
import { googleAuth } from './googleAuth.js';

// Función para actualizar el modal de login cuando cambia el idioma
function updateLoginModal() {
    const showModal = document.getElementById('showModal');
    const loginModal = document.getElementById('loginModal');
    if (!showModal || !loginModal) return;
    
    const currentUser = authService.getUser();
    if (currentUser) return; // No actualizar si el usuario ya está logueado
    
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    const needsLoginForCheckout = redirect === 'checkout' || redirect === 'finalizar-compra' || redirect === 'commande' || redirect === 'erosketa-bukatu';
    
    const loginTextsMaps = {
        ES: {
            title: 'Inicia sesión',
            subtitle: needsLoginForCheckout 
                ? 'Necesitas iniciar sesión para completar tu compra. Por favor, accede con tu Usuario y Contraseña.'
                : 'Accede con tu Usuario y Contraseña.',
            username: 'Usuario',
            password: 'Contraseña',
            enter: 'Entrar',
            cancel: 'Cancelar',
            loginMessage: 'Inicia Sesión',
            or: 'o',
            continueWith: 'Continuar con',
            googleDescription: 'Inicia sesión con Google',
            close: 'Cerrar'
        },
        EN: {
            title: 'Sign in',
            subtitle: needsLoginForCheckout 
                ? 'You need to sign in to complete your purchase. Please sign in with your Username and Password.'
                : 'Sign in with your Username and Password, Only administrators can sign in.',
            username: 'Username',
            password: 'Password',
            enter: 'Enter',
            cancel: 'Cancel',
            loginMessage: 'Sign in',
            or: 'or',
            continueWith: 'Continue with',
            googleDescription: 'Sign in with Google',
            close: 'Close'
        },
        FR: {
            title: 'Se connecter',
            subtitle: needsLoginForCheckout 
                ? 'Vous devez vous connecter pour finaliser votre achat. Veuillez vous connecter avec votre nom d\'utilisateur et votre mot de passe.'
                : 'Connectez-vous avec votre nom d\'utilisateur et votre mot de passe.',
            username: 'Nom d\'utilisateur',
            password: 'Mot de passe',
            enter: 'Entrer',
            cancel: 'Annuler',
            loginMessage: 'Se connecter',
            or: 'ou',
            continueWith: 'Continuer avec',
            googleDescription: 'Se connecter avec Google',
            close: 'Fermer'
        },
        EU: {
            title: 'Saioa hasi',
            subtitle: needsLoginForCheckout 
                ? 'Erosketa bukatzeko saioa hasi behar duzu. Mesedez, sartu zure erabiltzaile izena eta pasahitza.'
                : 'Sartu zure erabiltzaile izena eta pasahitza.',
            username: 'Erabiltzaile izena',
            password: 'Pasahitza',
            enter: 'Sartu',
            cancel: 'Utzi',
            loginMessage: 'Saioa hasi',
            or: 'edo',
            continueWith: 'Jarraitu',
            googleDescription: 'Google-rekin saioa hasi',
            close: 'Itxi'
        }
    };
    const loginTexts = loginTextsMaps[userLanguage] || loginTextsMaps.ES;
    
    // Guardar el estado del modal (si está abierto)
    const isOpen = loginModal.classList.contains('is-open');
    const usernameValue = document.getElementById('username')?.value || '';
    
    // Actualizar el contenido del modal
    const modalDialog = loginModal.querySelector('.modal__dialog');
    if (modalDialog) {
        modalDialog.querySelector('#login-title').textContent = loginTexts.title;
        modalDialog.querySelector('#login-desc').textContent = loginTexts.subtitle;
        modalDialog.querySelector('.field__label').textContent = loginTexts.username;
        modalDialog.querySelectorAll('.field__label')[1].textContent = loginTexts.password;
        modalDialog.querySelector('#btn-enter').textContent = loginTexts.enter;
        modalDialog.querySelector('.btn--ghost').textContent = loginTexts.cancel;
        modalDialog.querySelector('#loginMessage').textContent = loginTexts.loginMessage + ' ';
        modalDialog.querySelector('.login-divider span').textContent = loginTexts.or;
        modalDialog.querySelector('.google-signin-description').textContent = loginTexts.googleDescription;
        modalDialog.querySelector('.modal__close').setAttribute('aria-label', loginTexts.close);
        
        // Restaurar el valor del username si había uno
        const usernameInput = document.getElementById('username');
        if (usernameInput && usernameValue) {
            usernameInput.value = usernameValue;
        }
    }
    
    // Restaurar el estado del modal
    if (isOpen) {
        loginModal.classList.add('is-open');
        loginModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

// Account menu translations
const accountMenuTexts = {
    ES: {
        title: 'Mi cuenta',
        viewAccount: 'Ver mi cuenta',
        favorites: 'Mis favoritos',
        logout: 'Cerrar sesión',
        closePanel: 'Cerrar panel',
        confirmLogout: 'Cerrar sesión',
        confirmLogoutText: '¿Seguro que quieres cerrar sesión?',
        yesLogout: 'Sí, cerrar sesión',
        cancel: 'Cancelar',
        closeWindow: 'Cerrar ventana',
        profilePage: 'perfil.html',
        favoritesPage: 'favoritos.html'
    },
    EN: {
        title: 'My Account',
        viewAccount: 'View my account',
        favorites: 'My Favorites',
        logout: 'Log Out',
        closePanel: 'Close panel',
        confirmLogout: 'Log Out',
        confirmLogoutText: 'Are you sure you want to log out?',
        yesLogout: 'Yes, log out',
        cancel: 'Cancel',
        closeWindow: 'Close window',
        profilePage: 'profile.html',
        favoritesPage: 'favorites.html'
    },
    FR: {
        title: 'Mon Compte',
        viewAccount: 'Voir mon compte',
        favorites: 'Mes Favoris',
        logout: 'Déconnexion',
        closePanel: 'Fermer le panneau',
        confirmLogout: 'Déconnexion',
        confirmLogoutText: 'Êtes-vous sûr de vouloir vous déconnecter?',
        yesLogout: 'Oui, se déconnecter',
        cancel: 'Annuler',
        closeWindow: 'Fermer la fenêtre',
        profilePage: 'profil.html',
        favoritesPage: 'favoris.html'
    },
    EU: {
        title: 'Nire Kontua',
        viewAccount: 'Ikusi nire kontua',
        favorites: 'Nire Gogokoak',
        logout: 'Saioa Itxi',
        closePanel: 'Panela itxi',
        confirmLogout: 'Saioa Itxi',
        confirmLogoutText: 'Ziur zaude saioa itxi nahi duzula?',
        yesLogout: 'Bai, saioa itxi',
        cancel: 'Ezeztatu',
        closeWindow: 'Leihoa itxi',
        profilePage: 'profila.html',
        favoritesPage: 'gogokoak.html'
    }
};

// Function to get account menu texts
function getAccountMenuTexts(language) {
    return accountMenuTexts[language] || accountMenuTexts.ES;
}

// Function to setup logout modal functionality
function setupLogoutModal() {
    const newModal = document.querySelector('#logout-modal');
    if (newModal) {
        newModal.classList.add('is-open');
        newModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Enfocar primer elemento focusable
        const focusables = newModal.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusables.length) focusables[0].focus();
    }
    
    // Listener for confirm logout button
    const confirmLogoutBtn = document.getElementById('confirm-logout-final');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            const spinner = document.getElementById('spinner');
            if (spinner) {
                spinner.classList.remove('oculto');
                spinner.classList.add('spinner-activo');
            }
            confirmLogoutBtn.disabled = true;
            
            setTimeout(() => {
                authService.logout();
                window.location.reload();
            }, 2000);
        });
    }
}

// Function to render account menu
function renderAccountMenu() {
    const showModal = document.getElementById('showModal');
    if (!showModal) return;
    
    const currentUser = authService.getUser();
    if (!currentUser) return;
    
    const url = window.location.href;
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const PATH = url.includes('catalogo') || url.includes('catalog') || url.includes('catalogue') || url.includes('katalogoa') ? '../../' : '../'+userLanguage+'/';
    const texts = getAccountMenuTexts(userLanguage);
    
    showModal.innerHTML = `
        <div
            id="logoutModal"
            class="modal modal-logout modal-logout-drawer"
            aria-hidden="true"
            role="dialog"
            aria-labelledby="account-modal-title"
            >
            <!-- Fondo oscuro (click para cerrar) -->
            <div class="modal-logout-backdrop" data-modal-close></div>

            <!-- Panel que entra desde la derecha -->
            <aside class="modal-logout-panel">
                <header class="modal-logout-header">
                <h2 id="account-modal-logout-title">${texts.title}</h2>
                <button
                    class="modal-logout-close"
                    type="button"
                    aria-label="${texts.closePanel}"
                    data-modal-close
                >
                    ✕
                </button>
                </header>

                <div class="modal-logout-body">
                <div class="user-summary">
                    ${currentUser.picture 
                        ? `<img src="${currentUser.picture}" alt="Avatar" class="user-avatar user-avatar-img" style="width: 40px; height: 40px; border-radius: 999px; object-fit: cover;">`
                        : `<div class="user-avatar">${authService.getAvatar()}</div>`
                    }
                    <div class="user-info">
                    <p class="user-name">${currentUser.nombre_completo}</p>
                    <p class="user-email">${currentUser.email}</p>
                    </div>
                    
                </div>

                <nav class="account-menu">  
                    <a href="${PATH}${texts.profilePage}" class="links-sesion account-item"><span> <i class="fa-regular fa-user icon-sesion"></i> ${texts.viewAccount}</span></a> 
                    
                    <a href="${PATH}${texts.favoritesPage}" class="links-sesion account-item"><span><i class="fa-regular fa-heart icon-sesion"></i> ${texts.favorites}</span></a>

                    <a role="button" class="links-sesion account-item account-item-danger" id="logout"><span><i class="fa-solid fa-arrow-right-from-bracket"></i> ${texts.logout}</span></a>
                    
                </nav>
                </div>
            </aside>
        </div>
        `;

    // Add logout click handler
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const texts = getAccountMenuTexts(localStorage.getItem('userLanguage') || 'ES');
            showModal.innerHTML = `
                <div id="logout-modal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="logout-modal-title">
                    <div class="modal__backdrop" data-modal-close></div>
                    <section class="modal__panel modal-panel-confirm-logout">
                        <header class="modal__header modal-header-confirm-logout">
                            <h2 id="logout-modal-title" class="modal__title">${texts.confirmLogout}</h2>
                            <button class="modal__close" type="button" aria-label="${texts.closeWindow}" data-modal-close>✕</button>
                        </header>
                        <div class="modal__body modal-body-confirm-logout">
                            <p class="confirm-logout-text">${texts.confirmLogoutText}</p>
                            <div class="confirm-logout-actions">
                                <button type="button" class="btn-confirm-logout-primary" id="confirm-logout-final">${texts.yesLogout} <span id="spinner" class="oculto"></span></button>
                                <button type="button" class="btn-confirm-logout-secondary" data-modal-close>${texts.cancel}</button>
                            </div>
                        </div>
                    </section>
                </div>
            `;
            
            // Setup modal functionality
            setupLogoutModal();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const showModal = document.getElementById('showModal');
    const currentUser = authService.getUser();
    // Leer el idioma directamente de localStorage para asegurar que sea el más reciente
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    const PATH = url.includes('catalogo') || url.includes('catalog') || url.includes('catalogue') || url.includes('katalogoa') ? '../../' : '../'+userLanguage+'/';
    
    // Function to get redirect page after login
    function getRedirectPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (!redirect) return null;
        
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
        const currentLang = localStorage.getItem('userLanguage') || 'ES';
        const redirectMap = redirectMaps[currentLang] || redirectMaps.ES;
        
        return redirectMap[redirect] || null;
    }
    
    // Function to redirect after successful login
    function redirectAfterLogin() {
        const redirectPage = getRedirectPage();
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
            
            const currentLang = localStorage.getItem('userLanguage') || 'ES';
            window.location.href = `${basePath}${currentLang}/${redirectPage}`;
        } else {
            window.location.reload();
        }
    }

    if (!currentUser) {
        // Check if there's a redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        const needsLoginForCheckout = redirect === 'checkout' || redirect === 'finalizar-compra' || redirect === 'commande' || redirect === 'erosketa-bukatu';
        
        // Leer el idioma directamente de localStorage para asegurar que sea el más reciente
        const currentLang = localStorage.getItem('userLanguage') || 'ES';
        
        const loginTextsMaps = {
            ES: {
                title: 'Inicia sesión',
                subtitle: needsLoginForCheckout 
                    ? 'Necesitas iniciar sesión para completar tu compra. Por favor, accede con tu Usuario y Contraseña.'
                    : 'Accede con tu Usuario y Contraseña.',
                username: 'Usuario',
                password: 'Contraseña',
                enter: 'Entrar',
                cancel: 'Cancelar',
                loginMessage: 'Inicia Sesión',
                or: 'o',
                continueWith: 'Continuar con',
                googleDescription: 'Inicia sesión con Google'
            },
            EN: {
                title: 'Sign in',
                subtitle: needsLoginForCheckout 
                    ? 'You need to sign in to complete your purchase. Please sign in with your Username and Password.'
                    : 'Sign in with your Username and Password, Only administrators can sign in.',
                username: 'Username',
                password: 'Password',
                enter: 'Enter',
                cancel: 'Cancel',
                loginMessage: 'Sign in',
                or: 'or',
                continueWith: 'Continue with',
                googleDescription: 'Sign in with Google'
            },
            FR: {
                title: 'Se connecter',
                subtitle: needsLoginForCheckout 
                    ? 'Vous devez vous connecter pour finaliser votre achat. Veuillez vous connecter avec votre nom d\'utilisateur et votre mot de passe.'
                    : 'Connectez-vous avec votre nom d\'utilisateur et votre mot de passe.',
                username: 'Nom d\'utilisateur',
                password: 'Mot de passe',
                enter: 'Entrer',
                cancel: 'Annuler',
                loginMessage: 'Se connecter',
                or: 'ou',
                continueWith: 'Continuer avec',
                googleDescription: 'Se connecter avec Google'
            },
            EU: {
                title: 'Saioa hasi',
                subtitle: needsLoginForCheckout 
                    ? 'Erosketa bukatzeko saioa hasi behar duzu. Mesedez, sartu zure erabiltzaile izena eta pasahitza.'
                    : 'Sartu zure erabiltzaile izena eta pasahitza.',
                username: 'Erabiltzaile izena',
                password: 'Pasahitza',
                enter: 'Sartu',
                cancel: 'Utzi',
                loginMessage: 'Saioa hasi',
                or: 'edo',
                continueWith: 'Jarraitu',
                googleDescription: 'Google-rekin saioa hasi'
            }
        };
        const loginTexts = loginTextsMaps[currentLang] || loginTextsMaps.ES;

        showModal.innerHTML = `
            <div class="modal" id="loginModal" aria-hidden="true">
                <div class="modal__backdrop" data-modal-close></div>

                <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="login-title"
                    aria-describedby="login-desc">
                    <button class="modal__close" type="button" aria-label="Cerrar" data-modal-close>×</button>

                    <header class="modal__header">
                        <h2 id="login-title" class="modal__title">${loginTexts.title}</h2>
                        <p id="login-desc" class="modal__subtitle">${loginTexts.subtitle}</p>
                    </header>

                    <form class="modal__form" method="post" id="loginForm">
                        <label class="field">
                            <span class="field__label">${loginTexts.username}</span>
                            <input class="field__input" type="text" id="username" name="username" required />
                        </label>

                        <label class="field">
                            <span class="field__label">${loginTexts.password}</span>
                            <input class="field__input" type="password" id="password" name="password" autocomplete="current-password"
                                required />
                            <i class="fa-solid fa-eye" id="btn-show-password" role="button"></i>
                        </label>

                        <button class="btn btn--primary" type="submit" id="btn-enter">${loginTexts.enter}</button>
                        <button class="btn btn--ghost" type="button" data-modal-close>${loginTexts.cancel}</button>

                        <p class="loginMessage" id="loginMessageBox"><span id="loginMessage">${loginTexts.loginMessage} </span> <span id="spinner" class="oculto"></span></p>
                    </form>

                    <div class="login-divider">
                        <span>${loginTexts.or}</span>
                    </div>

                    <div class="google-signin-container">
                        <p class="google-signin-description">${loginTexts.googleDescription}</p>
                        <div id="google-signin-button"></div>
                    </div>
                </div>
            </div>    
        `;
        
        // Initialize Google Sign-In after modal is created
        let googleButtonInitialized = false;
        function initGoogleSignIn() {
            const buttonElement = document.getElementById('google-signin-button');
            if (!buttonElement) {
                console.log('Google sign-in button element not found');
                return;
            }
            
            // Check if button already has Google content
            if (buttonElement.querySelector('iframe') || buttonElement.querySelector('[data-google-button]')) {
                console.log('Google button already rendered');
                return;
            }
            
            if (window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    if (!googleButtonInitialized) {
                        googleAuth.init();
                        googleButtonInitialized = true;
                    }
                    googleAuth.renderButton('google-signin-button');
                    console.log('Google Sign-In initialized successfully');
                } catch (error) {
                    console.error('Error initializing Google Sign-In:', error);
                }
            } else {
                console.log('Google script not loaded yet, waiting...');
                // Wait for Google script to load (check every 200ms, max 10 seconds)
                let attempts = 0;
                const maxAttempts = 50;
                const checkGoogle = setInterval(() => {
                    attempts++;
                    if (window.google && window.google.accounts && window.google.accounts.id) {
                        try {
                            if (!googleButtonInitialized) {
                                googleAuth.init();
                                googleButtonInitialized = true;
                            }
                            googleAuth.renderButton('google-signin-button');
                            console.log('Google Sign-In initialized after wait');
                        } catch (error) {
                            console.error('Error initializing Google Sign-In:', error);
                        }
                        clearInterval(checkGoogle);
                    } else if (attempts >= maxAttempts) {
                        console.error('Google Sign-In script failed to load after 10 seconds');
                        clearInterval(checkGoogle);
                    }
                }, 200);
            }
        }
        
        // Try to initialize after modal is created
        setTimeout(initGoogleSignIn, 500);
        setTimeout(initGoogleSignIn, 1500);
        
        // Show message on page if there's a redirect and auto-open modal
        const loginMessageContainer = document.getElementById('login-message-container');
        if (loginMessageContainer && needsLoginForCheckout) {
            const pageMessages = {
                ES: {
                    title: 'Inicia sesión para continuar',
                    message: 'Necesitas iniciar sesión para completar tu compra. Por favor, inicia sesión a continuación.',
                    button: 'Abrir formulario de inicio de sesión'
                },
                EN: {
                    title: 'Sign in to Continue',
                    message: 'You need to sign in to complete your purchase. Please sign in below.',
                    button: 'Open Login Form'
                },
                FR: {
                    title: 'Connectez-vous pour continuer',
                    message: 'Vous devez vous connecter pour finaliser votre achat. Veuillez vous connecter ci-dessous.',
                    button: 'Ouvrir le formulaire de connexion'
                },
                EU: {
                    title: 'Saioa hasi jarraitzeko',
                    message: 'Erosketa bukatzeko saioa hasi behar duzu. Mesedez, saioa hasi behean.',
                    button: 'Saioa hasteko formularioa ireki'
                }
            };
            const currentLang = localStorage.getItem('userLanguage') || 'ES';
            const pageMessage = pageMessages[currentLang] || pageMessages.ES;
            
            loginMessageContainer.innerHTML = `
                <div class="login-prompt">
                    <div class="login-prompt-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <h1 class="login-prompt-title">${pageMessage.title}</h1>
                    <p class="login-prompt-message">${pageMessage.message}</p>
                    <button class="btn btn--primary" id="open-login-modal-btn">${pageMessage.button}</button>
                </div>
            `;
            
            // Add click handler to open modal
            document.getElementById('open-login-modal-btn').addEventListener('click', () => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('is-open');
                    loginModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    const usernameInput = document.getElementById('username');
                    if (usernameInput) {
                        setTimeout(() => usernameInput.focus(), 100);
                    }
                }
            });
        }
        
        // Auto-open modal if there's a redirect parameter
        if (redirect) {
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('is-open');
                    loginModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    
                    // Focus on username input
                    const usernameInput = document.getElementById('username');
                    if (usernameInput) {
                        setTimeout(() => usernameInput.focus(), 200);
                    }
                    
                    // Re-initialize Google Sign-In after modal opens
                    setTimeout(() => {
                        initGoogleSignIn();
                    }, 500);
                }
            }, 300);
        }
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            let finderUser;

            async function validateUser() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const loginMessage = document.getElementById('loginMessage');
                const loginMessageBox = document.getElementById('loginMessageBox');
                const btnEnter = document.getElementById('btn-enter');
                const spinner = document.getElementById('spinner');

                const currentLang = localStorage.getItem('userLanguage') || 'ES';
                const messagesMap = {
                    ES: {
                        signingIn: 'Iniciando sesión...',
                        incorrect: 'Usuario o contraseña incorrectos'
                    },
                    EN: {
                        signingIn: 'Signing in...',
                        incorrect: 'Incorrect username or password'
                    },
                    FR: {
                        signingIn: 'Connexion en cours...',
                        incorrect: 'Nom d\'utilisateur ou mot de passe incorrect'
                    },
                    EU: {
                        signingIn: 'Saioa hasten...',
                        incorrect: 'Erabiltzaile izena edo pasahitza okerra'
                    }
                };
                const messages = messagesMap[currentLang] || messagesMap.ES;

                finderUser = await authService.validateLogin(username, password);

                console.log("FinderUser: " + finderUser);

                if (finderUser) {
                    // mostrar es spinner
                    spinner.classList.remove('oculto'); // Aseguramos que se vea
                    spinner.classList.add('spinner-activo');    // Añadimos la clase de animación
                    btnEnter.disabled = true;
                    loginMessage.textContent = messages.signingIn;
                    loginMessageBox.style.color = 'green';
                    loginMessageBox.style.borderColor = 'green';
                    loginMessageBox.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';

                    setTimeout(() => {
                        document.getElementById('loginForm').reset();
                        redirectAfterLogin();
                    }, 1000);

                } else {

                    loginMessage.textContent = messages.incorrect;
                    loginMessageBox.style.color = 'red';
                    loginMessageBox.style.borderColor = 'red';
                    loginMessageBox.style.backgroundColor = 'rgba(231, 46, 0, 0.35)';
                    document.getElementById('loginForm').password.value = '';
                    document.getElementById('loginForm').password.focus();
                }
            }

            validateUser();

        });

        function showPassword() {
            const password = document.getElementById('password');
            const btnShowPassword = document.getElementById('btn-show-password');
            if (password.type === 'password') {
                password.type = 'text';
                btnShowPassword.classList.add('fa-eye-slash');
                btnShowPassword.classList.remove('fa-eye');
            } else {
                password.type = 'password';
                btnShowPassword.classList.add('fa-eye');
                btnShowPassword.classList.remove('fa-eye-slash');
            }
        }
        document.getElementById('btn-show-password').addEventListener('click', showPassword);


    } else {
        // Render account menu using the function
        renderAccountMenu();
    }
    
    // Listen for language changes to update account menu
    window.addEventListener('languageChanged', () => {
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal && logoutModal.classList.contains('is-open')) {
            renderAccountMenu();
            // Re-open the modal after re-rendering
            setTimeout(() => {
                logoutModal.classList.add('is-open');
                logoutModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }, 100);
        }
    });





});



(function () {
    const body = document.body;
    let lastTrigger = null;

    function getFocusable(container) {
        return container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function openModal(selector, trigger) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        lastTrigger = trigger || document.activeElement;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';

        const focusables = getFocusable(modal);
        if (focusables.length) focusables[0].focus();

        function onKey(e) {
            if (e.key === 'Escape') closeModal(modal);
            if (e.key === 'Tab') {
                const list = Array.from(getFocusable(modal));
                if (!list.length) return;
                const first = list[0];
                const last = list[list.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        modal.__keyHandler = onKey;
        document.addEventListener('keydown', onKey);
    }

    function closeModal(modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        if (modal.__keyHandler) {
            document.removeEventListener('keydown', modal.__keyHandler);
        }
        if (lastTrigger && document.contains(lastTrigger)) {
            lastTrigger.focus();
        }
    }

    // Delegación para cualquier botón/elemento con data-modal-open
    document.addEventListener('click', (e) => {
        const opener = e.target.closest('[data-modal-open]');
        if (opener) {
            const sel = opener.getAttribute('data-modal-open');
            openModal(sel, opener);
            return;
        }

        const closer = e.target.closest('[data-modal-close]');
        if (closer) {
            const modal = closer.closest('.modal');
            if (modal) closeModal(modal);
        }
    });


})();


