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

        // Textos según idioma
        const popupTexts = {
            ES: {
                title: '¡CODIGO de primera Compra!',
                description: '¿Cansado de cocinar? obten hoy un CODIGO: <span class="popup_discount">15% de descuento</span> en tu primer pedido de comidas precocinadas, listas en 5 minutos. ¡Sabor y Nutrición garantizados!',
                placeholder: 'ejemplo@correo.com',
                items: [
                    'Comidas listas en minutos',
                    'Recetas saludables y variadas',
                    'Envío rápido a tu domicilio'
                ],
                button: '¡Quiero mi 15% de Descuento!'
            },
            EN: {
                title: 'First Purchase CODE!',
                description: 'Tired of cooking? Get a CODE today: <span class="popup_discount">15% OFF</span> your first order of pre-cooked meals, ready in 5 minutes. Taste and Nutrition guaranteed!',
                placeholder: 'example@email.com',
                items: [
                    'Meals ready in minutes',
                    'Healthy and varied recipes',
                    'Fast delivery to your home'
                ],
                button: 'I want my 15% Discount!'
            },
            FR: {
                title: 'CODE Première Achat !',
                description: 'Fatigué de cuisiner ? Obtenez un CODE : <span class="popup_discount">15% de réduction</span> sur votre première commande de plats, prêts en 5 minutes. Goût et Nutrition garantis !',
                placeholder: 'exemple@email.com',
                items: [
                    'Repas prêts en quelques minutes',
                    'Recettes saines et variées',
                    'Livraison rapide à domicile'
                ],
                button: 'Je veux mes 15% de réduction !'
            },
            EU: {
                title: 'Lehen Erosketako KODEA!',
                description: 'Sukaldatzeaz nekatuta? Lortu gaur KODE bat: <span class="popup_discount">%15eko deskontua</span> zure lehen eskaeran, 5 minututan prest dauden otorduetan. Zaporea eta Nutrizioa bermatuta!',
                placeholder: 'adibidea@email.com',
                items: [
                    'Otorduak minutu gutxitan prest',
                    'Errezeta osasungarriak eta askotarikoak',
                    'Bidalketa azkarra etxera'
                ],
                button: 'Nire %15eko deskontua nahi dut!'
            }
        };

        // Función para obtener el idioma actual
        function getCurrentLanguage() {
            return localStorage.getItem('userLanguage') || 'ES';
        }

        const currentLang = getCurrentLanguage();
        const texts = popupTexts[currentLang] || popupTexts.ES;

        const modalContainer = document.getElementById('modalContainer');

        // ... (El resto de tu código de inserción de HTML sigue igual) ...
        modalContainer.innerHTML = `
            <div class="popup_content">
                
                <button class="popup_close_btn">&times;</button>
                
                <h2 class="popup_title">${texts.title}</h2>
                
                <p class="popup_description">
                    ${texts.description}
                </p>

                    <input type="text" class="popup_input" placeholder="${texts.placeholder}">
                    
                    <ul class="popup_list">
                        <li class="popup_list_item">
                            <span class="popup_class_name">${texts.items[0]}</span>
                        </li>
                        <li class="popup_list_item">
                            <span class="popup_class_name">${texts.items[1]}</span>
                        </li>
                        <li class="popup_list_item">
                            <span class="popup_class_name">${texts.items[2]}</span>
                        </li>
                    </ul>

                    <button type="button" class="popup_btn" id="subscribeBtn">
                        ${texts.button}
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