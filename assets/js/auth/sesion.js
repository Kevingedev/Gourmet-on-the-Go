import { authService } from './authService.js';
import { googleAuth } from './googleAuth.js';

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const showModal = document.getElementById('showModal');
    const currentUser = authService.getUser();
    const userLanguage = authService.getLanguage();
    const PATH = url.includes('catalogo') || url.includes('catalog') ? '../../' : '../'+userLanguage+'/';
    
    // Function to get redirect page after login
    function getRedirectPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (!redirect) return null;
        
        // Map redirect names to actual page names
        const redirectMap = {
            'checkout': userLanguage === 'EN' ? 'checkout.html' : 'finalizar-compra.html',
            'finalizar-compra': 'finalizar-compra.html'
        };
        
        return redirectMap[redirect] || null;
    }
    
    // Function to redirect after successful login
    function redirectAfterLogin() {
        const redirectPage = getRedirectPage();
        if (redirectPage) {
            const url = window.location.href;
            const urlCategoria = url.split('/');
            let basePath = '';
            
            if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog') {
                basePath = '../../../';
            } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN') {
                basePath = '../';
            } else {
                basePath = './';
            }
            
            window.location.href = `${basePath}${userLanguage}/${redirectPage}`;
        } else {
            window.location.reload();
        }
    }

    if (!currentUser) {
        // Check if there's a redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        const needsLoginForCheckout = redirect === 'checkout' || redirect === 'finalizar-compra';
        
        const loginTexts = userLanguage === 'EN' ? {
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
        } : {
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
        };

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
            const pageMessage = userLanguage === 'EN' 
                ? {
                    title: 'Sign in to Continue',
                    message: 'You need to sign in to complete your purchase. Please sign in below.',
                    button: 'Open Login Form'
                }
                : {
                    title: 'Inicia sesión para continuar',
                    message: 'Necesitas iniciar sesión para completar tu compra. Por favor, inicia sesión a continuación.',
                    button: 'Abrir formulario de inicio de sesión'
                };
            
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

                const messages = userLanguage === 'EN' ? {
                    signingIn: 'Signing in...',
                    incorrect: 'Incorrect username or password'
                } : {
                    signingIn: 'Iniciando sesión...',
                    incorrect: 'Usuario o contraseña incorrectos'
                };

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
                <h2 id="account-modal-logout-title">Mi cuenta</h2>
                <button
                    class="modal-logout-close"
                    type="button"
                    aria-label="Cerrar panel"
                    data-modal-close
                >
                    ✕
                </button>
                </header>

                <div class="modal-logout-body">
                <div class="user-summary">
                    ${authService.getUser().picture 
                        ? `<img src="${authService.getUser().picture}" alt="Avatar" class="user-avatar user-avatar-img" style="width: 40px; height: 40px; border-radius: 999px; object-fit: cover;">`
                        : `<div class="user-avatar">${authService.getAvatar()}</div>`
                    }
                    <div class="user-info">
                    <p class="user-name">${authService.getUser().nombre_completo}</p>
                    <p class="user-email">${authService.getUser().email}</p>
                    </div>
                    
                </div>

                <nav class="account-menu">  
                    <a href="${PATH}${userLanguage === 'EN' ? 'profile.html' : 'perfil.html'}" class="links-sesion account-item"><span> <i class="fa-regular fa-user icon-sesion"></i> ${userLanguage === 'EN' ? 'View my account' : 'Ver mi cuenta'}</span></a> 
                    
                    <a href="${PATH}${userLanguage === 'EN' ? 'favorites.html' : 'favoritos.html'}" class="links-sesion account-item"><span><i class="fa-regular fa-heart icon-sesion"></i> Mis favoritos</span></a>

                    <a role="button" class="links-sesion account-item account-item-danger" id="logout"><span><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</span></a>
                    
                </nav>
                </div>
            </aside>
        </div>
        `;

        document.getElementById('logout').addEventListener('click', () => {
    // Insertar el HTML del modal en el contenedor
            showModal.innerHTML = `
                <div id="logout-modal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="logout-modal-title">
                    <div class="modal__backdrop" data-modal-close></div>
                    <section class="modal__panel modal-panel-confirm-logout">
                        <header class="modal__header modal-header-confirm-logout">
                            <h2 id="logout-modal-title" class="modal__title">Cerrar sesión</h2>
                            <button class="modal__close" type="button" aria-label="Cerrar ventana" data-modal-close>✕</button>
                        </header>
                        <div class="modal__body modal-body-confirm-logout">
                            <p class="confirm-logout-text">¿Seguro que quieres cerrar sesión?</p>
                            <div class="confirm-logout-actions">
                                <button type="button" class="btn-confirm-logout-primary" id="confirm-logout-final">Sí, cerrar sesión <span id="spinner" class="oculto"></span></button>
                                <button type="button" class="btn-confirm-logout-secondary" data-modal-close>Cancelar</button>
                            </div>
                        </div>
                    </section>
                </div>
                `;
            
            // Abrir el modal recién insertado usando tu función existente
            //Abrir manualmente usando las clases (tu sistema ya escucha data-modal-open)
            const newModal = showModal.querySelector('#logout-modal');
            newModal.classList.add('is-open');
            newModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Enfocar primer elemento focusable
            const focusables = newModal.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (focusables.length) focusables[0].focus();
        });
        // Listener dinámico para el botón de confirmación (se ejecuta después del insert)
// Listener global que ya maneja tu sistema + confirmación
        document.addEventListener('click', (e) => {
            // Tu sistema existente maneja data-modal-close automáticamente
            
            // Confirmación de logout
            if (e.target.id === 'confirm-logout-final') {
                const spinner = document.getElementById('spinner');
                spinner.classList.remove('oculto');
                spinner.classList.add('spinner-activo');
                // LÓGICA REAL DE LOGOUT
                console.log('Logout ejecutado');
                document.getElementById('confirm-logout-final').disabled = true;

                setTimeout(() => {
                    authService.logout();
                    window.location.reload();
                }, 2000);

            }
        });
    }





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


