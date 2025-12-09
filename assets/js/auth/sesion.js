import { authService } from './authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const showModal = document.getElementById('showModal');
    const currentUser = authService.getUser();
    const userLanguage = authService.getLanguage();
    const PATH = url.includes('catalogo') || url.includes('catalog') ? '../../' : '../'+userLanguage+'/';

    if (!currentUser) {
        showModal.innerHTML = `
            <div class="modal" id="loginModal" aria-hidden="true">
                <div class="modal__backdrop" data-modal-close></div>

                <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="login-title"
                    aria-describedby="login-desc">
                    <button class="modal__close" type="button" aria-label="Cerrar" data-modal-close>×</button>

                    <header class="modal__header">
                        <h2 id="login-title" class="modal__title">Inicia sesión</h2>
                        <p id="login-desc" class="modal__subtitle">Accede con tu Usuario y Contraseña.</p>
                    </header>

                    <form class="modal__form" method="post" id="loginForm">
                        <label class="field">
                            <span class="field__label">Usuario</span>
                            <input class="field__input" type="text" id="username" name="username" required />
                        </label>

                        <label class="field">
                            <span class="field__label">Contraseña</span>
                            <input class="field__input" type="password" id="password" name="password" autocomplete="current-password"
                                required />
                            <i class="fa-solid fa-eye" id="btn-show-password" role="button"></i>
                        </label>

                        <button class="btn btn--primary" type="submit" id="btn-enter">Entrar</button>
                        <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>

                        <p class="loginMessage" id="loginMessageBox"><span id="loginMessage">Inicia Sesión </span> <span id="spinner" class="oculto"></span></p>
                    </form>
                </div>
            </div>    
        `;
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

                finderUser = await authService.validateLogin(username, password);

                console.log("FinderUser: " + finderUser);

                if (finderUser) {
                    // mostrar es spinner
                    spinner.classList.remove('oculto'); // Aseguramos que se vea
                    spinner.classList.add('spinner-activo');    // Añadimos la clase de animación
                    btnEnter.disabled = true;
                    loginMessage.textContent = 'Iniciando sesión...';
                    loginMessageBox.style.color = 'green';
                    loginMessageBox.style.borderColor = 'green';
                    loginMessageBox.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';

                    setTimeout(() => {
                        document.getElementById('loginForm').reset();
                        window.location.reload();
                    }, 1000);

                } else {

                    loginMessage.textContent = 'Login incorrecto';
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
                    <div class="user-avatar">${authService.getAvatar()}</div>
                    <div class="user-info">
                    <p class="user-name">${authService.getUser().nombre_completo}</p>
                    <p class="user-email">${authService.getUser().email}</p>
                    </div>
                </div>

                <nav class="account-menu">  
                    <a href="${PATH}perfil.html" class="links-sesion account-item"><span> <i class="fa-regular fa-user icon-sesion"></i> Ver mi cuenta</span></a> 
                    
                    <a href="${PATH}favoritos.html" class="links-sesion account-item"><span><i class="fa-regular fa-heart icon-sesion"></i> Mis favoritos</span></a>

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


