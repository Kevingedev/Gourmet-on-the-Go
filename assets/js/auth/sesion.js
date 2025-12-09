import { validateLogin } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    const PATH = urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' ? '../../../' : '../../';
    const showModal = document.getElementById('showModal');
    const currentUser = localStorage.getItem('currentUser');
    const currentUserData = JSON.parse(currentUser);

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

                finderUser = await validateLogin(username, password);

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
        <div class="modal" id="logoutModal" aria-hidden="true">
            <div class="modal__backdrop" data-modal-close></div>

            <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="login-title"
                aria-describedby="login-desc">
                <button class="modal__close" type="button" aria-label="Cerrar" data-modal-close>×</button>

                <div class="modal__header">
                    <h2 id="login-title" class="modal__title">Finalizar sesión</h2>
                    <p id="login-desc" class="modal__subtitle">¿Desea finalizar su sesión?</p>
                </div>

                
                <div class="modal__footer">
                    <button class="btn btn--primary" type="button" id="btn-finalizar">Finalizar Sesión</button>
                    <button class="btn btn--ghost" type="button" data-modal-close>Cancelar</button>
                </div>

                <p id="logoutMessage" class="loginMessage">Saldrás de la sesión en unos segundos... 😞​</p>
                <div style="text-align: center;margin-top: 1rem;"><span id="spinner" class="oculto"></span></div>
            </div>
        </div>    
        `;

        const logoutMessage = document.getElementById('logoutMessage');
        const spinner = document.getElementById('spinner');
        document.getElementById('btn-finalizar').addEventListener('click', () => {

            spinner.classList.remove('oculto'); // Para que aparezca el spinner
            spinner.classList.add('spinner-activo');    // Para que se active el spinner
            spinner.style.width = '50px';
            spinner.style.height = '50px';
            localStorage.removeItem('currentUser');
            logoutMessage.textContent = 'Cerrando sesión...';
            logoutMessage.style.color = 'green';
            logoutMessage.style.borderColor = 'green';
            logoutMessage.style.fontWeight = '600';
            logoutMessage.style.fontSize = '1.2rem';

            logoutMessage.style.backgroundColor = 'rgba(63, 189, 0, 0.35)';

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });

    }

    /* LLAMAR A LA FUNCION PARA VALIDAR EL LOGIN */



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


