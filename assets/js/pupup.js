import { authService } from "./auth/authService.js";

document.addEventListener('DOMContentLoaded', () => {

    if (authService.isAuthenticated()) {
        // 1. CLAVE ÚNICA para rastrear el popup
        const HAS_SEEN_POPUP_KEY = 'hasSeenFirstPurchasePopup';

        // 2. VERIFICAR si el usuario YA lo ha visto
        // Si la clave existe en localStorage, salimos de la función.
        if (localStorage.getItem(HAS_SEEN_POPUP_KEY) === 'true') {
            // console.log("El usuario ya ha visto este popup.");
            return; // Detiene la ejecución del script del popup
        }

        const modalContainer = document.getElementById('modalContainer');

        // ... (El resto de tu código de inserción de HTML sigue igual) ...
        modalContainer.innerHTML = `
            <div class="popup_content">
                
                <button class="popup_close_btn">&times;</button>
                
                <h2 class="popup_title">¡CODIGO de primera Compra!</h2>
                
                <p class="popup_description">
                    ¿Cansado de cocinar? obten hoy un CODIGO: <span class="popup_discount">15% de descuento</span> en tu primer pedido de comidas precocinadas, listas en 5 minutos. ¡Sabor y Nutrición garantizados!
                </p>

                    <input type="text" class="popup_input" placeholder="example@example.com">
                    
                    <ul class="popup_list">
                        <li class="popup_list_item">
                            <span class="popup_class_name">Comidas listas en minutos</span>
                        </li>
                        <li class="popup_list_item">
                            <span class="popup_class_name">Recetas saludables y variadas</span>
                        </li>
                        <li class="popup_list_item">
                            <span class="popup_class_name">Envío rápido a tu domicilio</span>
                        </li>
                    </ul>

                    <button type="button" class="popup_btn" id="subscribeBtn">
                        ¡Quiero mi 15% de Descuento!
                    </button>

            </div>`;


        const closeButton = document.querySelector('.popup_close_btn');
        const acceptButton = document.getElementById('subscribeBtn');

        /**
         * Función para mostrar el popup
         */
        const showPopup = () => {
            if (modalContainer) {
                modalContainer.classList.remove('hidden');
            }
        };

        /**
         * Función para ocultar el popup Y MARCARLO como visto
         */
        const hideAndMarkSeenPopup = () => {
            if (modalContainer) {
                // 3. MARCAR como visto en localStorage
                localStorage.setItem(HAS_SEEN_POPUP_KEY, 'true');

                // Ocultar el popup
                modalContainer.classList.add('hidden');
            }
        };

        // ----------------------------------------------------
        // LÓGICA DE TEMPORIZACIÓN (7 segundos)
        // ----------------------------------------------------

        setTimeout(showPopup, 7000);

        // ----------------------------------------------------
        // LÓGICA DE CIERRE DEL POPUP - AHORA LLAMA a hideAndMarkSeenPopup
        // ----------------------------------------------------

        // 1. Clic en el botón de cerrar ('X')
        if (closeButton) {
            closeButton.addEventListener('click', hideAndMarkSeenPopup);
        }

        // 2. Clic en el botón principal ("Quiero mi Descuento")
        if (acceptButton) {
            acceptButton.addEventListener('click', hideAndMarkSeenPopup);
        }

        // 3. Clic fuera del contenido (en el backdrop)
        if (modalContainer) {
            modalContainer.addEventListener('click', (event) => {
                if (event.target === modalContainer) {
                    hideAndMarkSeenPopup();
                }
            });
        }
    }
});